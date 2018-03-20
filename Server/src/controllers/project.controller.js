const errors = require('restify-errors');
const helpers = require('../utilities/helpers');
const utilities = require('../utilities/project');
const userUtilities = require('../utilities/user');
const Project = require('../classes/Project');
const ProjectModel = require('mongoose').model('Project');


module.exports = (sessions, validator) => ({
    async post(req, res, next) {
        if (!validator.validate('project.post', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        const project = new Project();
        try {
            await project.save(req.body, req.session);
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            id: project.json.id,
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
        req.log.info(`Project ${project.json.title} deleted by user ${req.session.user.login}`);
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
            project: project.json,
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
        async put(req, res, next) {
            if (!validator.validate('project.phase.put', req.body)) {
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
            if (project.json.activePhase === req.body.activePhase) {
                return next(new errors.BadRequestError('this phase is already active'));
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
    },
    application: {
        invite: {
            async post(req, res, next) {
                if (!validator.validate('project.application.post', req.body)) {
                    return next(new errors.BadRequestError('Invalid or missing field'));
                }
                const accessGranted = await utilities.checkUserAccess(req.params.projectId, req.session.user.id, ['Administrator', 'Creator']);
                if (accessGranted === false) {
                    return (next(new errors.ForbiddenError('Your rank for this project is insufficient')));
                } else if (accessGranted === null) {
                    return (next(new errors.ResourceNotFoundError('Project or user not found')));
                } else if (await userUtilities.userExists(req.body.userId) === false) {
                    return (next(new errors.ResourceNotFoundError('User not found')));
                } else if (await utilities.isCollaborator(req.params.projectId, req.body.userId)) {
                    return (next(new errors.BadRequestError('User already a collaborator')));
                }
                try {
                    res.toSend = {
                        id: await utilities.saveProjectApplication(req.params.projectId, req.body.userId, req.session.user.id),
                    };
                } catch (err) {
                    return (next(helpers.handleErrors(req.log, err)));
                }
                return next();
            },
        },
        apply: {
            async post(req, res, next) {
                if (await utilities.projectExist(req.params.projectId) === false) {
                    return (next(new errors.ResourceNotFoundError('Project not found')));
                } else if (await utilities.isCollaborator(req.params.projectId, req.session.user.id)) {
                    return (next(new errors.BadRequestError('User already a collaborator')));
                }
                try {
                    res.toSend = {
                        id: await utilities.saveUserApplication(req.params.projectId, req.body.userId, req.session.user.id),
                    };
                } catch (err) {
                    return (next(helpers.handleErrors(req.log, err)));
                }
                return next();
            },
        },
    },
});
