import { Field, Float, ID, ObjectType } from "type-graphql";
import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { User } from './User';

@ObjectType()
export class Fridge {
  @Field(() => ID, {nullable: true})
  _id: string

  @Field(() => String) 
  @prop({required: true})
  name: string;

  @Field(() => String) 
  @prop({required: true})
  address: string;

  @Field(() => String) 
  @prop({required: true})
  description: string;

  @Field(() => String) 
  @prop()
  imageUrl?: string;

  @Field(() => String) 
  @prop()
  instagram?: string;

  @Field(() => String) 
  @prop()
  twitter?: string;

  @Field(() => User) 
  @prop({ ref: () => User})
  public author: Ref<User>

  @Field(() => Float, {nullable: true}) 
  @prop()
  lat?: number

  @Field(() => Float, {nullable: true}) 
  @prop()
  lng?: number
};

export const Fridges = getModelForClass(Fridge);