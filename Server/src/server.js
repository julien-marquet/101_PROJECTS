require('dotenv').config();
const restify = require('restify');
const npid = require('npid');

const globalConfig = require('./configs/global.config');
const log = require('./modules/logger')();

const api = restify.createServer({
    name: globalConfig.name,
    version: globalConfig.version,
    url: globalConfig.base_url,
    log,
});
api.use(restify.plugins.bodyParser({ mapParams: true }));
api.use(restify.plugins.queryParser());

const pid = npid.create('server.pid', true);


api.log.debug({ API_UID: process.env.API_UID, API_SECRET: process.env.API_SECRET }, `Launching ${api.name}`);

const db = require('./modules/db')(api.log);

// ///////////////////////////////////////////////
const Sessions = require('./classes/Sessions');
const Access = require('./classes/Access');

const sessions = new Sessions(api.log);
const access = new Access(sessions);

const webTokenController = require('./controllers/session.controller')(sessions);
require('./routes/session.route')(api, webTokenController);
require('./routes/test.route')(api, null, access);
// ///////////////////////////////////////////////

const killApp = () => {
    db.close(() => {
        pid.remove();
        process.exit(0);
    });
};

db.once('open', () => {
    api.log.info('Connection to database established');
    sessions.init().then(() => {
        api.log.debug(`Loaded Admin : ${sessions.admins.map(elem => elem.login).join(', ')}`);
        api.listen(globalConfig.port, () => {
            api.log.info(`${api.name} listening at ${api.url}`);
        });
    }).catch((err) => {
        api.log.error(err);
        killApp();
    });
});

process.on('SIGINT', killApp).on('SIGTERM', killApp);
