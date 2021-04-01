import { Fridge, Fridges } from '../models/Fridge';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { MyContext } from '../types';
import { Users } from '../models/User';
import { geocode } from '../utils/getGeocodeRes';

@InputType()
class FridgeInput {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  description: string;
}

@Resolver()
export class FridgeResolver {
  @Mutation(() => Fridge)
  async createFridge (
    @Arg('inputs') inputs: FridgeInput,
    @Ctx() { req } : MyContext
  ): Promise<Fridge | null> {
      const { name, address, description } = inputs;
      const author = await Users.findOne({_id: req.session.userId});
      const response = await geocode(address);
      console.log(response.data)
      
      const fridge = new Fridges({
        name,
        address,
        description,
        author,
      });
      
      try {
        await fridge.save()
      } catch (error) {
        console.log(error)
        return null
      }; 
    
      return fridge
  }

}