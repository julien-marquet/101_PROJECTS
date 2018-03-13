const ProjectModel = require('mongoose').model('Project');

class Project {
    constructor(log) {
        this.log = log;
        this.data = {};
        this.activeRank = null;
    }
    async init(projectId, user) {
        try {
            this.data = await ProjectModel.findById({ _id: projectId }).lean().exec();
        } catch (err) {
            throw (err);
        }
        if (this.data === null) {
            return (null);
        }
        if (user.rank === 'Admin') {
            this.activeRank = 'Creator';
        } else {
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
        }
        return this.data;
    }
    checkAccess(rankArray) {
        return (rankArray.includes(this.activeRank));
    }
}

module.exports = Project;
