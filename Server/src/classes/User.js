const UserModel = require('mongoose').model('User');
const { api42Endpoint } = require('../configs/global.config');
const request = require('request');
const errors = require('restify-errors');

class Sessions {
    constructor() {
        this.infos = {};
    }
    init(id) {
        return new Promise((resolve, reject) => {
            UserModel.findById({ _id: id }, (err, obj) => {
                if (err) {
                    reject(new errors.InternalError(err));
                } else if (obj === null) {
                    resolve(false);
                } else {
                    this.infos = obj.toJSON();
                    resolve(true);
                }
            });
        });
    }
    create(accessToken) {
        return new Promise((resolve, reject) => {
            request.get(`${api42Endpoint}v2/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
                        const dbUser = new UserModel({
                            _id: parsedBody.id,
                            login: parsedBody.login,
                            first_name: parsedBody.first_name,
                            last_name: parsedBody.last_name,
                            campus: parsedBody.campus[0].id,
                        });
                        dbUser.save((err, obj) => {
                            if (err) {
                                reject(new errors.InternalError(err));
                            }
                            this.infos = obj.toJSON();
                            resolve();
                        });
                    }
                }
            });
        });
    }
}

module.exports = Sessions;
