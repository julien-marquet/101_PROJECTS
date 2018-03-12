const ProjectModel = require('mongoose').model('Project');

class Project {
    constructor(log) {
        this.log = log;
        this.project = {};
        this.activeRank = null;
    }
    async init(projectId, user) {
        try {
            this.project = await ProjectModel.findById({ _id: projectId }).lean().exec();
        } catch (err) {
            throw (err);
        }
        if (this.project === null) {
            return (null);
        }
        if (user.rank === 'Admin') {
            this.activeRank = 'Creator';
        } else {
            Object.values(this.project.collaborators).some((collab) => {
                if (collab.userId === user.id) {
                    this.activeRank = collab.rank;
                    return true;
                }
                return false;
            });
            if (!this.activeRank) {
                this.activeRank = user.rank;
            }
        }
        return this.project;
    }
    checkAccess(rankArray) {
        return (rankArray.includes(this.activeRank));
    }
}

module.exports = Project;
