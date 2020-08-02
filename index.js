import "dotenv/config";
import "./db/db";
import Poll from "./models/poll";
import Option from "./models/option";
import express from "express";
import {ApolloServer, gql} from "apollo-server-express";

const app = express();

const schema = gql`
    type Query {
        poll(id: ID!): Poll
        pollPrivate(id: ID!, password: String!): Poll
        polls: [Poll]
    }

    type Mutation {
        createPoll(input: PollInput): onlyPoll
        addVote(id: ID!): Option
    }

    input OptionInput {
        option: String!
    }

    input PollInput {
        title: String!
        description: String!
        privatePoll: Boolean!
        multipleOption: Boolean!
        password: String!
        options: [String!]
    }

    type onlyPoll {
        _id: ID!
        title: String!
        description: String!
        privatePoll: Boolean!
        multipleOption: Boolean!
        createdAt: Float!
    }

    type Poll {
        _id: ID!
        title: String!
        description: String!
        privatePoll: Boolean!
        multipleOption: Boolean!
        createdAt: Float!
        options: [Option]
    }

    type Option {
        _id: ID!
        option: String!
        vote: Int!
        pollId: ID!
    }
`;

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
    Query: {
        poll: async (parent, args) => {
            let poll = await Poll.findOne({_id: args.id}).populate("options");
            if (poll.privatePoll) {
                throw new Error("Can only get public polls.");
            }
            return poll;
        },
        pollPrivate: async (parent, args) => {
            let poll = await Poll.findByPassword(args.id, args.password);
            return poll;
        },
        polls: async () => {
            let polls = await Poll.find({privatePoll: false});
            return polls;
        },
    },
    Mutation: {
        createPoll: async (parent, {input}) => {
            const {
                title,
                description,
                privatePoll,
                multipleOption,
                password,
                options,
            } = input;

            // Making a new poll
            const newPoll = new Poll({
                title,
                description,
                privatePoll,
                multipleOption,
                password,
            });
            const newPollSaved = await newPoll.save();
            const id = newPollSaved._id;

            // Adding the options
            if (options.length >= 2) {
                options.forEach(async (option) => {
                    let newOption = new Option({
                        option,
                        vote: 0,
                        pollId: id,
                    });

                    await newOption.save();
                });
            } else {
                throw new Error("At least two options");
            }
            //if poll is
            return newPollSaved;
        },
        addVote: async (parent, {id}) => {
            const vote = await Option.findByIdAndUpdate(
                id,
                {$inc: {vote: 1}},
                {new: true}
            );
            return vote;
        },
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({app, path: "/graphql"});

app.listen({port: process.env.PORT}, () => {
    console.log(
        `Apollo Server on http://localhost:${process.env.PORT}/graphql`
    );
});
