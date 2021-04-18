import { Fridge, Fridges } from '../models/Fridge';
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
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

  @Field()
  imageUrl?: string;
  
  @Field()
  instagram?: string;
  
  @Field()
  twitter?: string;
}

@Resolver()
export class FridgeResolver {
  @Query(() => [Fridge])
  async getAllFridges () :Promise<Fridge[]> {
    return Fridges.find({})
  }

  @Mutation(() => Fridge)
  async createFridge (
    @Arg('inputs') inputs: FridgeInput,
    @Ctx() { req } : MyContext
  ): Promise<Fridge | null> {

      const { name, address, description, instagram, twitter, imageUrl } = inputs;
      const author = await Users.findOne({_id: req.session.userId});
      const response = await geocode(address);
      const { lat, lng } = response.data.results[0].geometry.location;
      
      const fridge = new Fridges({
        name,
        address,
        description,
        instagram,
        twitter,
        author,
        imageUrl: imageUrl ? imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
        lat,
        lng
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