const utilities = require('../utilities/sessions');

class Sessions {
    constructor(log) {
        this.sessions = {};
        this.log = log;
    }
    registerSession(token) {
        const existingSession = this.sessions[token.access_token];
        let userSession;
        if (!existingSession) {
            userSession = utilities.createSession(token);
        } else {
            userSession = utilities.updateSession(existingSession, token);
        }
        this.sessions[token.access_token] = userSession;
        return (utilities.filterForClient(userSession));
    }
}

module.exports = Sessions;
