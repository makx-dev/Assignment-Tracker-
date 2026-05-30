const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized, token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach minimal user info. If the user is a teacher, load teacher document.
    if (decoded && decoded.id) {
      if (decoded.role === 'teacher') {
        const teacher = await Teacher.findById(decoded.id).select('-password');
        if (!teacher) return res.status(401).json({ error: 'User not found' });
        req.user = teacher;
      } else {
        req.user = { _id: decoded.id, role: decoded.role };
      }
      return next();
    }

    return res.status(401).json({ error: 'Not authorized' });
  } catch (err) {
    console.error('Auth middleware error:', err.message || err);
    return res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = { protect };
