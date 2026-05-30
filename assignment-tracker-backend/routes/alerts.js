const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// POST /api/alerts - Create a new alert and generate notifications for students
router.post('/', async (req, res) => {
  try {
    const { type, title, message, dueDate, createdBy, targetStudents } = req.body;

    // 1. Basic validation for required fields
    if (!type || !title || !message || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields: type, title, message, or createdBy' });
    }

    // 2. Create and save the Alert
    const newAlert = new Alert({
      type,
      title,
      message,
      dueDate,
      createdBy,
      targetStudents: targetStudents || []
    });

    const savedAlert = await newAlert.save();

    // 3. Create Notification records for each targeted student
    // We only run this if there are students in the array
    if (targetStudents && targetStudents.length > 0) {
      // Map the array of student IDs into an array of notification objects
      const notifications = targetStudents.map(studentId => ({
        student: studentId,
        alert: savedAlert._id,
        status: 'unread' // This is the default in the schema, but good to be explicit
      }));

      // Use insertMany for efficiency instead of looping and saving individually
      await Notification.insertMany(notifications);
    }

    // 4. Return success response
    return res.status(201).json({
      message: 'Alert and notifications created successfully',
      alert: savedAlert
    });

  } catch (err) {
    console.error('POST Alert Error:', err);
    
    // Handle Mongoose validation errors nicely
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Failed to create alert and notifications' });
  }
});

module.exports = router;

// GET /api/alerts/teacher - Get all alerts created by the logged-in teacher
// Protected route: requires a valid token; middleware attaches `req.user`
router.get('/teacher', protect, async (req, res) => {
  try {
    // If middleware attached a teacher document, use its _id, otherwise fallback to req.user._id
    const teacherId = req.user && req.user._id ? req.user._id : (req.user && req.user.id) ? req.user.id : null;
    if (!teacherId) return res.status(401).json({ error: 'Not authorized' });

    const alerts = await Alert.find({ createdBy: teacherId })
      .sort({ createdAt: -1 })
      .lean();

    const alertsWithCounts = alerts.map(alert => ({
      ...alert,
      seenCount: Array.isArray(alert.seenBy) ? alert.seenBy.length : 0,
      submittedCount: Array.isArray(alert.submittedBy) ? alert.submittedBy.length : 0
    }));

    return res.status(200).json(alertsWithCounts);
  } catch (err) {
    console.error('GET Teacher Alerts Error:', err);
    return res.status(500).json({ error: 'Failed to fetch teacher alerts' });
  }
});