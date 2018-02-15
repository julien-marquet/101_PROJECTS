const { api42Endpoint } = require('../configs/global.config');
const request = require('request');
const User = require('../classes/User');

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
    createSession(token) {
        return new Promise((resolve, reject) => {
            request.get(`${api42Endpoint}oauth/token/info`, {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                    type: 'application/json',
                },
            }, (getErr, getRes, getBody) => {
                if (getErr || !getBody) {
                    reject(new Error(getErr));
                }
                const parsedBody = JSON.parse(getBody);
                if (parsedBody.error) {
                    reject(new Error(parsedBody));
                } else {
                    const user = new User();
                    user.init(parsedBody.resource_owner_id).then((success) => {
                        if (success) {
                            resolve({
                                user: {
                                    ...user.infos,
                                },
                                token,
                            });
                        } else {
                            user.create(token.access_token).then((error) => {
                                if (error) {
                                    reject(error);
                                }
                                resolve({
                                    user: {
                                        ...user.infos,
                                    },
                                    token,
                                });
                            }).catch((userErr) => {
                                reject(userErr);
                            });
                        }
                    }).catch((userErr) => {
                        reject(userErr);
                    });
                }
            });
        });
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
