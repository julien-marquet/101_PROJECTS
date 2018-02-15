const utilities = require('../utilities/session');
const errors = require('restify-errors');

module.exports = sessions => ({
    get(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'GET|Token');
        if (req.query.code) {
            utilities.get42UserToken(req.query.code).then((token) => {
                if (!token.success) {
                    req.log.debug(token.error);
                    next(new errors.UnauthorizedError(token.error));
                } else {
                    sessions.registerSession(token.response).then((userSession) => {
                        res.send(200, {
                            session: userSession,
                        });
                        next();
                    }).catch((err) => {
                        req.log.error(err);
                        next(err);
                    });
                }
            }).catch((err) => {
                req.log.error(err);
                next(err);
            });
        } else {
            req.log.debug('Missing parameter');
            next(new errors.BadRequestError('Missing parameter'));
        }
    },
});
