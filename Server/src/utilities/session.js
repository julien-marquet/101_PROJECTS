const { api42Endpoint, redirectUri } = require('../configs/global.config');
const request = require('request');
const rp = require('request-promise');
const User = require('../classes/User');
const errors = require('restify-errors');

module.exports = {
    async get42UserToken(code) {
        const res = await rp({
            method: 'POST',
            uri: `${api42Endpoint}oauth/token`,
            form: {
                client_id: process.env.API_UID,
                client_secret: process.env.API_SECRET,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            },
            json: true,
        });
        return ({
            ...res,
            expires_at: Math.floor(Date.now() / 1000) + res.expires_in,
        });
    },
    refreshToken(refreshToken) {
        return new Promise((resolve, reject) => {
            request.post(`${api42Endpoint}oauth/token`, {
                form: {
                    client_id: process.env.API_UID,
                    client_secret: process.env.API_SECRET,
                    refresh_token: refreshToken,
                    redirect_uri: redirectUri,
                    grant_type: 'refresh_token',
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
                            statusCode: postRes.statusCode,
                        });
                    } else {
                        resolve({
                            token: {
                                ...parsedBody,
                                expires_at: Math.floor(Date.now() / 1000) + parsedBody.expires_in,
                            },
                            statusCode: postRes.statusCode,
                        });
                    }
                }
            });
        });
    },
    async createSession(token) {
        const tokenInfo = await rp({
            method: 'GET',
            uri: `${api42Endpoint}oauth/token/info`,
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
            json: true,
        });
        const user = new User();
        try {
            const userExist = await user.init(tokenInfo.resource_owner_id);
            if (userExist) {
                return ({
                    user: {
                        ...user.infos,
                    },
                    token,
                });
            }
            try {
                await user.create(token.access_token);
                return ({
                    user: {
                        ...user.infos,
                    },
                    token,
                });
            } catch (userErr) {
                return (userErr);
            }
        } catch (userErr) {
            return (userErr);
        }
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
