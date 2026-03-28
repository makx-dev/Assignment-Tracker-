const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'late'],
        default: 'pending'
    },
    submittedAt: { type: Date }
});

module.exports = mongoose.model('Submission', submissionSchema);