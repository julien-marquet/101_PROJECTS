module.exports = {
    tokenHasExpired(token) {
        return (token.checked_at + token.expires_in >= Math.floor(Date.now() / 1000));
    },
    updateSession(oldSession, newToken) {
        return ({
            ...oldSession,
            token: {
                ...newToken,
            },
        });
    },
    createSession() {
        // TODO
    },
    filterForClient(session) {
        return ({
            user: {
                id: session.user.id,
            },
            token: {
                access_token: session.token.access_token,
                checked_at: session.token.checked_at,
                expires_in: session.token.expires_in,
            },
        });
    },
};
