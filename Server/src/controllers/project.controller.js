const errors = require('restify-errors');
const utilities = require('../utilities/project');
const helpers = require('../utilities/helpers');
const ProjectModel = require('mongoose').model('Project');

module.exports = (sessions, validator) => ({
    async post(req, res, next) {
        if (!validator.validate('project.post', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        const project = await utilities.constructProject(req.body, req.session);
        const Project = new ProjectModel(project);
        let obj;
        try {
            obj = await Project.save();
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            id: obj.toJSON().id,
        };
        return next();
    },
});
