import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String, {nullable: true})
  async hello() {
    return "Hello World"
  }
}