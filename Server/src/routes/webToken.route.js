module.exports = (api, controller) => {
    api.get('token/', controller.get);
    api.put('token/:token', controller.put);
};
