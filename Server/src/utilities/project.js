const mongoose = require('mongoose');
const CustomError = require('../classes/CustomError');

const ProjectModel = mongoose.model('Project');
const CollaboratorModel = mongoose.model('Collaborator');
const ApplicationModel = mongoose.model('Application');

module.exports = {
    async removeProject(projectId) {
        await ProjectModel.remove({ _id: mongoose.Types.ObjectId(projectId) });
        await CollaboratorModel.remove({ projectId: mongoose.Types.ObjectId(projectId) });
        await ApplicationModel.remove({ projectId: mongoose.Types.ObjectId(projectId) });
    },
    async updateProject(projectId, body) {
        const project = await ProjectModel.findOne({ _id: mongoose.Types.ObjectId(projectId) });
        if (project === null) {
            return false;
        }
        project.set({
            ...body,
            phase: {
                [project.activePhase]: {
                    ...body.phase,
                },
            },
        });
        await project.save();
        return true;
    },
    async getProject(projectId, user) {
        let project = await ProjectModel.findById({ _id: projectId });
        if (project === null) {
            return (null);
        }
        project = project.toJSON();
        if (!user && project.public === false) {
            throw CustomError('Access forbidden, project isn\'t public', 403);
        }
        return project;
    },
    async saveProject(body, session) {
        const projectId = mongoose.Types.ObjectId();
        const project = new ProjectModel({
            _id: projectId,
            ...body,
            phase: {
                [body.activePhase]: {
                    ...body.phase,
                },
            },
        });
        const collaborator = new CollaboratorModel({
            projectId,
            userId: session.user.id,
            login: session.user.login,
            rank: 'Creator',
            dateOfEntry: Date.now(),
        });
        await project.save();
        try {
            await collaborator.save();
        } catch (err) {
            try {
                await ProjectModel.remove({ _id: projectId });
            } catch (fatal) {
                throw new CustomError(`Critical Error, database intergrity compromised ${fatal}`, 500);
            }
            throw err;
        }
        return projectId;
    },
    async checkUserAccess(projectId, userId, ranks) {
        let userRank;
        try {
            userRank = await CollaboratorModel.findOne({
                projectId: mongoose.Types.ObjectId(projectId),
                userId,
            }).select('rank').lean();
        } catch (err) {
            return null;
        } try {
            return ranks.includes(userRank.rank);
        } catch (err) {
            return false;
        }
    },
    async projectExist(projectId) {
        let res;
        try {
            res = await ProjectModel.count({ _id: mongoose.Types.ObjectId(projectId) }) > 0;
        } catch (err) {
            return false;
        }
        return res;
    },
    async isCollaborator(projectId, userId) {
        return (await CollaboratorModel.count({ projectId: mongoose.Types.ObjectId(projectId), userId }) > 0);
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
        const res = await ApplicationModel.find({ projectId: mongoose.Types.ObjectId(projectId) });
        return res.map(o => o.toJSON());
    },
};
