const Ajv = require('ajv');
const keyword = require('ajv-keywords');

class RequestValidator {
    constructor(log) {
        this.schemas = null;
        this.log = log;
        this.ajv = new Ajv({ $data: true });
        keyword(this.ajv);
    }
    async init() {
        this.schemas = await require('../utilities/JSONSchema/index')();
    }
    validate(schema, data) {
        if (!this.schemas) {
            this.log.error('Class Request Validator hasn\'t been initialized properly');
            return (false);
        }
        
        const validate = this.ajv.compile(this.schemas[schema]);
        if (!validate(data)) {
            console.log(validate.errors);
            return (false);
        }
        return (true);
    }
}

module.exports = RequestValidator;
