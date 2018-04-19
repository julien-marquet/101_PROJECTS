const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: Schema.Types.Number,
    login: String,
    firstName: String,
    lastName: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
