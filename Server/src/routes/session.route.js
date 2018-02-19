module.exports = (api, controller, access, sender) => {
    api.get('session/', controller.get, sender);
};
