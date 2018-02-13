const mongoose = require('mongoose');

const { Schema } = mongoose;

const TestSchema = new Schema({
    un: { type: String, default: 'Empty' },
    deux: { type: String, default: 'Empty' },
});

module.exports = mongoose.model('Test', TestSchema);
