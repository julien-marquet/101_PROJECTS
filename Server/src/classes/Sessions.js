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
    async init() {
        let obj;
        try {
            obj = await AdminModel.find().lean().exec();
        } catch (err) {
            throw (new errors.InternalError(err));
        }
        this.admins = helpers.cleanLeanedResult(obj);
        return (true);
    }
    async refreshSession(token) {
        let refreshed;
        const oldSession = this.sessions[token];
        try {
            refreshed = await utilities.refreshToken(oldSession.token.refresh_token);
        } catch (err) {
            throw (err);
        }
        this.sessions[refreshed.token.access_token] = {
            ...oldSession,
            token: {
                ...refreshed.token,
            },
        };
        delete this.sessions[token];
        return (this.sessions[refreshed.token.access_token]);
    }
    async registerSession(token) {
        const existingSession = this.sessions[token.access_token];
        let userSession;
        if (!existingSession) {
            try {
                userSession = await utilities.createSession(token);
            } catch (err) {
                throw (err);
            }
            this.sessions[token.access_token] = {
                ...userSession,
                user: {
                    ...userSession.user,
                    rank: this.assignRank(userSession.user.id),
                },
            };
            this.log.info(`Session created for user ${userSession.user.login}`);
            return (utilities.filterForClient(this.sessions[token.access_token]));
        }
        userSession = {
            ...existingSession,
            token: {
                ...token,
            },
        };
        this.log.info(`refreshed session for user ${userSession.user.login}`);
        this.sessions[token.access_token] = userSession;
        return (utilities.filterForClient(userSession));
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
