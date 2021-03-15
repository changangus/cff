import "reflect-metadata";
import "colors";
import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
// create express instance:
const app = express();
// connect to our mongo database
const connectDB = async() => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/cff', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoIndex: true
    });
    console.log(`Mongo Connected to: ${conn.connection.host}`.cyan.bold)
  } catch (error) {
    console.log(`Error: ${error}`.red.bold);
    process.exit();
  }
};

connectDB();

const main = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    })
  })
  apolloServer.applyMiddleware({ app, cors: false });
  
  app.listen({port: 4000}, ()=> {
    console.log("Server is listening on port 4000".blue.bold)
  });
};

main().catch((err) => {
  console.log(err.red.bold)
});
