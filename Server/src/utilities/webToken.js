const { redirect_uri, api42Endpoint } = require('../configs/global.config');
const request = require('request');

module.exports = {
    get42UserToken(code) {
        return new Promise((resolve, reject) => {
            request.post(`${api42Endpoint}oauth/token`, {
                json: {
                    client_id: process.env.API_UID,
                    client_secret: process.env.API_SECRET,
                    code,
                    redirect_uri,
                    grant_type: 'authorization_code',
                },
            }, (postErr, postRes, postBody) => {
                if (postErr) {
                    reject(new Error(postErr));
                } else if (postBody.error) {
                    resolve({
                        response: {
                            ...postBody,
                            checked_at: Math.floor(Date.now() / 1000),
                        },
                        success: true,
                    });
                } else {
                    resolve({ response: postBody, success: false });
                }
            });
        });
    },
};
