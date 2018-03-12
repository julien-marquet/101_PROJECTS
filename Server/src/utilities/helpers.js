const errors = require('restify-errors');
const RequestError = require('../classes/RequestError');

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
        } else if (err instanceof RequestError) {
            log.error(`${err.name || 'Unknown Error'} => ${err.message || 'error'}`);
            res = errors.makeErrFromCode(err.status || 500, `${err.name || 'Unknown'} : ${err.message || 'error'}`, err.data || null);
        } else {
            log.error(`${err.name || 'Unknown Error'} => ${err.message || 'error'}`);
            res = errors.makeErrFromCode(err.status || 500, `${err.name || 'Unknown'} : ${err.message || 'error'}`);
        }
        return (res);
    },
};
