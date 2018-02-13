const utilities = require('../utilities/sessions');

class Sessions {
    constructor(log) {
        this.sessions = {};
        this.log = log;
    }
    findExistingSession(token) {
        const userSession = this.sessions[token];
        if (!userSession) {
            return (null);
        }
        if (utilities.tokenHasExpired(userSession.token)) {
            utilities.refreshUserToken(userSession.token.refresh_token).then((newToken) => {
                const updatedSession = utilities.updateSession(userSession, newToken);
                delete this.sessions[token];
                this.sessions[newToken.access_token] = updatedSession;
                return (updatedSession);
            }).catch((error) => {
                this.log.error({ ...error }, 'Refresh Token Error');
                return (null);
            });
        }
        return (userSession);
    }
}

module.exports = Sessions;
