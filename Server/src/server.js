require('dotenv').config();
const restify = require('restify');
const npid = require('npid');
const corsMiddleware = require('restify-cors-middleware');

const {
    name,
    version,
    baseUrl,
    port,
} = require('./configs/global.config');
const log = require('./modules/logger')();

const api = restify.createServer({
    log,
    name,
    version,
    url: baseUrl,
});
const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*'],
});

api.use(restify.plugins.bodyParser({ mapParams: true }));
api.use(restify.plugins.queryParser());
api.pre(cors.preflight);
api.use(cors.actual);

const pid = npid.create('server.pid', true);

api.log.debug({ API_UID: process.env.API_UID, API_SECRET: process.env.API_SECRET }, `Launching ${api.name}`);

const db = require('./modules/db')(api.log, pid);

// ///////////////////////////////////////////////
const Sessions = require('./classes/Sessions');
const Access = require('./classes/Access');
const RequestValidator = require('./classes/RequestValidator');
const sender = require('./modules/sender');

const sessions = new Sessions(api.log);
const access = new Access(sessions);
const validator = new RequestValidator(api.log);

const killApp = (status) => {
    if (db) {
        db.close(() => {
            pid.remove();
            process.exit(status);
        });
    }
};

const launchApi = async () => {
    await validator.init();
    require('./routes/index')(api, access, sender, sessions, validator);
    api.log.info('Connection to database established');
    try {
        await sessions.init();
        api.log.debug(`Loaded Admin : ${sessions.admins.map(elem => elem.login).join(', ')}`);
        api.listen(port, () => {
            api.log.info(`${api.name} listening at ${api.url}`);
        });
    } catch (err) {
        api.log.error(err);
        killApp(1);
    }
};

db.once('open', () => {
    launchApi();
});

process.on('SIGINT', () => killApp(0)).on('SIGTERM', () => killApp(0));
