const { api42Endpoint, redirect_uri } = require('../configs/global.config');
const request = require('request');
const User = require('../classes/User');
const errors = require('restify-errors');

module.exports = {
    get42UserToken(code) {
        return new Promise((resolve, reject) => {
            request.post(`${api42Endpoint}oauth/token`, {
                form: {
                    client_id: process.env.API_UID,
                    client_secret: process.env.API_SECRET,
                    code,
                    redirect_uri,
                    grant_type: 'authorization_code',
                },
            }, (postErr, postRes, postBody) => {
                if (postErr || !postBody) {
                    reject(new errors.InternalError(postErr));
                } else if (postRes.statusCode === 404) {
                    reject(errors.makeErrFromCode(postRes.statusCode, '42 API error'));
                } else {
                    const parsedBody = JSON.parse(postBody);
                    if (parsedBody.error) {
                        resolve({
                            ...parsedBody,
                            success: false,
                        });
                    } else {
                        resolve({
                            response: {
                                ...parsedBody,
                                expires_at: Math.floor(Date.now() / 1000) + parsedBody.expires_in,
                            },
                            success: true,
                        });
                    }
                }
            });
        });
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
                    reject(new errors.InternalError(getErr));
                } else if (getRes.statusCode === 404) {
                    reject(errors.makeErrFromCode(getRes.statusCode, '42 API error'));
                } else {
                    const parsedBody = JSON.parse(getBody);
                    if (parsedBody.error) {
                        reject(errors.makeErrFromCode(getRes.statusCode, `42 API error : ${parsedBody.error}`));
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
                }
            });
        });
    },
    filterForClient(session) {
        return ({
            user: {
                id: session.user.id,
                login: session.user.login,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                rank: session.user.rank,
            },
            token: {
                access_token: session.token.access_token,
                expires_at: session.token.expires_at,
            },
        });
    },
};
