module.exports = (api, controller, access, sender) => {
    api.post('application/reject/:applicationId', access.check(['Student', 'Admin']), controller.reject.post, sender);
    api.post('application/accept/:applicationId', access.check(['Student', 'Admin']), controller.accept.post, sender);
    api.post('application/cancel/:applicationId', access.check(['Student', 'Admin']), controller.cancel.post, sender);
    api.get('application/:applicationId', access.check(['Student', 'Admin']), controller.get, sender);
};
