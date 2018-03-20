const mongoose = require('mongoose');

const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    initiator: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Application', ApplicationSchema);
