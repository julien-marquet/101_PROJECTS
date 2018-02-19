const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdminSchema = new Schema({
    _id: Schema.Types.Number,
    login: String,
});

module.exports = mongoose.model('Admin', AdminSchema);
