const errors = require('restify-errors');

module.exports = sessions => ({
    check(rights) {
        return ((req, res, next) => {
            if (req.headers.access_token) {
                const userSession = sessions.getSession(req.headers.access_token);
                if (userSession !== null) {
                    if (rights.includes(userSession.user.rank)) {
                        next();
                    } else {
                        next(new errors.UnauthorizedError('Access forbidden'));
                    }
                } else {
                    next(new errors.UnauthorizedError('Wrong access_token'));
                }
            } else {
                next(new errors.UnauthorizedError('No access_token provided'));
            }
        });
    },
});
