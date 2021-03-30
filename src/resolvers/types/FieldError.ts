import { Field, ObjectType } from "type-graphql";

@ObjectType() // type for error resonse
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
;
