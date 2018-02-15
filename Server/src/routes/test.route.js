module.exports = (api, controller, access) => {
    api.get('test/', access.check(['Student', 'Admin']), (req, res, next) => {
        console.log('access');
        next();
    });
};
