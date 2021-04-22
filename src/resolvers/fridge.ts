import { Fridge, Fridges } from '../models/Fridge';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { MyContext } from '../types';
import { User, Users } from '../models/User';
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
  async getAllFridges(): Promise<Fridge[]> {
    return Fridges.find({});
  }

  @Query(() => [Fridge])
  async getMyFridges(@Ctx() { req }: MyContext) {
    const userId = req.session.userId;
    const user = await Users.findOne({ _id: userId });

    if (!user) {
      return {
        error: {
          message: 'Not authorized',
        },
      };
    }

    return Fridges.find({ author: user });
  }

  @Mutation(() => Fridge)
  async createFridge(
    @Arg('inputs') inputs: FridgeInput,
    @Ctx() { req }: MyContext
  ): Promise<Fridge | null> {
    const { name, address, description, instagram, twitter, imageUrl } = inputs;
    const author = await Users.findOne({ _id: req.session.userId });
    const response = await geocode(address);
    const { lat, lng } = response.data.results[0].geometry.location;

    const fridge = new Fridges({
      name,
      address,
      description,
      instagram,
      twitter,
      author,
      imageUrl: imageUrl
        ? imageUrl
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
      lat,
      lng,
    });

    try {
      await fridge.save();
    } catch (error) {
      console.log(error);
      return null;
    }

    return fridge;
  }

  @Mutation(() => Fridge)
  async updateFridge(
    @Arg('inputs') inputs: FridgeInput & {id: string},
    @Ctx() { req }: MyContext
  ): Promise<Fridge | null> {
    const { name, address, description, instagram, twitter, imageUrl, id } = inputs;
    const author = await Users.findOne({ _id: req.session.userId });
    const response = await geocode(address);
    const { lat, lng } = response.data.results[0].geometry.location;

    const fridge = await Fridges.findByIdAndUpdate(id, {
      name,
      address,
      description,
      instagram,
      twitter,
      author: author as User,
      imageUrl: imageUrl
        ? imageUrl
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
      lat,
      lng,
    });

    if(!fridge){
      return null
    } else {
      return fridge
    }
  }

  @Mutation(() => Boolean)
  async deleteFridge(
    @Arg("id") id: string,
    @Ctx() { req }: MyContext
  ){
    const user = await Users.findById(req.session.userId);
    const fridge = await Fridges.findById(id);

    if(!user){
      return {
        error: {
          message: "You must be logged in."
        }
      }
    }

    if(fridge?.author !== user){
      return {
        error: {
          message: "You are not authorized to complete this action."
        }
      }
    }
    try {
      await Fridges.findByIdAndDelete(id);
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
