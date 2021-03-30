import { User, UserModel } from "../models/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { validateEmail, validateRegister } from "../utils/validators";
import { MyContext } from "../types";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { registerInput } from './types/registerInput';
import { loginInput } from './types/loginInput';
import { UserResponse } from './types/UserResponse';
@Resolver()
export class UserResolver {
  /* ********** 
     ME 
   *********** */

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req }: MyContext,
  ) {

    if (!req.session.userId) { // check session 
      return null
    };

    const user = await UserModel.findOne({ _id: req.session.userId });

    return user;
  };

  /* ********** 
     REGISTER 
   *********** */

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: registerInput,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const { firstName, lastName, email, password } = options;
    
    const errors = validateRegister(options);
    if(errors) {
      return { errors }
    };
    
    const hashedPassword = await argon2.hash(password); // hashes password for db storage
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    try {
      await user.save();
      console.log("saving");
    } catch (error) {
      if (error.code === 11000) {  // Duplicate email error
        return {
          errors: [{
            field: 'email',
            message: 'Email already has an account, please login',
          }]
        }
      }
    };
    
    /* 
      store user id session
      this will set a cookie on the user
      and keep them logged in
    */
    req.session.userId = user._id;

    return { user }
  };

  /* ********** 
   LOGIN
 *********** */

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: loginInput,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const { email, password } = options;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return {
        errors: [{
          message: "Email invalid, please register to create an account.",
          field: "email"
        }]
      }
    };
    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return {
        errors: [{
          message: "Incorrect password",
          field: "password"
        }]
      }
    };

    // storing the user id in our session for later access
    req.session.userId = user._id;

    return { user }
  };

  @Mutation(() => Boolean)
  async logout (
    @Ctx() {req, res} : MyContext
  ) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if(err) {
          console.log(err);
          resolve(false);
          return;
        } 
        resolve(true)
      })
    });
  };

  /* ************* 
    FORGOT_PASSWORD
    ************** */ 
  
  @Mutation(()=> Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis } : MyContext
  ) {
    const user = await UserModel.findOne({email});
    if(!user) {
      return true
    }


    const token = v4();
    const key = FORGET_PASSWORD_PREFIX + token;
    redis.set(key, user._id, 'ex', 1000 * 60 * 60 * 2) // 2 hours of validity

    const html = `<a href='http://localhost:3000/change-password/${token}'>Link to reset password</a>`
    sendEmail(user.email, html);

    return true;
  };

    /* ************* 
    CHANGE_PASSWORD
    ************** */ 

  @Mutation(() => UserResponse)
  async changePassword ( 
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if(newPassword.length < 8){
      return {
        errors: [{
          field: 'newPassword',
          message: 'password must be at least 8 characters long'
        }]
      }
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userIdString = await redis.get(key);
    

    if(!userIdString) {
      return {
        errors: [{
          field: 'token',
          message: 'Token Expired'
        }]
      }
    };

    const userId = parseInt(userIdString);
    const user = await UserModel.findOne({_id: userId });

    if(!user) {
      return {
        errors: [{
          field: 'token',
          message: 'This user does not exist'
        }]
      }
    };

    await UserModel.findByIdAndUpdate({_id: userId}, {
      password: await argon2.hash(newPassword)
    });

    req.session.userId = userId

    return {
      user
    }
  } 
}