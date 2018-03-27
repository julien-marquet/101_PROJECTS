module.exports = (api, controller, access, sender) => {
    api.get('user/list', access.check(['Student', 'Admin']), controller.list.get, sender);
    api.get('user/:userId', access.check(['Student', 'Admin']), controller.get, sender);
};
