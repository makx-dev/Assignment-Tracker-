console.log('Assignments route loaded');
const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

const Assignment = require('../models/assignment');
const Student    = require('../models/student');
const Submission = require('../models/submission');

// GET all assignments (newest first)
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        return res.json(assignments);
    } catch (err) {
        console.error('GET Assignments Error:', err);
        return res.status(500).json({ error: err.message });
    }
});

// POST - Create new assignment + auto-create pending submissions
router.post('/', async (req, res) => {
  try {
    const { title, subject, maxMarks, description, desc, dueDate, deadline } = req.body;
    
    const finalDeadline = deadline || dueDate;
    const finalDescription = description || desc || "";

    if (!title || !subject || !finalDeadline) {
      return res.status(400).json({ error: 'Title, subject, and deadline are required' });
    }

    const assignment = await Assignment.create({ 
      title,
      subject,
      deadline: finalDeadline,
      dueDate: finalDeadline, // Added to prevent schema strict-mode drops
      maxMarks: maxMarks || 20,
      description: finalDescription
    });

    const students = await Student.find();
    
    // FIX: Prevent Mongoose crash if there are 0 students
    if (students.length > 0) {
      const submissions = students.map(student => ({
        student: student._id,
        assignment: assignment._id,
        status: 'pending'
      }));
      await Submission.insertMany(submissions);
    }

    return res.status(201).json({ 
      assignment, 
      message: `Assignment created with ${students.length} pending submissions` 
    });
  } catch (err) {
    console.error('POST Assignment Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE - Remove assignment and its related submissions
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await Submission.deleteMany({ assignment: assignment._id });
    return res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('DELETE Assignment Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;