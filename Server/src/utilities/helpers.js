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
    handleErrors(req, err) {
        let res;
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
