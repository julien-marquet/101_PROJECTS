module.exports = (api, controller, access, sender) => {
    api.get('test/Admin', access.check(['Admin']), (req, res, next) => {
        res.toSend = {
            ...res.toSend,
            message: 'access Admin',
        };
        next();
    }, sender);
    api.get('test/Student', access.check(['Student', 'Admin']), (req, res, next) => {
        res.toSend = {
            ...res.toSend,
            message: 'access Student',
        };
        next();
    }, sender);
    api.get('test/Visitor', (req, res, next) => {
        res.toSend = {
            ...res.toSend,
            message: 'access Visitor',
        };
        next();
    }, sender);
};
