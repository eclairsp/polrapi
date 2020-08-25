import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const pollSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        privatePoll: {
            type: Boolean,
            required: true,
        },
        multipleOption: {
            type: Boolean,
            required: true,
        },
        password: {
            type: String,
            trim: true,
            minlength: 8,
            default: "",
            validate(value) {
                if (!this.privatePoll) {
                    value = "";
                }
            },
        },
        totalVotes: {
            type: Number,
            validate(value) {
                if (value < 0) {
                    throw new Error("Total votes can't be negative");
                }
            },
        },
        views: {
            type: Number,
            validate(value) {
                if (value < 0) {
                    throw new Error("Can't have negative views");
                }
            },
        },
        popularity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
    }
);

pollSchema.virtual("options", {
    ref: "Option",
    localField: "_id",
    foreignField: "pollId",
    justOne: false, // set true for one-to-one relationship
});

pollSchema.statics.findByPassword = async (id, password) => {
    let poll = await Poll.findOne({_id: id}).populate("options");

    if (!poll) {
        throw new Error("No poll found");
    }

    if (!poll.privatePoll) {
        throw new Error("Only private polls");
    }

    const isMatch = await bcrypt.compare(password, poll.password);
    if (!isMatch) {
        throw new Error("Wrong password");
    }
    return poll;
};

pollSchema.pre("save", async function (next) {
    const poll = this;

    if (!poll.privatePoll) {
        const pw = "";
        poll.password = pw;
        next();
    }

    if (poll.isModified("password") && poll.privatePoll) {
        const pw = await bcrypt.hash(poll.password, saltRounds);
        poll.password = pw;
    }

    next();
});

pollSchema.post("findOneAndUpdate", async function (docs) {
    const poll = this;
    let totalVotes = docs.totalVotes;
    let views = docs.views;

    if (poll._update.$inc.totalVotes) {
        totalVotes = totalVotes + poll._update.$inc.totalVotes;
    }

    if (poll._update.$inc.views) {
        views = views + poll._update.$inc.views;
    }

    if (views != 0 && totalVotes != 0) {
        docs.popularity = views / totalVotes;
    }
    docs.password = "password";
    await docs.save();
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
