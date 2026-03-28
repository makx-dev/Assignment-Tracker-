console.log('Assignments route loaded');
const express = require('express');
const router = express.Router();

// Consistent lowercase model requires
const Assignment = require('../models/assignment');
const Student    = require('../models/student');
const Submission = require('../models/submission');

// GET all assignments (newest first)
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        console.error('GET Assignments Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST - Create new assignment + auto-create pending submissions for all students
router.post('/', async (req, res) => {
    try {
        const { title, subject, dueDate } = req.body;

        if (!title || !subject || !dueDate) {
            return res.status(400).json({ error: 'Title, subject, and dueDate are required.' });
        }

        const assignment = await Assignment.create({ title, subject, dueDate });

        const students = await Student.find();

        const submissions = students.map(student => ({
            student: student._id,
            assignment: assignment._id,
            status: 'pending'
        }));

        await Submission.insertMany(submissions);

        res.status(201).json({
            assignment,
            message: `Assignment created successfully with ${students.length} pending submissions.`
        });
    } catch (err) {
        console.error('POST Assignment Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE assignment and its related submissions
router.delete('/:id', async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        await Submission.deleteMany({ assignment: req.params.id });
        res.json({ message: 'Assignment and related submissions deleted successfully.' });
    } catch (err) {
        console.error('DELETE Assignment Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;