const mongoose = require('mongoose');
const projectUtilities = require('../utilities/project');
const CustomError = require('../classes/CustomError');
const modelUtilities = require('../utilities/modelUtilities');

const ApplicationModel = mongoose.model('Application');

module.exports = {
    async rejectProjectApplication(applicationId, userId) {
        const app = await ApplicationModel.findById({ _id: applicationId });
        if (app === null) {
            return (null);
        }
        if (app.type === 'project') {
            if (userId === app.userId) {
                await app.remove();
                return true;
            }
        } else if (projectUtilities.checkUserAccess(app.projectId, userId, ['Creator', 'Administrator'])) {
            await app.remove();
            return true;
        }
        return false;
    },
    async cancelProjectApplication(applicationId, userId) {
        const app = await ApplicationModel.findById({ _id: applicationId });
        if (app === null) {
            return (null);
        }
        if (app.type === 'project') {
            if (projectUtilities.checkUserAccess(app.projectId, userId, ['Creator', 'Administrator'])) {
                await app.remove();
                return true;
            }
        } else if (userId === app.userId) {
            await app.remove();
            return true;
        }
        return false;
    },
    async acceptProjectApplication(applicationId, userId) {
        const app = await ApplicationModel.findById({ _id: applicationId });
        if (app === null) {
            return (null);
        }
        if (app.type === 'project') {
            if (userId === app.userId) {
                return projectUtilities.addCollaborator(app);
            }
        } else if (projectUtilities.checkUserAccess(app.projectId, userId, ['Creator', 'Administrator'])) {
            return projectUtilities.addCollaborator(app);
        }
        return false;
    },
    async saveProjectApplication(projectId, userId, initiator) {
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
    async saveUserApplication(projectId, userId) {
        if (await ApplicationModel.count({ projectId, userId }) !== 0) {
            throw new CustomError('the Application already exist', 400);
        }
        const _id = mongoose.Types.ObjectId();
        const application = new ApplicationModel({
            _id,
            projectId: mongoose.Types.ObjectId(projectId),
            userId,
            type: 'user',
        });
        await application.save();
        return _id;
    },
    async getProjectApplication(projectId) {
        const res = await ApplicationModel.find({ projectId: mongoose.Types.ObjectId(projectId) }).lean();
        return res.map(o => modelUtilities.application.toJSON(o));
    },
    async getApplication(applicationId) {
        return ApplicationModel.findById({ _id: applicationId }).lean();
    },
};
