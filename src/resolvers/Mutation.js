import Poll from "../models/poll";
import Option from "../models/option";

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
    addVote: async (parent, {id}) => {
        const vote = await Option.findByIdAndUpdate(
            id,
            {$inc: {vote: 1}},
            {new: true}
        );
        return vote;
    },
};

module.exports = Mutation;
