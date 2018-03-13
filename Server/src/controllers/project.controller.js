const errors = require('restify-errors');
const utilities = require('../utilities/project');
const helpers = require('../utilities/helpers');
const ProjectModel = require('mongoose').model('Project');
const Project = require('../classes/Project');

module.exports = (sessions, validator) => ({
    async post(req, res, next) {
        if (!validator.validate('project.post', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        const project = await utilities.constructProject(req.body, req.session);
        const ProjectM = new ProjectModel(project);
        let obj;
        try {
            obj = await ProjectM.save();
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            id: obj.toJSON().id,
        };
        req.log.info(`Project ${project.title} created by user ${req.session.user.login}`);
        return next();
    },
    async delete(req, res, next) {
        const project = new Project();
        try {
            if (await project.init(req.params.projectId, req.session.user) === null) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            } else if (!project.checkAccess(['Creator'])) {
                return (next(new errors.ForbiddenError('Your rank for this project is insufficient')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        try {
            await ProjectModel.remove({ _id: req.params.projectId });
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            message: 'Project succesfully removed',
        };
        req.log.info(`Project ${project.data.title} deleted by user ${req.session.user.login}`);
        return next();
    },
    async get(req, res, next) {
        const project = new Project();
        try {
            if (await project.init(req.params.projectId, req.session ? req.session.user : null) === null) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            project: project.data,
        };
        return next();
    },
    async put(req, res, next) {
        if (!validator.validate('project.put', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        const project = new Project();
        try {
            if (await project.init(req.params.projectId, req.session.user) === null) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            } else if (!project.checkAccess(['Creator', 'Administrator'])) {
                return (next(new errors.ForbiddenError('Your rank for this project is insufficient')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        try {
            await project.update(req.body);
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            message: 'Project succesfully updated',
        };
        return next();
    },
    phase: {
        async post(req, res, next) {
            if (!validator.validate('project.phase.post', req.body)) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            return next();
        },
    },
});
