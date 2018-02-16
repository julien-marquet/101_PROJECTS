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
                    console.log('active');
                    if (rights.includes(this.sessions.getSession(req.headers.access_token).user.rank)) {
                        next();
                    } else {
                        next(new errors.UnauthorizedError('Access forbidden'));
                    }
                    break;
                case 'Expired':
                    // refresh
                    console.log('expired');
                    this.sessions.refreshSession(req.headers.access_token).then((newSession) => {
                        if (rights.includes(newSession.user.rank)) {
                            next();
                        } else {
                            next(new errors.UnauthorizedError('Access forbidden'));
                        }
                    }).catch((err) => {
                        next(err);
                    });
                    break;
                default:
                    console.log('unknown');
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
