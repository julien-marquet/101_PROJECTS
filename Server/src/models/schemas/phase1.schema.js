const { Schema } = require('mongoose');

const Phase1Schema = new Schema({
    upvotes: { type: Number, default: 0 },
    endedAt: Date,
}, {
    timestamps: true,
});

module.exports = Phase1Schema;
