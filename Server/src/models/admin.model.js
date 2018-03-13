const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdminSchema = new Schema({
    _id: Schema.Types.Number,
    login: String,
});

AdminSchema.set('toJSON', {
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

module.exports = mongoose.model('Admin', AdminSchema);
