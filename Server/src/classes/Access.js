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
                    if (rights.includes(req.session.user.rank) || rights.includes('*')) {
                        return next();
                    }
                    return next(new errors.UnauthorizedError('Access forbidden'));
                case 'Expired':
                    if (rights.includes(this.sessions.getSession(req.headers.access_token).user.rank) || rights.includes('*')) {
                        newSession = await this.sessions.refreshSession(req.headers.access_token);
                        res.toSend = {
                            ...res.toSend,
                            newToken: {
                                access_token: newSession.token.access_token,
                                expires_at: newSession.token.expires_at,
                            },
                        };
                        return next();
                    }
                    return next(new errors.UnauthorizedError('Access forbidden'));
                default:
                    if (rights.includes('*')) {
                        return next();
                    }
                    return next(new errors.UnauthorizedError('No matching session'));
                }
            } else {
                if (rights.includes('*')) {
                    return next();
                }
                return next(new errors.UnauthorizedError('No access_token provided'));
            }
        });
    }
}

module.exports = Access;
