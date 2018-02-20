const requestValidator = require('../utilities/requestValidator');
const errors = require('restify-errors');

module.exports = () => ({
    async post(req, res, next) {
        if (requestValidator.validateJSON('projectPost', req.body)) {
            res.toSend = {
                message: 'ok',
            };
        } else {
            res.toSend = new errors.BadRequestError('Invalid or missing field');
        }

        return next();
    },
});
