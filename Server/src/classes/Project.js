const ProjectModel = require('mongoose').model('Project');
const CustomError = require('../classes/CustomError');

class Project {
    constructor(log) {
        this.log = log;
        this.data = {};
        this.activeRank = null;
    }
    async init(projectId, user) {
        this.data = await ProjectModel.findById({ _id: projectId }).lean().exec();
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
        return this.data;
    }
    checkAccess(rankArray) {
        return (rankArray.includes(this.activeRank));
    }
}

module.exports = Project;
