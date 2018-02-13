module.exports = {
    tokenHasExpired(token) {
        return (token.checked_at + token.expires_in >= Math.floor(Date.now() / 1000));
    },
    refreshUserToken(refreshToken) {
        // TODO
        return new Promise((resolve, reject) => {
            if (1) {
                reject(new Error('Missing Handler'));
            } else {
                resolve('???');
            }      
        });
    },
    updateSession(oldSession, newToken) {
        return ({
            ...oldSession,
            token: {
                ...newToken,
                checked_at: Math.floor(Date.now() / 1000),
            },
        });
    },
};
