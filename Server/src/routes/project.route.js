module.exports = (api, controller, access, sender) => {
    api.post('project/', access.check(['Student', 'Admin']), controller.post, sender);
};
