import mongoose from "mongoose";
import {Int32} from "mongodb";

const optionSchema = new mongoose.Schema(
    {
        option: {
            type: String,
            trim: true,
            required: true,
        },
        vote: {
            type: Number,
            validate(value) {
                if (value < 0) {
                    throw new Error("Votes cannot be negative");
                }
            },
        },
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Option = mongoose.model("Option", optionSchema);

module.exports = Option;
