"use strict";

var _poll2 = _interopRequireDefault(require("../models/poll"));

var _option = _interopRequireDefault(require("../models/option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Query = {
  poll: function () {
    var _poll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args) {
      var poll;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _poll2["default"].findOne({
                _id: args.id
              }).populate("options");

            case 2:
              poll = _context.sent;

              if (!poll.privatePoll) {
                _context.next = 5;
                break;
              }

              throw new Error("Can only get public polls.");

            case 5:
              return _context.abrupt("return", poll);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function poll(_x, _x2) {
      return _poll.apply(this, arguments);
    }

    return poll;
  }(),
  pollPrivate: function () {
    var _pollPrivate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, _ref) {
      var id, password, poll;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = _ref.id, password = _ref.password;
              _context2.next = 3;
              return _poll2["default"].findByPassword(id, password);

            case 3:
              poll = _context2.sent;
              return _context2.abrupt("return", poll);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function pollPrivate(_x3, _x4) {
      return _pollPrivate.apply(this, arguments);
    }

    return pollPrivate;
  }(),
  polls: function () {
    var _polls = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var polls;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _poll2["default"].find({
                privatePoll: false
              }).sort({
                createdAt: "desc"
              });

            case 2:
              polls = _context3.sent;
              return _context3.abrupt("return", polls);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function polls() {
      return _polls.apply(this, arguments);
    }

    return polls;
  }(),
  search: function () {
    var _search = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, _ref2) {
      var query, poll;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              query = _ref2.query;

              if (!(query === "")) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt("return", []);

            case 3:
              _context4.next = 5;
              return _poll2["default"].find({
                title: {
                  $regex: query,
                  $options: "i"
                },
                description: {
                  $regex: query,
                  $options: "i"
                },
                privatePoll: false
              });

            case 5:
              poll = _context4.sent;
              return _context4.abrupt("return", poll);

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function search(_x5, _x6) {
      return _search.apply(this, arguments);
    }

    return search;
  }()
};
module.exports = Query;