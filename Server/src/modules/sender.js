module.exports = (req, res, next) => {
    res.send(res.toSend);
    next();
};
