const { Schema } = require('mongoose');

const Phase3Schema = new Schema({
    status: {
        type: String,
        enum: ['Alpha', 'Beta', 'Final Version'],
    },
    version: {
        type: String,
        trim: true,
        default: '1.0',
    },
    linkProjectVersion: {
        type: String,
        trim: true,
    },
    linkTestVersion: {
        type: String,
        trim: true,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = Phase3Schema;
