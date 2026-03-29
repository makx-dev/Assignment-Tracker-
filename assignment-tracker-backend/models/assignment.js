const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    deadline: { type: Date, required: true },
    maxMarks:    { type: Number, default: 10 },       
    description: { type: String, default: '' },       
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);