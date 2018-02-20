const Ajv = require('ajv');

class RequestValidator {
    constructor() {
        this.schemas = {};
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
            console.log(err);
            return (false);
        }
    }
}

module.exports = RequestValidator;
