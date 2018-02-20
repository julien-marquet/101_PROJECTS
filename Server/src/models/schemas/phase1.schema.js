const { Schema } = require('mongoose');

const Phase1Schema = new Schema({
    content: {
        type: String,
        default: 'Phase1',
    },
});

module.exports = Phase1Schema;
