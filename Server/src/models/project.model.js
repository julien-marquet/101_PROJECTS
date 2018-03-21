const mongoose = require('mongoose');
const Phase1Schema = require('../models/schemas/phase1.schema');
const Phase2Schema = require('../models/schemas/phase2.schema');
const Phase3Schema = require('../models/schemas/phase3.schema');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
    activePhase: {
        type: Number,
        min: 1,
        max: 3,
        default: 1,
        required: true,
    },
    public: {
        type: Boolean,
        default: true,
    },
    repository: String,
    description: String,
    title: {
        type: String,
        lowercase: true,
        required: true,
    },
    pitch: String,
    hiring: {
        type: Boolean,
        default: false,
    },
    teamSize: {
        type: Number,
        default: 1,
    },
    jobDescription: {
        type: String,
    },
    phase: {
        1: Phase1Schema,
        2: Phase2Schema,
        3: Phase3Schema,
    },
}, {
    timestamps: true,
});

ProjectSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        const res = {
            ...ret,
            id: ret._id.toString(),
            phase: {
                ...ret.phase[ret.activePhase],
                id: ret.phase[ret.activePhase]._id,
            },
        };
        delete res.phase._id;
        delete res.__v;
        delete res._id;
        return res;
    },
});

module.exports = mongoose.model('Project', ProjectSchema);
