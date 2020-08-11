import {gql} from "apollo-server-express";

const schema = gql`
    type Query {
        poll(id: ID!): Poll
        pollPrivate(id: ID!, password: String!): Poll
        polls: [Poll]
        search(query: String!): [Poll]
    }

    type Mutation {
        createPoll(input: PollInput): onlyPoll
        addVote(options: [ID!]!, poll_id: ID!): Poll
    }

    type Subscription {
        newVote(poll_id: ID!): Poll
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

module.exports = schema;
