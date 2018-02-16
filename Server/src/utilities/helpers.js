module.exports = {
    cleanLeanedResult(input) {
        if (Array.isArray(input)) {
            const newArray = input.map((elem) => {
                const newObj = {
                    ...elem,
                    id: elem._id, // eslint-disable-line no-underscore-dangle
                };
                delete newObj._id; // eslint-disable-line no-underscore-dangle
                delete newObj.__v; // eslint-disable-line no-underscore-dangle
                return newObj;
            });
            return (newArray);
        }
        const newObj = {
            ...input,
            id: input._id, // eslint-disable-line no-underscore-dangle
        };
        delete newObj._id; // eslint-disable-line no-underscore-dangle
        delete newObj.__v; // eslint-disable-line no-underscore-dangle
        return (newObj);
    },
};
