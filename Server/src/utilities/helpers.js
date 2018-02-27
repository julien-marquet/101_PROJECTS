const errors = require('restify-errors');

module.exports = {
    cleanLeanedResult(input) {
        if (Array.isArray(input)) {
            return (input.map((elem) => {
                const newObj = {
                    ...elem,
                    id: elem._id,
                };
                delete newObj._id;
                delete newObj.__v;
                return newObj;
            }));
        }
        const newObj = {
            ...input,
            id: input._id,
        };
        delete newObj._id;
        delete newObj.__v;
        return (newObj);
    },
    handleErrors(log, err) {
        let res;
        if (!err) {
            res = new errors.InternalError('Unknown error');
        } else if (!err.statusCode) {
            res = new errors.InternalError(err.error ? '' : err);
        } else {
            res = errors.makeErrFromCode(err.statusCode, JSON.stringify(err.error));
        }
        if (res instanceof errors.InternalError) {
            log.error(res);
        } else {
            log.debug(res);
        }
        return (res);
    },
};
