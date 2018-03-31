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

module.exports = mongoose.model('Application', ApplicationSchema);
