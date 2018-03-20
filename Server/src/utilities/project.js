const mongoose = require('mongoose');
const CustomError = require('../classes/CustomError');

const ProjectModel = mongoose.model('Project');
const ApplicationModel = mongoose.model('Application');

module.exports = {
    async checkUserAccess(projectId, userId, ranks) {
        let userRank;
        try {
            userRank = await ProjectModel.findOne({
                _id: mongoose.Types.ObjectId(projectId),
                collaborators: {
                    $elemMatch: {
                        userId,
                    },
                },
            }).select('-_id collaborators.$').lean();
        } catch (err) {
            return null;
        }
        try {
            return ranks.includes(userRank.collaborators[0].rank);
        } catch (err) {
            return false;
        }
    },
    async saveApplication(projectId, userId, initiator) {
        if (await ApplicationModel.count({ projectId, userId }) !== 0) {
            throw new CustomError('the Application already exist', 400);
        }
        const _id = mongoose.Types.ObjectId();
        const application = new ApplicationModel({
            _id,
            projectId: mongoose.Types.ObjectId(projectId),
            userId,
            type: 'project',
            initiator,
        });
        await application.save();
        return _id;
    },
};
