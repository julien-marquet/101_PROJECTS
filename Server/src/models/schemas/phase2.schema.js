const { Schema } = require('mongoose');

const Phase2Schema = new Schema({
    status: {
        type: String,
        enum: ['Ongoing', 'Paused'],
        required: true,
        default: 'Ongoing',
    },
    linkTestVersion: {
        type: String,
    },
    releaseDate: {
        type: Date,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = Phase2Schema;
