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

// GET /api/alerts/student - Get all notifications for the logged-in student
// Protected route: requires a valid token; middleware attaches `req.user`
router.get('/student', protect, async (req, res) => {
  try {
    const studentId = req.user && req.user._id ? req.user._id : (req.user && req.user.id) ? req.user.id : null;
    if (!studentId) return res.status(401).json({ error: 'Not authorized' });

    const notifications = await Notification.find({ student: studentId })
      .populate({
        path: 'alert',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(notifications);
  } catch (err) {
    console.error('GET Student Notifications Error:', err);
    return res.status(500).json({ error: 'Failed to fetch student notifications' });
  }
});

// PATCH /api/alerts/:alertId/seen - Mark an alert notification as seen by a student
router.patch('/:alertId/seen', protect, async (req, res) => {
  try {
    const alertId = req.params.alertId;
    const studentId = req.user._id; 

    // 1. Find the specific notification for this student and alert
    const notification = await Notification.findOne({
      alert: alertId,
      student: studentId
    });

    // If no notification exists for this student/alert combo, bail out
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // 2. Prevent duplicate entries if the student already read or submitted it
    if (notification.status === 'read' || notification.status === 'submitted') {
      return res.status(200).json({ 
        message: 'Notification already marked as seen', 
        notification 
      });
    }

    // 3. Update the Notification document
    notification.status = 'read';
    notification.readAt = Date.now();
    await notification.save();

    // 4. Push the student's ID and timestamp into the Alert's seenBy array
    await Alert.findByIdAndUpdate(
      alertId,
      {
        $push: {
          seenBy: {
            studentId: studentId,
            seenAt: Date.now()
          }
        }
      }
    );

    return res.status(200).json({
      message: 'Alert marked as seen successfully',
      notification
    });

  } catch (err) {
    console.error('PATCH Alert Seen Error:', err);
    
    // Catch invalid Object ID formats gracefully
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid Alert ID format' });
    }

    return res.status(500).json({ error: 'Failed to mark alert as seen' });
  }
});

// PATCH /api/alerts/:alertId/submit - Mark an alert as submitted by a student
router.patch('/:alertId/submit', protect, async (req, res) => {
  try {
    const alertId = req.params.alertId;
    const studentId = req.user._id; // Assuming auth middleware populates req.user

    // 1. Find the specific notification for this student and alert
    const notification = await Notification.findOne({
      alert: alertId,
      student: studentId
    });

    // If no notification exists, return 404
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // 2. Prevent duplicate submissions (Idempotency check)
    if (notification.status === 'submitted') {
      return res.status(200).json({ 
        message: 'Alert already marked as submitted', 
        notification 
      });
    }

    // 3. Update the Notification document
    notification.status = 'submitted';
    notification.submittedAt = Date.now();
    
    // Optional nice-to-have: If the student submits without ever triggering the "seen" route,
    // it makes sense to mark it as read right now too.
    if (!notification.readAt) {
      notification.readAt = Date.now();
    }
    
    await notification.save();

    // 4. Push the student's ID and timestamp into the Alert's submittedBy array
    await Alert.findByIdAndUpdate(
      alertId,
      {
        $push: {
          submittedBy: {
            studentId: studentId,
            submittedAt: Date.now()
          }
        }
      }
    );

    return res.status(200).json({
      message: 'Alert marked as submitted successfully',
      notification
    });

  } catch (err) {
    console.error('PATCH Alert Submit Error:', err);
    
    // Catch invalid Object ID formats gracefully
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid Alert ID format' });
    }

    return res.status(500).json({ error: 'Failed to mark alert as submitted' });
  }
});

module.exports = router;
