const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
    projectID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    parent: Schema.Types.ObjectId,
    phase: Schema.Types.ObjectId,
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', CommentSchema);
