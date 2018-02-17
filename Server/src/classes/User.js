const UserModel = require('mongoose').model('User');
const { api42Endpoint } = require('../configs/global.config');
const rp = require('request-promise');
const errors = require('restify-errors');
const helpers = require('../utilities/helpers');

class User {
    constructor() {
        this.infos = {};
    }
    async init(id) {
        let obj;
        try {
            obj = await UserModel.findById({ _id: id }).lean().exec();
        } catch (err) {
            throw (new errors.InternalError(err));
        }
        if (obj === null) {
            return (false);
        }
        this.infos = helpers.cleanLeanedResult(obj);
        return (true);
    }
    async create(accessToken) {
        try {
            const userInfo = await rp({
                uri: `${api42Endpoint}v2/me`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    type: 'application/json',
                },
                json: true,
            });
            const dbUser = new UserModel({
                _id: userInfo.id,
                login: userInfo.login,
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
                campus: userInfo.campus[0].id,
            });
            try {
                const obj = await dbUser.save();
                this.infos = (obj.toJSON());
                return (true);
            } catch (err) {
                throw (err);
            }
        } catch (err) {
            throw (err);
        }
    }
}

module.exports = User;
