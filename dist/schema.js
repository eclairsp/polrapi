"use strict";

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type Query {\n        poll(id: ID!): Poll\n        pollPrivate(id: ID!, password: String!): Poll\n        polls: [Poll]\n        search(query: String!): [Poll]\n    }\n\n    type Mutation {\n        createPoll(input: PollInput): onlyPoll\n        addVote(options: [ID!]!, poll_id: ID!): Poll\n    }\n\n    type Subscription {\n        newVote(poll_id: ID!): Poll\n    }\n\n    input OptionInput {\n        option: String!\n    }\n\n    input PollInput {\n        title: String!\n        description: String!\n        privatePoll: Boolean!\n        multipleOption: Boolean!\n        password: String!\n        options: [String!]\n    }\n\n    type onlyPoll {\n        _id: ID!\n        title: String!\n        description: String!\n        privatePoll: Boolean!\n        multipleOption: Boolean!\n        createdAt: Float!\n    }\n\n    type Poll {\n        _id: ID!\n        title: String!\n        description: String!\n        privatePoll: Boolean!\n        multipleOption: Boolean!\n        createdAt: Float!\n        options: [Option]\n    }\n\n    type Option {\n        _id: ID!\n        option: String!\n        vote: Int!\n        pollId: ID!\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var schema = (0, _apolloServerExpress.gql)(_templateObject());
module.exports = schema;