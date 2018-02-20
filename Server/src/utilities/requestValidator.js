const schemas = require('./JSONSchema/index')();

module.exports = {
    validateJSON(schema, data) {
        let valid = null;
        try {
            valid = schemas.validate(schema, data);
        } catch (err) {
            return (false);
        }
        return (valid);
    },
};
