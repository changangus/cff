"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("colors");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const user_1 = require("./resolvers/user");
const app = express_1.default();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect('mongodb://localhost:27017/cff', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            autoIndex: true
        });
        console.log(`Mongo Connected to: ${conn.connection.host}`.cyan.bold);
    }
    catch (error) {
        console.log(`Error: ${error}`.red.bold);
        process.exit();
    }
});
connectDB();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, user_1.UserResolver],
            validate: false,
        })
    });
    apolloServer.applyMiddleware({ app, cors: false });
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`.blue.bold);
    });
});
main().catch((err) => {
    console.log(err.red.bold);
});
//# sourceMappingURL=index.js.map