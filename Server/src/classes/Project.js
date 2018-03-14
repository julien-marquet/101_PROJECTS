const ProjectModel = require('mongoose').model('Project');
const CustomError = require('../classes/CustomError');

class Project {
    constructor(log) {
        this.log = log;
        this.json = {};
        this.data = {};
        this.activeRank = null;
    }
    async init(projectId, user) {
        this.data = await ProjectModel.findById({ _id: projectId });
        if (this.data === null) {
            return (null);
        }
        if (user && user.rank === 'Admin') {
            this.activeRank = 'Creator';
        } else if (user) {
            Object.values(this.data.collaborators).some((collab) => {
                if (collab.userId === user.id) {
                    this.activeRank = collab.rank;
                    return true;
                }
                return false;
            });
            if (!this.activeRank) {
                this.activeRank = user.rank;
            }
        } else {
            this.activeRank = 'Visitor';
        }
        if (this.activeRank === 'Visitor' && !this.data.public) {
            throw new CustomError('Forbidden Access', 403);
        }
        this.json = this.data.toJSON();
        return this.json;
    }
    async save(body, session) {
        const saved = {
            ...body,
            collaborators: [{
                userId: session.user.id,
                login: session.user.login,
                rank: 'Creator',
                dateOfEntry: Date.now(),
            }],
            phase: {
                [body.activePhase]: {
                    ...body.phase,
                },
            },
        };
        this.data = new ProjectModel(saved);
        await this.data.save();
        this.json = this.data.toJSON();
        return this.json;
    }
    async update(body) {
        const saved = {
            ...body,
            phase: {
                [this.json.activePhase]: {
                    ...body.phase,
                },
            },
        };
        this.data.set(saved);
        await this.data.save();
        this.json = this.data.toJSON();
        return this.json;
    }
    checkAccess(rankArray) {
        return (rankArray.includes(this.activeRank));
    }
}

module.exports = Project;
