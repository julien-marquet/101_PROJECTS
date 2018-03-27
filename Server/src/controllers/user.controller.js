const utilities = require('../utilities/user');
const helpers = require('../utilities/helpers');
const errors = require('restify-errors');

module.exports = () => ({
    async get(req, res, next) {
        if (!req.params.userId) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        let user;
        try {
            user = await utilities.getUser(req.params.userId, req.session ? req.session.user : null);
            if (user === null) {
                return (next(new errors.ResourceNotFoundError('User not found')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            user,
        };
        return next();
    },
    list: {
        async get(req, res, next) {
            let result;
            try {
                result = await utilities.getListUsers(req.session ? req.session.user : null);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            res.toSend = result;
            return next();
        },
    },
});
