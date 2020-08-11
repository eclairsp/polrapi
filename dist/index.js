"use strict";

require("dotenv/config");

require("@babel/polyfill");

require("./db/db");

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./schema"));

var _Query = _interopRequireDefault(require("./resolvers/Query"));

var _Mutation = _interopRequireDefault(require("./resolvers/Mutation"));

var _Subscription = _interopRequireDefault(require("./resolvers/Subscription"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var resolvers = {
  Query: _Query["default"],
  Mutation: _Mutation["default"],
  Subscription: _Subscription["default"]
};
var server = new _apolloServerExpress.ApolloServer({
  typeDefs: _schema["default"],
  resolvers: resolvers
});
server.applyMiddleware({
  app: app,
  path: "/graphql"
});

var httpServer = _http["default"].createServer(app);

server.installSubscriptionHandlers(httpServer);
httpServer.listen({
  port: process.env.PORT
}, function () {
  console.log("Apollo Server at /graphql");
});