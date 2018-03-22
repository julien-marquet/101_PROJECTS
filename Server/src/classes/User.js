const UserModel = require('mongoose').model('User');
const { api42Endpoint } = require('../configs/global.config');
const rp = require('request-promise');
const RequestError = require('../classes/RequestError');
const modelUtilities = require('../utilities/modelUtilities');

class User {
    constructor() {
        this.infos = {};
    }
    async init(id) {
        const obj = await UserModel.findById({ _id: id }).lean();
        if (obj === null) {
            return (false);
        }
        this.infos = modelUtilities.user.toJSON(obj);
        return (true);
    }
    async create(accessToken) {
        let userInfo;
        try {
            userInfo = await rp({
                uri: `${api42Endpoint}v2/me`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    type: 'application/json',
                },
                json: true,
            });
        } catch (err) {
            throw new RequestError('GetUserInfo', `${err.name} : ${err.error.error}`, err.statusCode);
        }
        const dbUser = new UserModel({
            _id: userInfo.id,
            login: userInfo.login,
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            campus: userInfo.campus[0].id,
        });
        const obj = await dbUser.save();
        this.infos = modelUtilities.user.toJSON(obj);
        return (true);
    }
}

module.exports = User;
