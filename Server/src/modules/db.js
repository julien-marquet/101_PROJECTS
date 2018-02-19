const databaseConfig = require('../configs/database.config');
const mongoose = require('mongoose');
require('../models/index')();

module.exports = (log) => {
    const db = mongoose.connection;

    log.info(`Trying to connect to DB ${databaseConfig.db}`);
    mongoose.connect(databaseConfig.db, databaseConfig.options).then(
        db.on('error', (err) => {
            log.error(`Database error : ${err.message}`);
        }),
        db.on('disconnected', () => {
            log.warn('Mongoose default connection to DB disconnected');
        }),
    ).catch(() => {
        log.error('api initialization failed');
    });
    return db;
};

