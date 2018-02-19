module.exports = (api, controller, access, sender) => {
    api.get('test/admin', access.check(['Admin']), (req, res, next) => {
        res.toSend = {
            ...res.toSend,
            message: 'access Admin',
        };
        next();
    }, sender);
    api.get('test/student', access.check(['Student', 'Admin']), (req, res, next) => {
        res.toSend = {
            ...res.toSend,
            message: 'access Student',
        };
        next();
    }, sender);
    api.get('test/visitor', (req, res, next) => {
        res.toSend = {
            ...res.toSend,
            message: 'access Visitor',
        };
        next();
    }, sender);
};
