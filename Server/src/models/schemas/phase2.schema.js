const { Schema } = require('mongoose');

const Phase2Schema = new Schema({
    content: {
        type: String,
        default: 'Phase2',
    },
});

module.exports = Phase2Schema;
