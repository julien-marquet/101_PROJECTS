const mongoose = require('mongoose');

const { Schema } = mongoose;

const CollaboratorSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        required: true,
    },
    login: {
        type: String,
        lowercase: true,
        trim: true,
    },
    rank: {
        type: String,
        enum: ['Developer', 'Administrator', 'Creator'],
        required: true,
    },
    dateOfEntry: {
        type: Date,
        required: true,
    },
    dateOfExit: {
        type: Date,
    },
});

module.exports = CollaboratorSchema;
