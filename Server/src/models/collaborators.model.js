const mongoose = require('mongoose');

const { Schema } = mongoose;

const CollaboratorSchema = new Schema({
    userId: {
        type: Number,
        required: true,
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    rank: {
        type: String,
        enum: ['Developer', 'Administrator', 'Creator'],
        required: true,
    },
    exitedAt: Date,
    timestamps: {},
});

module.exports = mongoose.model('Collaborator', CollaboratorSchema);

