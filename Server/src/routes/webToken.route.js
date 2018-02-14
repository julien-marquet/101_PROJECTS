module.exports = (api, controller) => {
    api.get('token/', controller.get);
};
