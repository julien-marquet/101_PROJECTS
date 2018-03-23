const errors = require('restify-errors');
const helpers = require('../utilities/helpers');
const utilities = require('../utilities/project');
const userUtilities = require('../utilities/user');
const applicationUtilities = require('../utilities/application');

module.exports = (sessions, validator) => ({
    async post(req, res, next) {
        let projectId;
        if (!validator.validate('project.post', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        try {
            projectId = await utilities.saveProject(req.body, req.session);
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            id: projectId,
        };
        req.log.info(`Project created by user ${req.session.user.login}`);
        return next();
    },
    async delete(req, res, next) {
        if (!req.params.projectId) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        try {
            if (await utilities.projectExist(req.params.projectId) === false) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            } else if (await utilities.checkUserAccess(req.params.projectId, req.session.user, ['Creator']) !== true) {
                return (next(new errors.ForbiddenError('Your rank for this project is insufficient')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        try {
            utilities.removeProject(req.params.projectId);
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            message: 'Project succesfully removed',
        };
        req.log.info(`Project deleted by user ${req.session.user.login}`);
        return next();
    },
    async get(req, res, next) {
        if (!req.params.projectId) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        let project;
        try {
            project = await utilities.getProject(req.params.projectId, req.session ? req.session.user : null);
            if (project === null) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            project,
        };
        return next();
    },
    async put(req, res, next) {
        if (!req.params.projectId) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        if (!validator.validate('project.put', req.body)) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        try {
            if (await utilities.projectExist(req.params.projectId) === false) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            } else if (await utilities.checkUserAccess(req.params.projectId, req.session.user, ['Creator', 'Administrator']) !== true) {
                return (next(new errors.ForbiddenError('Your rank for this project is insufficient')));
            }
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        try {
            await utilities.updateProject(req.params.projectId, req.body);
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = {
            message: 'Project succesfully updated',
        };
        return next();
    },
    list: {
        async get(req, res, next) {
            let result;
            try {
                result = await utilities.getListProjects(req.session ? req.session.user : null);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            res.toSend = result;
            return next();
        },
    },
    upvote: {
        async post(req, res, next) {
            let result;
            if (!req.params.projectId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                result = await utilities.addUpvote(req.params.projectId, req.session.user.id);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            if (result === null) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            } else if (result === false) {
                return (next(new errors.BadRequestError('already upvoted')));
            }
            res.toSend = {
                message: 'upvote added',
            };
            return next();
        },
        async delete(req, res, next) {
            let result;
            if (!req.params.projectId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                result = await utilities.removeUpvote(req.params.projectId, req.session.user.id);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            if (result === null) {
                return (next(new errors.ResourceNotFoundError('Project not found')));
            } else if (result === false) {
                return (next(new errors.BadRequestError('not upvoted')));
            }
            res.toSend = {
                message: 'upvote removed',
            };
            return next();
        },
    },
    invite: {
        async post(req, res, next) {
            if (!req.params.projectId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            if (!validator.validate('project.application.post', req.body)) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                const accessGranted = await utilities.checkUserAccess(req.params.projectId, req.session.user, ['Administrator', 'Creator']);
                if (accessGranted === false) {
                    return (next(new errors.ForbiddenError('Your rank for this project is insufficient')));
                } else if (accessGranted !== true) {
                    return (next(new errors.ResourceNotFoundError('Project or user not found')));
                } else if (await userUtilities.userExists(req.body.userId) !== true) {
                    return (next(new errors.ResourceNotFoundError('User not found')));
                } else if (await utilities.isCollaborator(req.params.projectId, req.body.userId) !== false) {
                    return (next(new errors.BadRequestError('User already a collaborator')));
                }
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            try {
                res.toSend = {
                    id: await applicationUtilities.saveProjectApplication(req.params.projectId, req.body.userId, req.session.user.id),
                };
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            return next();
        },
    },
    apply: {
        async post(req, res, next) {
            if (!req.params.projectId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                if (await utilities.projectExist(req.params.projectId) !== true) {
                    return (next(new errors.ResourceNotFoundError('Project not found')));
                } else if (await utilities.isCollaborator(req.params.projectId, req.session.user.id) !== false) {
                    return (next(new errors.BadRequestError('User already a collaborator')));
                }
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            try {
                res.toSend = {
                    id: await applicationUtilities.saveUserApplication(req.params.projectId, req.body.userId, req.session.user.id),
                };
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            return next();
        },
    },
    applications: {
        async get(req, res, next) {
            if (!req.params.projectId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            let result;
            try {
                result = await applicationUtilities.getProjectApplication(req.params.projectId);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            res.toSend = result;
            return next();
        },
    },
});
