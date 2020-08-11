import "dotenv/config";
import "./src/db/db";

import http from "http";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import schema from "./schema";
import Query from "./src/resolvers/Query";
import Mutation from "./src/resolvers/Mutation";
import Subscription from "./src/resolvers/Subscription";

const app = express();

const resolvers = {
    Query,
    Mutation,
    Subscription,
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({app, path: "/graphql"});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({port: process.env.PORT}, () => {
    console.log(`Apollo Server at /graphql`);
});
