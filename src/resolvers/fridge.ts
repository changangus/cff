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
@InputType()
class UpdateFridgeInput {
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

  @Field()
  id?: string;
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

  @Query(() => Fridge)
  async getFridge(
    @Arg("id") id :string,
  ) {
    return Fridges.findById(id);
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
    @Arg('inputs') inputs: UpdateFridgeInput,
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
    try {
      console.log("in try catch")
      await Fridges.findByIdAndDelete(id);
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
