const errors = require('restify-errors');
const helpers = require('../utilities/helpers');
const utilities = require('../utilities/application');

module.exports = () => ({
    async get(req, res, next) {
        if (!req.params.applicationId) {
            return next(new errors.BadRequestError('Invalid or missing field'));
        }
        let result;
        try {
            result = await utilities.getApplication(req.params.applicationId);
        } catch (err) {
            return (next(helpers.handleErrors(req.log, err)));
        }
        res.toSend = result;
        return next();
    },
    me: {
        async get(req, res, next) {
            let result;
            try {
                result = await utilities.getMyApplications(req.session.user.id);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            res.toSend = result;
            return next();
        },
    },
    cancel: {
        async post(req, res, next) {
            let result;
            if (!req.params.applicationId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                result = await utilities.cancelProjectApplication(req.params.applicationId, req.session.user.id);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            if (result === null) {
                return (next(new errors.ResourceNotFoundError('Application not found')));
            } else if (result === false) {
                return (next(new errors.ForbiddenError('You have no right to do this')));
            }
            res.toSend = {
                message: 'Application canceled',
            };
            return next();
        },
    },
    accept: {
        async post(req, res, next) {
            console.log('bla');
            let id;
            if (!req.params.applicationId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                id = await utilities.acceptProjectApplication(req.params.applicationId, req.session.user.id);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            if (id === null) {
                return (next(new errors.ResourceNotFoundError('Application not found')));
            } else if (id === false) {
                return (next(new errors.ForbiddenError('You have no right to do this')));
            }
            res.toSend = {
                id,
            };
            return next();
        },
    },
    reject: {
        async post(req, res, next) {
            let result;
            if (!req.params.applicationId) {
                return next(new errors.BadRequestError('Invalid or missing field'));
            }
            try {
                result = await utilities.rejectProjectApplication(req.params.applicationId, req.session.user.id);
            } catch (err) {
                return (next(helpers.handleErrors(req.log, err)));
            }
            if (result === null) {
                return (next(new errors.ResourceNotFoundError('Application not found')));
            } else if (result === false) {
                return (next(new errors.ForbiddenError('You have no right to do this')));
            }
            res.toSend = {
                message: 'Application rejected',
            };
            return next();
        },
    },
});
