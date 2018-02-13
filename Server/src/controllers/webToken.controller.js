const request = require('request');
const { redirect_uri, api42Endpoint } = require('../configs/global.config');

module.exports = sessions => ({
    get(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'IN  | GET  | Token');
        if (req.query.code) {
            request.post(`${api42Endpoint}oauth/token`, {
                json: {
                    client_id: process.env.API_UID,
                    client_secret: process.env.API_SECRET,
                    code: req.query.code,
                    redirect_uri,
                    grant_type: 'authorization_code',
                },
            }, (postErr, postRes, postBody) => {
                if (postErr) {
                    req.log.error({ postErr }, 'OUT | GET  | Token');
                    next();
                } else if (postBody.error) {
                    res.send({
                        ...postBody,
                    });
                    req.log.warn({ postBody }, 'OUT | GET  | Token');
                    next();
                } else {
                    // Store the token and associate it with a user if it's a new token+
                    res.send({
                        access_token: postBody.access_token,
                        expires_in: postBody.expires_in,
                    });
                    req.log.debug({ postBody }, 'OUT | GET  | Token');
                    next();
                }
            });
        }
    },
    put(req, res, next) {
        req.log.debug({ ...req.params, ...req.query }, 'IN  | PUT  | Token');
        // Refresh the token
        next();
    },
});
