const utilities = require('../utilities/session');
const modelUtilities = require('../utilities/modelUtilities');
const AdminModel = require('mongoose').model('Admin');

class Sessions {
    constructor(log) {
        this.sessions = {};
        this.log = log;
        this.admins = [];
    }
    async init() {
        this.admins = await AdminModel.find().lean();
        this.admins = this.admins.map(o => modelUtilities.admin.toJSON(o));
    }
    async refreshSession(token) {
        const oldSession = this.sessions[token];
        const refreshed = await utilities.refreshToken(oldSession.token.refresh_token);
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
            userSession = await utilities.createSession(token);
            userSession.user.rank = this.assignRank(userSession.user.id);
            this.sessions[token.access_token] = userSession;
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
        this.admins.some((elem) => {
            if (elem.id === id) {
                rank = 'Admin';
                return (true);
            }
            return (false);
        });
        return rank;
    }
}

module.exports = Sessions;
