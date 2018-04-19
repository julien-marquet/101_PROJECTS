module.exports = class extends require('./CustomError') {
    constructor(step, message, status, data) {
        super(`${step} => ${message}`, status);
        this.name = 'RequestError';
        this.data = data || null;
    }
};
