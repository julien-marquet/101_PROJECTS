module.exports = {
    admin: {
        toJSON(input) {
            const res = {
                ...input,
                id: input._id,
            };
            delete res.__v;
            delete res._id;
            return res;
        },
    },
    application: {
        toJSON(input) {
            const res = {
                ...input,
                id: input._id.toString(),
            };
            delete res.__v;
            delete res._id;
            return res;
        },
    },
    project: {
        list: {
            toJSON(input) {
                const res = {
                    ...input,
                    id: input._id.toString(),
                };
                delete res.__v;
                delete res._id;
                return res;
            },
        },
        toJSON(input) {
            const res = {
                ...input,
                id: input._id.toString(),
                phase: {
                    ...input.phase[input.activePhase],
                    id: input.phase[input.activePhase]._id,
                    nbUpvotes: input.phase[input.activePhase].upvotes.length,
                },
            };
            delete res.phase._id;
            delete res.__v;
            delete res._id;
            return res;
        },
    },
    user: {
        toJSON(input) {
            const res = {
                ...input,
                id: input._id,
            };
            delete res.__v;
            delete res._id;
            return res;
        },
    },
};
