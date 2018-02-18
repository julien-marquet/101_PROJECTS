require('dotenv').config();
const restify = require('restify');
const npid = require('npid');

const {name, version, base_url, port} = require('./configs/global.config');
const log = require('./modules/logger')();

const api = restify.createServer({
    log,
    name,
    version,
    url: base_url
});
api.use(restify.plugins.bodyParser({ mapParams: true }));
api.use(restify.plugins.queryParser());

const pid = npid.create('server.pid', true);

api.log.debug({ API_UID: process.env.API_UID, API_SECRET: process.env.API_SECRET }, `Launching ${api.name}`);

const db = require('./modules/db')(api.log);

// ///////////////////////////////////////////////
const Sessions = require('./classes/Sessions');
const Access = require('./classes/Access');
const sender = require('./modules/sender');

const sessions = new Sessions(api.log);
const access = new Access(sessions);

const webTokenController = require('./controllers/session.controller')(sessions);
require('./routes/session.route')(api, webTokenController, null, sender);
require('./routes/test.route')(api, null, access, sender);
// ///////////////////////////////////////////////

const killApp = () => {
    db.close(() => {
        pid.remove();
        process.exit(0);
    });
};

const launchApi = async () => {
    api.log.info('Connection to database established');
    try {
        await sessions.init();
        api.log.debug(`Loaded Admin : ${sessions.admins.map(elem => elem.login).join(', ')}`);
        api.listen(port, () => {
            api.log.info(`${api.name} listening at ${api.url}`);
        });
    } catch (err) {
        api.log.error(err);
        killApp();
    }
};

db.once('open', () => {
    launchApi();
});

process.on('SIGINT', killApp).on('SIGTERM', killApp);
