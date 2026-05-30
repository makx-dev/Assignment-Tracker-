const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');

// GET all submissions for one assignment (teacher view)
router.get('/assignment/:assignmentId', async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      assignment: req.params.assignmentId 
    }).populate('student', 'name rollNo division email');
    
    return res.json(submissions);
  } catch (err) {
    console.error('GET Submissions by Assignment Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET all submissions for one student
router.get('/student/:studentId', async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      student: req.params.studentId 
    }).populate('assignment', 'title subject dueDate');
    
    return res.json(submissions);
  } catch (err) {
    console.error('GET Submissions by Student Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PATCH update submission status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // FIX: Ensure 'late' submissions also get a timestamp
    const isSubmitted = status === 'submitted' || status === 'late';
    
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        submittedAt: isSubmitted ? new Date() : null
      },
      { new: true } 
    ).populate('student', 'name rollNo');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    return res.json(submission);
  } catch (err) {
    console.error('PATCH Submission Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;