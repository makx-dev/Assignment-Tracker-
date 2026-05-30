const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');
const Alert = require('../models/Alert');

// GET all submissions for one assignment (teacher view)
router.get('/assignment/:assignmentId', async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      assignment: req.params.assignmentId 
    }).populate('student', 'name rollNo division email');
    // populate replaces student ObjectId with actual student data
    
    res.json(submissions);
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all submissions for one student
router.get('/student/:studentId', async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      student: req.params.studentId 
    }).populate('assignment', 'title subject dueDate');
    
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update submission status (student marks as submitted)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        submittedAt: status === 'submitted' ? new Date() : null
      },
      { new: true } // return updated document
    ).populate('student', 'name rollNo');

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;