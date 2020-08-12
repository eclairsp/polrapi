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
    pollPrivate: async (parent, {id, password}) => {
        let poll = await Poll.findByPassword(id, password);
        return poll;
    },
    polls: async () => {
        let polls = await Poll.find({privatePoll: false}).sort({
            createdAt: "desc",
        });
        return polls;
    },
    search: async (parent, {query}) => {
        if (query === "") {
            return [];
        }
        let poll = await Poll.find({
            title: {$regex: query, $options: "i"},
            description: {$regex: query, $options: "i"},
            privatePoll: false,
        });
        return poll;
    },
};

module.exports = Query;
