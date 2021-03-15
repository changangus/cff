import { Field, ID, ObjectType } from "type-graphql";
import { prop, getModelForClass, index, buildSchema } from "@typegoose/typegoose"

@ObjectType()
@index({username: 1}, {unique: true})
// @index({email: 2}, {unique: true})
export class User {
  @Field(() => ID, {nullable: true})
  _id?: number

  @Field(() => String, {nullable: true}) 
  @prop({required: true, unique: true})
  username?: string;

  @Field({nullable: true}) 
  @prop({required: true})
  password?: string;

  @Field({nullable: true}) 
  @prop()
  email?: string;
};

export const UserModel = getModelForClass(User);
export const UserSchema = buildSchema(User);