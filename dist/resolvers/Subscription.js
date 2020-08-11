"use strict";

var _pubsub = _interopRequireDefault(require("./pubsub"));

var _apolloServer = require("apollo-server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Subscription = {
  newVote: _defineProperty({
    subscribe: function subscribe() {
      return _pubsub["default"].asyncIterator(["newVote"]);
    }
  }, "subscribe", (0, _apolloServer.withFilter)(function () {
    return _pubsub["default"].asyncIterator(["newVote"]);
  }, function (payload, _ref) {
    var poll_id = _ref.poll_id;
    return "".concat(payload.newVote._id) === poll_id;
  }))
};
module.exports = Subscription;