const errors = require('restify-errors');
const helpers = require('../utilities/helpers');
const utilities = require('../utilities/project');

module.exports = (sessions, validator) => ({
    async post(req, res, next) {
        if (!req.params.projectId || !validator.validate('comment.post', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
    },
});
