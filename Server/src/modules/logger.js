const Logger = require('bunyan');
const globalConfig = require('../configs/global.config');

module.exports = () => {
    const streams = [
        {
            path: './logs/server.log',
            level: 'trace',
        },
    ];
    if (globalConfig.env === 'development') {
        streams.push({
            stream: process.stdout,
            level: globalConfig.debug === true ? 'debug' : 'info',
        });
    }
    const log = new Logger.createLogger({ // eslint-disable-line new-cap
        name: globalConfig.name,
        streams,
        serializers: {
            err: Logger.stdSerializers.err,
            req: Logger.stdSerializers.req,
            res: Logger.stdSerializers.res,
        },
    });
    log.on('error', (err) => {
        process.stdout.write(`Log stream error : ${err}`);
    });
    return (log);
};
