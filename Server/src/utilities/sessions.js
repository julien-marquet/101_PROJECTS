const { redirect_uri, api42Endpoint } = require('../configs/global.config');
const request = require('request');
const User = require('mongoose').model('User');

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
                    User.findById({ _id: parsedBody.resource_owner_id }, (err, obj) => {
                        if (err) {
                            reject(new Error(err));
                        } else if (obj === null) {
                            // Create User
                        } else {
                            // Insert User in Session
                        }
                    });
                }
            });
        });
        // TODO
        // Get token owner

        // Find User in DB
        // UserModel.find({userId: id}, (err, obj) => {
        //     console.log(obj);
        //     console.log(err);
        // });
        // OK = Retrieve info
        // NOT OK = create user
        // Assemble session
        // return
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
