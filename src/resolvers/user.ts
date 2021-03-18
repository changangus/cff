import { User, UserModel } from "../models/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { validateEmail } from "../utils/validators";
import { MyContext } from "../types";

// (Input types are used for arguments) 
@InputType() // type for register input
class registerInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  password: string;
};
@InputType() // type for login input 
class loginInput {
  @Field()
  email: string;
  @Field()
  password: string;
};

@ObjectType() // type for error resonse
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
};

@ObjectType() // Object types you can return from your mutations
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
};

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
    if (!validateEmail(email)) {
      return {
        errors: [{
          field: "email",
          message: "Please enter a valid email"
        }]
      }
    }
    if (password.length < 8) {
      return {
        errors: [{
          field: 'password',
          message: 'Password must be more than 8 characters'
        }]
      }
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
    } catch (error) {
      if (error.code === 11000) {  // Duplicate email error
        return {
          errors: [{
            field: 'email',
            message: 'Email already has an account, please login',
          }]
        }
      }
    }
    
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

}