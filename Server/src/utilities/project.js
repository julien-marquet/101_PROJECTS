const mongoose = require('mongoose');
const CustomError = require('../classes/CustomError');
const modelUtilities = require('../utilities/modelUtilities');

const ProjectModel = mongoose.model('Project');
const CollaboratorModel = mongoose.model('Collaborator');
const ApplicationModel = mongoose.model('Application');

module.exports = {
    async getListProjects(user) {
        let result;
        if (user === null) {
            result = await ProjectModel.find({ public: true }, 'title description').lean();
        } else {
            result = await ProjectModel.find({}, 'title description').lean();
        }
        return result.map(o => modelUtilities.project.list.toJSON(o));
    },
    async addUpvote(projectId, userId) {
        const project = await ProjectModel.findOne({ _id: mongoose.Types.ObjectId(projectId) });
        if (project) {
            if (project.phase[project.activePhase].upvotes.includes(userId)) {
                return false;
            }
            project.phase[project.activePhase].upvotes.push(userId);
            await project.save();
            return true;
        }
        return null;
    },
    async removeUpvote(projectId, userId) {
        const project = await ProjectModel.findOne({ _id: mongoose.Types.ObjectId(projectId) });
        if (project) {
            const index = project.phase[project.activePhase].upvotes.indexOf(userId);
            if (index === -1) {
                return false;
            }
            project.phase[project.activePhase].upvotes.splice(index, 1);
            await project.save();
            return true;
        }
        return null;
    },
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
        let project = await ProjectModel.findById({ _id: projectId }).lean();
        if (project === null) {
            return (null);
        }
        project = modelUtilities.project.toJSON(project);
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
    async checkUserAccess(projectId, user, ranks) {
        let userRank;
        if (user && user.rank === 'Admin') {
            return true;
        }
        try {
            userRank = await CollaboratorModel.findOne({
                projectId: mongoose.Types.ObjectId(projectId),
                userId: user.id,
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
        const res = await ApplicationModel.find({ projectId: mongoose.Types.ObjectId(projectId) }).lean();
        return res.map(o => modelUtilities.project.toJSON(o));
    },
    async addCollaborator(application) {
        const collaboratorId = mongoose.Types.ObjectId();
        const collaborator = new CollaboratorModel({
            _id: collaboratorId,
            userId: application.userId,
            projectId: mongoose.Types.ObjectId(application.projectId),
            rank: 'Developer',
        });
        await collaborator.save();
        await application.remove();
        return collaboratorId;
    },
};
