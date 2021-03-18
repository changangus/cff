import { Field, ID, ObjectType } from "type-graphql";
import { prop, getModelForClass, index, buildSchema } from "@typegoose/typegoose"

@ObjectType()
@index({email: 1}, {unique: true}) // Mongo uses indexes to keep track of unique props
export class User {
  @Field(() => ID, {nullable: true})
  _id: number

  @Field({nullable: true}) 
  @prop({required: true})
  firstName: string;

  @Field({nullable: true}) 
  @prop({required: true})
  lastName: string;

  @Field({nullable: true}) 
  @prop({required: true})
  email: string;

  // Removing the field property removes the ability to select the password from graphql
  @prop({required: true})
  password: string;
};

export const UserModel = getModelForClass(User);
export const UserSchema = buildSchema(User);