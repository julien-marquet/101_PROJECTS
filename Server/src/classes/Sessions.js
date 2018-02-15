const utilities = require('../utilities/session');

class Sessions {
    constructor(log) {
        this.sessions = {};
        this.log = log;
    }
    registerSession(token) {
        return new Promise((resolve, reject) => {
            const existingSession = this.sessions[token.access_token];
            if (!existingSession) {
                utilities.createSession(token).then((userSession) => {
                    this.sessions[token.access_token] = userSession;
                    this.log.info(`Session created for user ${userSession.user.login}`);
                    resolve(utilities.filterForClient(userSession));
                }).catch((err) => {
                    reject(err);
                });
            } else {
                const userSession = utilities.updateSession(existingSession, token);
                this.log.info(`refreshed session for user ${userSession.user.login}`);
                this.sessions[token.access_token] = userSession;
                resolve(utilities.filterForClient(userSession));
            }
        });
    }
    getSession(token) {
        return (this.sessions[token] || null);
    }
}

module.exports = Sessions;
