const mongoose = require('mongoose');

const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['user', 'project'],
        required: true,
    },
    initiator: {
        type: Number,
    },
}, {
    timestamps: true,
});

ApplicationSchema.set('toJSON', {
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

module.exports = mongoose.model('Application', ApplicationSchema);
