import { User } from "../../models/User";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from './FieldError';

@ObjectType() // Object types you can return from your mutations
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
;
