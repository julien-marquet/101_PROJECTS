const { Schema } = require('mongoose');

const CollaboratorSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
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

module.exports = CollaboratorSchema;
