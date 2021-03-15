import { User, UserModel, UserSchema } from "../types/User";
import { Arg, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType() // Input types are used for arguments
class UsernameAndPasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
};

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
};

@ObjectType() // Object types you can return from your mutations
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(() => User, {nullable: true})
  user?: User;
};

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register (
    @Arg('options') options: UsernameAndPasswordInput,
  ): Promise<UserResponse> {
    const { username, password } = options
    
    if(username.length <= 2){
      return {
        errors: [{
          field: 'username',
          message: 'Username must be more than 2 characters'
        }]
      }
    };
    
    if(password.length < 8){
      return {
        errors: [{
          field: 'password',
          message: 'Password must be more than 8 characters'
        }]
      }
    };

    const hashedPassword = await argon2.hash(password); // hashes password for db storage

    const user = new UserModel ({
      username,
      password: hashedPassword
    });
    try {
      await user.save();
    } catch (error) {
      console.log(error)
      if(error.code === 11000){
        return {
          errors: [{
            message: 'Username is already taken',
            field: 'username'
          }]
        }
      }
    }

    return {
      user
    }
  }
}