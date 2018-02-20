const Ajv = require('ajv');

class RequestValidator {
    constructor(log) {
        this.schemas = {};
        this.log = log;
    }
    async init() {
        this.schemas = await require('../utilities/JSONSchema/index')();
        return (true);
    }
    validate(schema, data) {
        const ajv = new Ajv();
        try {
            const validate = ajv.compile(this.schemas[schema]);
            return validate(data);
        } catch (err) {
            this.log.error(err);
            return (false);
        }
    }
}

module.exports = RequestValidator;
