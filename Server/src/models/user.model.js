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
        const res = ret;
        res.id = ret._id;
        delete res._id;
        delete res.__v;
        return res;
    },
};

module.exports = mongoose.model('User', UserSchema);
