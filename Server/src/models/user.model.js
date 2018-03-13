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

UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        const res = {
            ...ret,
            id: ret._id.toString(),
        };
        delete res.__v;
        delete res._id;
        return res;
    },
});

module.exports = mongoose.model('User', UserSchema);
