import { ApolloServer } from 'apollo-server-express';
import 'colors';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import { FridgeResolver } from './resolvers/fridge';
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';

// create express instance:
const app = express();
dotenv.config();
// DB
const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/cff'
// connect to our mongo database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoIndex: true,
    });
    console.log(`Mongo Connected to: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(`Error: ${error}`.red.bold);
    process.exit();
  }
};

connectDB();
const main = async () => {
  
  // Redis
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  // cors
  app.use(cors());
  // Session middleware needs to come before apollo so we can use it inside apollo middleware
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        sameSite: 'lax',
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".vercel.app" : undefined
      },
      secret: (process.env.SESSION_SECRET as string),
      proxy: true,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, FridgeResolver],
      validate: false,
    }),
    introspection: true,
    playground: true,
    context: ({ req, res }) => ({ req, res, redis }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`.blue.bold);
  });
};

main().catch((err) => {
  console.log(err.red.bold);
});
