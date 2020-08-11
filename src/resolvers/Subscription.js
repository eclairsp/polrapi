import pubsub from "./pubsub";
import {withFilter} from "apollo-server";

const Subscription = {
    newVote: {
        subscribe: () => pubsub.asyncIterator(["newVote"]),
        subscribe: withFilter(
            () => pubsub.asyncIterator(["newVote"]),
            (payload, {poll_id}) => {
                return `${payload.newVote._id}` === poll_id;
            }
        ),
    },
};

module.exports = Subscription;
