const { Schema } = require('mongoose');

const Phase3Schema = new Schema({
    content: {
        type: String,
        default: 'Phase3',
    },
});

module.exports = Phase3Schema;
