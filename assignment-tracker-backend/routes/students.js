const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Alert = require('../models/Alert');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ rollNo: 1 });
        return res.json(students);
    } catch (err) {
        console.error('GET Students Error:', err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;