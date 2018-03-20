const UserModel = require('mongoose').model('User');

module.exports = {
    async  userExists(userId) {
        return (await UserModel.count({ _id: userId }) > 0);
    },
};
