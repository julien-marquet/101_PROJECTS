const utilities = require('../utilities/session');
const helpers = require('../utilities/helpers');
const errors = require('restify-errors');

module.exports = sessions => ({
    async get(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'GET|Token');
        if (req.query.code) {
            try {
                const token = await utilities.get42UserToken(req.query.code);
                try {
                    const userSession = await sessions.registerSession(token);
                    res.toSend = {
                        ...res.toSend,
                        session: userSession,
                    };
                    next();
                } catch (err) {
                    next(helpers.handleErrors(req, err));
                }
            } catch (err) {
                next(helpers.handleErrors(req, err));
            }
        } else {
            next(new errors.BadRequestError('Missing parameter'));
        }
    },
});
