import Poll from "../models/poll";
import Option from "../models/option";
import pubsub from "./pubsub";

const Mutation = {
    createPoll: async (parent, {input}) => {
        const {
            title,
            description,
            privatePoll,
            multipleOption,
            password,
            options,
        } = input;

        // Making a new poll
        const newPoll = new Poll({
            title,
            description,
            privatePoll,
            multipleOption,
            password,
        });
        const newPollSaved = await newPoll.save();
        const id = newPollSaved._id;

        // Adding the options
        if (options.length >= 2) {
            options.forEach(async (option) => {
                let newOption = new Option({
                    option,
                    vote: 0,
                    pollId: id,
                });

                await newOption.save();
            });
        } else {
            throw new Error("At least two options");
        }
        //if poll is
        return newPollSaved;
    },
    addVote: async (parent, {options, poll_id}) => {
        const poll = await Poll.findOne({_id: poll_id});

        // Single vote
        if (!poll.multipleOption && options.length > 1) {
            throw new Error("No multiple options allowed on poll.");
        }

        if (!poll.multipleOption && options.length === 1) {
            await Option.findOneAndUpdate(
                {_id: options[0], pollId: poll_id},
                {$inc: {vote: 1}}
            );

            await Poll.findOneAndUpdate(
                {_id: poll_id},
                {$inc: {totalVotes: 1}}
            );

            let poll = await Poll.findOne({_id: poll_id}).populate("options");
            pubsub.publish("newVote", {
                newVote: poll,
            });
            return poll;
        }

        // Multiple votes
        if (poll.multipleOption && options.length > 0) {
            options.map(async (option) => {
                await Option.findOneAndUpdate(
                    {_id: option, pollId: poll_id},
                    {$inc: {vote: 1}},
                    {new: true}
                );
            });

            await Poll.findOneAndUpdate(
                {_id: poll_id},
                {$inc: {totalVotes: options.length}}
            );

            let poll = await Poll.findOne({_id: poll_id}).populate("options");
            pubsub.publish("newVote", {
                newVote: poll,
            });
            return poll;
        }
    },
};

module.exports = Mutation;
