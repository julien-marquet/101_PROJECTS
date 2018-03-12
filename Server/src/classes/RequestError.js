module.exports = class extends require('./CustomError') {
    constructor(fields, status) {
        super('Error completing request', status);
        this.fields = fields || {};
    }
};
