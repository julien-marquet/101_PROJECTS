const utilities = require('../utilities/session');
const helpers = require('../utilities/helpers');
const errors = require('restify-errors');

module.exports = sessions => ({
    async get(req, res, next) {
        let userSession;
        let token;
        req.log.debug({ ...req.params, ...req.query }, 'GET|Token');
        if (req.query.code) {
            try {
                token = await utilities.get42UserToken(req.query.code);
                userSession = await sessions.registerSession(token);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            res.toSend = {
                ...res.toSend,
                ...userSession,
            };
            return next();
        }
        return (next(new errors.BadRequestError('Missing parameter')));
    },
    async delete(req, res, next) {
        sessions.deleteSession(req.session.token.access_token);
        res.toSend = {
            message: 'Session succesfully deleted',
        };
        return next();
    },
});
