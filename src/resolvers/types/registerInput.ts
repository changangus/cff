import { Field, InputType } from "type-graphql";

@InputType() // type for register input
export class registerInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
;
