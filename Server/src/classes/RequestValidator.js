const Ajv = require('ajv');

class RequestValidator {
    constructor(log) {
        this.schemas = null;
        this.log = log;
    }
    async init() {
        this.schemas = await require('../utilities/JSONSchema/index')();
    }
    validate(schema, data) {
        if (!this.schemas) {
            this.log.error('Class Request Validator hasn\'t been initialized properly');
            return (false);
        }
        const ajv = new Ajv();
        const validate = ajv.compile(this.schemas[schema]);
        if (!validate(data)) {
            console.log(validate.errors);
            return (false);
        }
        return (true);
    }
}

module.exports = RequestValidator;
