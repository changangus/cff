import { Field, ID, ObjectType } from "type-graphql";
import { prop, getModelForClass, buildSchema } from "@typegoose/typegoose"
@ObjectType() // Mongo uses indexes to keep track of unique props
export class User {
  @Field(() => ID, {nullable: true})
  _id: string

  @Field({nullable: true}) 
  @prop({required: true})
  firstName: string;

  @Field({nullable: true}) 
  @prop({required: true})
  lastName: string;

  @Field({nullable: true}) 
  @prop({required: true, unique: true})
  email: string;

  // Removing the field property removes the ability to select the password from graphql
  @prop({required: true})
  password: string;
};

export const Users = getModelForClass(User);
export const UserSchema = buildSchema(User);