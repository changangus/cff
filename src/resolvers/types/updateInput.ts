import { Field, InputType } from "type-graphql";

@InputType() // type for register input
export class updateInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  password?: string;
}
;