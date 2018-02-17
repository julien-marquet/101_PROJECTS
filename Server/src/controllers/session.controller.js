const utilities = require('../utilities/session');
const errors = require('restify-errors');

module.exports = sessions => ({
    async get(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'GET|Token');
        if (req.query.code) {
            try {
                const token = await utilities.get42UserToken(req.query.code);
                sessions.registerSession(token).then((userSession) => {
                    res.toSend = {
                        ...res.toSend,
                        session: userSession,
                    };
                    next();
                }).catch((err) => {
                    req.log.error(err);
                    next(err);
                });
            } catch (err) {
                const error = errors.makeErrFromCode(err.statusCode, JSON.stringify(err.error));
                req.log.debug(error);
                next(error);
            }
        } else {
            req.log.debug('Missing parameter');
            next(new errors.BadRequestError('Missing parameter'));
        }
    },
});
