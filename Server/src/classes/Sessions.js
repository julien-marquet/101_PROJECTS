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
                    console.log(userSession);
                    resolve(utilities.filterForClient(userSession));
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            } else {
                const userSession = utilities.updateSession(existingSession, token);
                this.sessions[token.access_token] = userSession;
                resolve(utilities.filterForClient(userSession));
            }
        });
    }
}

module.exports = Sessions;
