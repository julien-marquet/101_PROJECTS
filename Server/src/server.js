require('dotenv').config();
const restify = require('restify');
const npid = require('npid');

const globalConfig = require('./configs/global.config');
const log = require('./modules/logger')();
const Sessions = require('./classes/Sessions');

const api = restify.createServer({
    name: globalConfig.name,
    version: globalConfig.version,
    url: globalConfig.base_url,
    log,
});
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.queryParser());

const pid = npid.create('server.pid', true);

api.log.debug({ API_UID: process.env.API_UID, API_SECRET: process.env.API_SECRET }, `Launching ${api.name}`);

const sessions = new Sessions(api.log);

const db = require('./modules/db')(api.log);

const webTokenController = require('./controllers/webToken.controller')(sessions);
require('./routes/webToken.route')(api, webTokenController);

db.once('open', () => {
    api.log.info('Connection to database established');
    api.listen(globalConfig.port, () => {
        api.log.info(`${api.name} listening at ${api.url}`);
    });
});

const killApp = () => {
    db.close(() => {
        pid.remove();
        process.exit(0);
    });
};
process.on('SIGINT', killApp).on('SIGTERM', killApp);
