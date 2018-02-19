const mongoose = require('mongoose');

const { Schema } = mongoose;

const Phase4Schema = new Schema({
    content: {
        type: String,
        default: 'Phase4',
    },
});

module.exports = Phase4Schema;
