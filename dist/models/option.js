"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodb = require("mongodb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var optionSchema = new _mongoose["default"].Schema({
  option: {
    type: String,
    trim: true,
    required: true
  },
  vote: {
    type: Number,
    validate: function validate(value) {
      if (value < 0) {
        throw new Error("Votes cannot be negative");
      }
    }
  },
  pollId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

var Option = _mongoose["default"].model("Option", optionSchema);

module.exports = Option;