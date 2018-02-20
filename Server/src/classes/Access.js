const errors = require('restify-errors');

class Access {
    constructor(sessions) {
        this.sessions = sessions;
    }

    check(rights) {
        return (async (req, res, next) => {
            let newSession;
            if (req.headers.access_token) {
                switch (this.sessions.getSessionStatus(req.headers.access_token)) {
                case 'Active':
                    req.session = this.sessions.getSession(req.headers.access_token);
                    if (rights.includes(req.session.user.rank)) {
                        next();
                    } else {
                        next(new errors.UnauthorizedError('Access forbidden'));
                    }
                    break;
                case 'Expired':
                    if (rights.includes(this.sessions.getSession(req.headers.access_token).user.rank)) {
                        try {
                            newSession = await this.sessions.refreshSession(req.headers.access_token);
                        } catch (err) {
                            next(err);
                        }
                        res.toSend = {
                            ...res.toSend,
                            newToken: {
                                access_token: newSession.token.access_token,
                                expires_at: newSession.token.expires_at,
                            },
                        };
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
