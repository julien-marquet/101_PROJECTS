module.exports = {
    db: 'mongodb://127.0.0.1:27017/projects',
    connect_options: {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 10000,
        poolSize: 10,
        keepAlive: 10000,
    },
};
