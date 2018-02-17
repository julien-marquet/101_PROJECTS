const errors = require('restify-errors');

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
    handleErrors(req, err) {
        let res = {};
        if (!err) {
            res = new errors.InternalError('Unknown error');
        } else if (!err.statusCode) {
            res = new errors.InternalError(JSON.stringify(err.error));
        } else {
            res = errors.makeErrFromCode(err.statusCode, JSON.stringify(err.error));
        }
        if (res instanceof errors.InternalError) {
            req.log.error(res);
        } else {
            req.log.debug(res);
        }
        return (res);
    }
};
