"use strict";

var _poll3 = _interopRequireDefault(require("../models/poll"));

var _option = _interopRequireDefault(require("../models/option"));

var _pubsub = _interopRequireDefault(require("./pubsub"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Mutation = {
  createPoll: function () {
    var _createPoll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, _ref) {
      var input, title, description, privatePoll, multipleOption, password, options, newPoll, newPollSaved, id;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              input = _ref.input;
              title = input.title, description = input.description, privatePoll = input.privatePoll, multipleOption = input.multipleOption, password = input.password, options = input.options; // Making a new poll

              newPoll = new _poll3["default"]({
                title: title,
                description: description,
                privatePoll: privatePoll,
                multipleOption: multipleOption,
                password: password
              });
              _context2.next = 5;
              return newPoll.save();

            case 5:
              newPollSaved = _context2.sent;
              id = newPollSaved._id; // Adding the options

              if (!(options.length >= 2)) {
                _context2.next = 11;
                break;
              }

              options.forEach( /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(option) {
                  var newOption;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          newOption = new _option["default"]({
                            option: option,
                            vote: 0,
                            pollId: id
                          });
                          _context.next = 3;
                          return newOption.save();

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
              _context2.next = 12;
              break;

            case 11:
              throw new Error("At least two options");

            case 12:
              return _context2.abrupt("return", newPollSaved);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function createPoll(_x, _x2) {
      return _createPoll.apply(this, arguments);
    }

    return createPoll;
  }(),
  addVote: function () {
    var _addVote = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, _ref3) {
      var options, poll_id, poll, _poll, _poll2;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              options = _ref3.options, poll_id = _ref3.poll_id;
              _context4.next = 3;
              return _poll3["default"].findOne({
                _id: poll_id
              });

            case 3:
              poll = _context4.sent;

              if (!(!poll.multipleOption && options.length > 1)) {
                _context4.next = 6;
                break;
              }

              throw new Error("No multiple options allowed on poll.");

            case 6:
              if (!(!poll.multipleOption && options.length === 1)) {
                _context4.next = 14;
                break;
              }

              _context4.next = 9;
              return _option["default"].findOneAndUpdate({
                _id: options[0],
                pollId: poll_id
              }, {
                $inc: {
                  vote: 1
                }
              }, {
                "new": true
              });

            case 9:
              _context4.next = 11;
              return _poll3["default"].findOne({
                _id: poll_id
              }).populate("options");

            case 11:
              _poll = _context4.sent;

              _pubsub["default"].publish("newVote", {
                newVote: _poll
              });

              return _context4.abrupt("return", _poll);

            case 14:
              if (!(poll.multipleOption && options.length > 0)) {
                _context4.next = 21;
                break;
              }

              options.map( /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(option) {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return _option["default"].findOneAndUpdate({
                            _id: option,
                            pollId: poll_id
                          }, {
                            $inc: {
                              vote: 1
                            }
                          }, {
                            "new": true
                          });

                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x6) {
                  return _ref4.apply(this, arguments);
                };
              }());
              _context4.next = 18;
              return _poll3["default"].findOne({
                _id: poll_id
              }).populate("options");

            case 18:
              _poll2 = _context4.sent;

              _pubsub["default"].publish("newVote", {
                newVote: _poll2
              });

              return _context4.abrupt("return", _poll2);

            case 21:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function addVote(_x4, _x5) {
      return _addVote.apply(this, arguments);
    }

    return addVote;
  }()
};
module.exports = Mutation;