"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var saltRounds = 10;
var pollSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  privatePoll: {
    type: Boolean,
    required: true
  },
  multipleOption: {
    type: Boolean,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    "default": "",
    validate: function validate(value) {
      if (!this.privatePoll) {
        value = "";
      }
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
});
pollSchema.virtual("options", {
  ref: "Option",
  localField: "_id",
  foreignField: "pollId",
  justOne: false // set true for one-to-one relationship

});

pollSchema.statics.findByPassword = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id, password) {
    var poll, isMatch;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Poll.findOne({
              _id: id
            }).populate("options");

          case 2:
            poll = _context.sent;

            if (poll) {
              _context.next = 5;
              break;
            }

            throw new Error("No poll found");

          case 5:
            if (poll.privatePoll) {
              _context.next = 7;
              break;
            }

            throw new Error("Only private polls");

          case 7:
            _context.next = 9;
            return _bcrypt["default"].compare(password, poll.password);

          case 9:
            isMatch = _context.sent;

            if (isMatch) {
              _context.next = 12;
              break;
            }

            throw new Error("Wrong password");

          case 12:
            return _context.abrupt("return", poll);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

pollSchema.pre("save", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(next) {
    var poll, pw, _pw;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            poll = this;

            if (!poll.privatePoll) {
              pw = "";
              poll.password = pw;
              next();
            }

            if (!(poll.isModified("password") && poll.privatePoll)) {
              _context2.next = 7;
              break;
            }

            _context2.next = 5;
            return _bcrypt["default"].hash(poll.password, saltRounds);

          case 5:
            _pw = _context2.sent;
            poll.password = _pw;

          case 7:
            next();

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}());

var Poll = _mongoose["default"].model("Poll", pollSchema);

module.exports = Poll;