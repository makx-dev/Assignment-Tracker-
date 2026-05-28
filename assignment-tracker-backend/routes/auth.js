const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const Teacher = require('../models/Teacher');
const generateToken = require('../utils/generateToken');

const router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '22189835412-8kh0edb17ebkgaksibipn4iadbug276q.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'GOOGLE_CLIENT_ID is not configured' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    const email = payload?.email;
    const googleId = payload?.sub;
    const name = payload?.name || 'Teacher';

    if (!email || !googleId) {
      return res.status(401).json({ error: 'Invalid Google token payload' });
    }

    let teacher = await Teacher.findOne({
      $or: [{ email }, { googleId }]
    });

    if (!teacher) {
      teacher = await Teacher.create({
        name,
        email,
        googleId,
        role: 'teacher',
      });
    } else {
      let changed = false;
      if (!teacher.googleId) {
        teacher.googleId = googleId;
        changed = true;
      }
      if (!teacher.email) {
        teacher.email = email;
        changed = true;
      }
      if (!teacher.name && name) {
        teacher.name = name;
        changed = true;
      }
      if (changed) {
        await teacher.save();
      }
    }

    const token = generateToken(teacher._id, teacher.role);

    return res.json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      }
    });
  } catch (error) {
    return res.status(401).json({ error: 'Google authentication failed', details: error.message });
  }
});

module.exports = router;
