const utilities = require('../utilities/sessions');
const errors = require('restify-errors');

module.exports = sessions => ({
    get(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'IN  | GET  | Token');
        if (req.query.code) {
            utilities.get42UserToken(req.query.code).then((token) => {
                if (!token.success) {
                    next(new errors.UnauthorizedError(token.error));
                } else {
                    sessions.registerSession(token.response).then((userSession) => {
                        res.send(200, {
                            session: userSession,
                        });
                        next();
                    }).catch((err) => {
                        next(err);
                    });
                }
            }).catch((err) => {
                next(new errors.InternalError(JSON.stringify(err)));
            });
        } else {
            next(new errors.BadRequestError('Missing parameter'));
        }
    },
});
