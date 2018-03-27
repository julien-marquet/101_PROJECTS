module.exports = (api, controller, access, sender) => {
    api.get('session/', controller.get, sender);
    api.del('session/', access.check(['Student', 'Admin']), controller.delete, sender);
};
