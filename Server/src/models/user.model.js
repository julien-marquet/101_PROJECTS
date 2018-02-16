const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: Schema.Types.Number,
    login: String,
    firstName: String,
    lastName: String,
});
UserSchema.options.toJSON = {
    transform(doc, ret) {
        ret.id = ret._id; // eslint-disable-line
        delete ret._id; // eslint-disable-line
        delete ret.__v; // eslint-disable-line
        return ret;
    },
};

module.exports = mongoose.model('User', UserSchema);
