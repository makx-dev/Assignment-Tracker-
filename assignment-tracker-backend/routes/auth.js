const express = require('express');
const Teacher = require('../models/Teacher');
const generateToken = require('../utils/generateToken');
const router = express.Router();

const DEFAULT_PASSWORD = 'qwer6732';
const ALLOWED_EMAIL_DOMAIN = '@ghrcemn.raisoni.net';

const inferNameFromEmail = (email) => {
  const localPart = email.split('@')[0] || '';
  return localPart
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Allow login for school email addresses with the default password.
    const isAllowedDomain = normalizedEmail.endsWith(ALLOWED_EMAIL_DOMAIN);

    let teacher = await Teacher.findOne({ email: normalizedEmail });

    if (!teacher) {
      if (!isAllowedDomain || normalizedPassword !== DEFAULT_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      teacher = await Teacher.create({
        name: inferNameFromEmail(normalizedEmail),
        email: normalizedEmail,
        username: normalizedEmail.split('@')[0],
        password: DEFAULT_PASSWORD,
        role: 'teacher'
      });
    }

    const passwordMatches = await teacher.matchPassword(normalizedPassword);
    if (!passwordMatches) {
      // If the teacher exists without a password and the default password is provided,
      // initialize their password and allow login.
      if (!teacher.password && isAllowedDomain && normalizedPassword === DEFAULT_PASSWORD) {
        teacher.password = DEFAULT_PASSWORD;
        await teacher.save();
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const token = generateToken(teacher._id, teacher.role);

    return res.status(200).json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Failed to authenticate' });
  }
});

module.exports = router;
