import "reflect-metadata";
import "colors";
import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";
import cors from 'cors';

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
  // Redis 
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  // cors 
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  // Session middleware needs to come before apollo so we can use it inside apollo middleware
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient, 
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__, // cookie only works in https 
      },
      secret: 'QDwfet234Foi764hGt9iklR45EDfv',
      resave: false,
      saveUninitialized: false,
    })
  );

  // Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res})
  })
  apolloServer.applyMiddleware({ app, cors: false });
  const PORT = 4000;
  app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`.blue.bold)
  });
};

main().catch((err) => {
  console.log(err.red.bold)
});
