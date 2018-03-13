const errors = require('restify-errors');
const RequestError = require('../classes/RequestError');

module.exports = {
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
