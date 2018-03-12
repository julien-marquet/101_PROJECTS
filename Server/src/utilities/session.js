const { api42Endpoint, redirectUri } = require('../configs/global.config');
const rp = require('request-promise');
const User = require('../classes/User');
const RequestError = require('../classes/RequestError');

module.exports = {
    async get42UserToken(code) {
        let res;
        try {
            res = await rp({
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
        } catch (err) {
            throw new RequestError('GetUserToken', `${err.name} : ${err.error.error}`, err.statusCode);
        }
        return ({
            ...res,
            expires_at: Math.floor(Date.now() / 1000) + res.expires_in,
        });
    },
    async refreshToken(refreshToken) {
        let newToken;
        try {
            newToken = await rp({
                uri: `${api42Endpoint}oauth/token`,
                form: {
                    client_id: process.env.API_UID,
                    client_secret: process.env.API_SECRET,
                    refresh_token: refreshToken,
                    redirect_uri: redirectUri,
                    grant_type: 'refresh_token',
                },
                json: true,
            });
        } catch (err) {
            throw new RequestError('RefreshToken', `${err.name} : ${err.error.error}`, err.statusCode);
        }
        return ({
            token: {
                ...newToken,
                expires_at: Math.floor(Date.now() / 1000) + newToken.expires_in,
            },
            statusCode: newToken.statusCode,
        });
    },
    async createSession(token) {
        let tokenInfo;
        try {
            tokenInfo = await rp({
                method: 'GET',
                uri: `${api42Endpoint}oauth/token/info`,
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
                json: true,
            });
        } catch (err) {
            throw new RequestError('GetUserToken', `${err.name} : ${err.error.error}`, err.statusCode);
        }
        const user = new User();
        const userExist = await user.init(tokenInfo.resource_owner_id);
        if (userExist) {
            return ({
                user: {
                    ...user.infos,
                },
                token,
            });
        }
        await user.create(token.access_token);
        return ({
            user: {
                ...user.infos,
            },
            token,
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
