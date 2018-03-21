const { Schema } = require('mongoose');

const Phase1Schema = new Schema({
    upvotes: [Number],
    endedAt: Date,
}, {
    timestamps: true,
});

module.exports = Phase1Schema;
