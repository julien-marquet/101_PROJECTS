const errors = require('restify-errors');

module.exports = (sessions, validator) => ({
    async post(req, res, next) {
        if (validator.validate('projectPost', req.body)) {
            res.toSend = {
                message: 'ok',
            };
        } else {
            res.toSend = new errors.BadRequestError('Invalid or missing field');
        }

        return next();
    },
});
