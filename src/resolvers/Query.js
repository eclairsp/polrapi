import Poll from "../models/poll";
import Option from "../models/option";

const Query = {
    poll: async (parent, args) => {
        let poll = await Poll.findOne({_id: args.id}).populate("options");
        if (poll.privatePoll) {
            throw new Error("Can only get public polls.");
        }
        return poll;
    },
    pollPrivate: async (parent, args) => {
        let poll = await Poll.findByPassword(args.id, args.password);
        return poll;
    },
    polls: async () => {
        let polls = await Poll.find({privatePoll: false});
        return polls;
    },
};

module.exports = Query;
