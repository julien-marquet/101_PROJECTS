const Ajv = require('ajv');

class RequestValidator {
    constructor(log) {
        this.schemas = null;
        this.log = log;
    }
    async init() {
        this.schemas = await require('../utilities/JSONSchema/index')();
        return (true);
    }
    validate(schema, data) {
        if (!this.schemas) {
            this.log.error('Class Request Validator hasn\'t been initialized properly');
            return (false);
        }
        const ajv = new Ajv();
        try {
            const validate = ajv.compile(this.schemas[schema]);
            return (validate(data));
        } catch (err) {
            this.log.error(err);
            return (false);
        }
    }
}

module.exports = RequestValidator;
