import "dotenv/config";
import "./db/db";

import http from "http";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import schema from "./schema";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";

const app = express();

// const mockPoll = new Poll({
//     title: "Poll 4",
//     description: "Poll 4",
//     privatePoll: false,
//     multipleOption: false,
//     password: "Prabhjyot",
// });

// const mockOption = new Option({
//     option: "Weird option",
//     vote: 0,
//     pollId: "5f26914464fbb21d84634240",
// });

// mockPoll.save(function (err, result) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(result);
//     }
// });

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
    console.log(
        `Apollo Server on http://localhost:${process.env.PORT}/graphql`
    );
});
