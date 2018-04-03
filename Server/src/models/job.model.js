const mongoose = require('mongoose');

const { Schema } = mongoose;

const JobSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    places: {
        type: Number,
        default: 1,
        requred: true,
    },
    label: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
    },
    description: {
        type: String,
    },
    applicant: {
        type: [Number],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Job', JobSchema);

