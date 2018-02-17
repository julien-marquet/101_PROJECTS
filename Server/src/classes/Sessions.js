const utilities = require('../utilities/session');
const AdminModel = require('mongoose').model('Admin');
const errors = require('restify-errors');
const helpers = require('../utilities/helpers');

class Sessions {
    constructor(log) {
        this.sessions = {};
        this.log = log;
        this.admins = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            AdminModel.find().lean().exec((err, obj) => {
                if (err) {
                    reject(new errors.InternalError(err));
                } else {
                    this.admins = helpers.cleanLeanedResult(obj);
                    resolve();
                }
            });
        });
    }
    refreshSession(token) {
        return new Promise((resolve, reject) => {
            const oldSession = this.sessions[token];
            utilities.refreshToken(oldSession.token.refresh_token).then((refresh) => {
                if (refresh.statusCode === 200) {
                    this.sessions[refresh.token.access_token] = {
                        ...oldSession,
                        token: {
                            ...refresh.token,
                        },
                    };
                    delete this.sessions[token];
                    resolve(this.sessions[refresh.token.access_token]);
                } else {
                    reject(errors.makeErrFromCode(refresh.statusCode, refresh.error));
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
    async registerSession(token) {
        const existingSession = this.sessions[token.access_token];
        if (!existingSession) {
            try {
                const userSession = await utilities.createSession(token);
                this.sessions[token.access_token] = {
                    ...userSession,
                    user: {
                        ...userSession.user,
                        rank: this.assignRank(userSession.user.id),
                    },
                };
                this.log.info(`Session created for user ${userSession.user.login}`);
                return (utilities.filterForClient(this.sessions[token.access_token]));
            } catch (err) {
                return (err);
            }
        } else {
            const userSession = {
                ...existingSession,
                token: {
                    ...token,
                },
            };
            this.log.info(`refreshed session for user ${userSession.user.login}`);
            this.sessions[token.access_token] = userSession;
            return (utilities.filterForClient(userSession));
        }
    }
    getSession(token) {
        return (this.sessions[token] || null);
    }
    getSessionStatus(token) {
        const session = this.sessions[token];
        if (!session) {
            return ('Unknown');
        }
        if (session.token.expires_at <= Math.floor(Date.now() / 1000)) {
            return ('Expired');
        }
        return ('Active');
    }
    assignRank(id) {
        let rank = 'Student';
        this.admins.forEach((elem) => {
            if (elem.id === id) {
                rank = 'Admin';
            }
        });
        return rank;
    }
}

module.exports = Sessions;
