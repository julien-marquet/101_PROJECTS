const mongoose = require('mongoose');

const ProjectModel = mongoose.model('Project');

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
            return userRank.collaborators[0].rank.includes(ranks);
        } catch (err) {
            return false;
        }
    },
};
