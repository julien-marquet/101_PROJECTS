const errors = require('restify-errors');

class Access {
    constructor(sessions) {
        this.sessions = sessions;
    }

    check(rights) {
        return ((req, res, next) => {
            if (req.headers.access_token) {
                const rank = this.sessions.getRank(req.headers.access_token);
                if (rank !== 'Visitor') {
                    if (rights.includes(rank)) {
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
    }
}

module.exports = Access;
