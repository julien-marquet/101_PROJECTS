const errors = require('restify-errors');

class Access {
    constructor(sessions) {
        this.sessions = sessions;
    }

    check(rights) {
        return ((req, res, next) => {
            if (req.headers.access_token) {
                switch (this.sessions.getSessionStatus(req.headers.access_token)) {
                case 'Active':
                    if (rights.includes(this.sessions.getSession(req.headers.access_token).user.rank)) {
                        next();
                    } else {
                        next(new errors.UnauthorizedError('Access forbidden'));
                    }
                    break;
                case 'Expired':
                    if (rights.includes(this.sessions.getSession(req.headers.access_token).user.rank)) {
                        this.sessions.refreshSession(req.headers.access_token).then((newSession) => {
                            res.toSend = {
                                ...res.toSend,
                                newToken: {
                                    access_token: newSession.token.access_token,
                                    expires_at: newSession.token.expires_at,
                                },
                            };
                            next();
                        }).catch((err) => {
                            next(err);
                        });
                    } else {
                        next(new errors.UnauthorizedError('Access forbidden'));
                    }
                    break;
                default:
                    next(new errors.UnauthorizedError('Wrong access_token'));
                    break;
                }
            } else {
                next(new errors.UnauthorizedError('No access_token provided'));
            }
        });
    }
}

module.exports = Access;
