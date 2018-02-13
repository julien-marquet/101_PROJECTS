const utilities = require('../utilities/webToken');
const errors = require('restify-errors');

module.exports = sessions => ({
    get(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'IN  | GET  | Token');
        if (req.query.code) {
            utilities.get42UserToken(req.query.code).then((token) => {
                if (!token.success) {
                    next(new errors.UnauthorizedError(token.response.error));
                } else {
                    res.send(200, {
                        token: {
                            access_token: token.response.access_token,
                            expires_in: token.response.expires_in,
                            checked_at: 0,
                        },
                    });
                    next();
                }
            }).catch((err) => {
                next(new errors.InternalError(JSON.stringify(err)));
            });
        } else {
            next(new errors.BadRequestError('Missing parameter'));
        }
    },
});
