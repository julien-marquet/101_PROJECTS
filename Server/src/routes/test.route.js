module.exports = (api, controller, access) => {
    api.get('test/Admin', access.check(['Admin']), (req, res, next) => {
        res.send('access admin');
        next();
    });
    api.get('test/Student', access.check(['Student', 'Admin']), (req, res, next) => {
        res.send('access student');
        next();
    });
    api.get('test/Visitor', (req, res, next) => {
        res.send('access visitor');
        next();
    });
};
