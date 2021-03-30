import { Field, InputType } from "type-graphql";


@InputType() // type for login input 
export class loginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}
;
