const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: Schema.Types.Number,
    login: String,
    firstName: String,
    lastName: String,
});

module.exports = mongoose.model('User', UserSchema);
