module.exports = (api, controller) => {
    api.get('session/', controller.get);
};
