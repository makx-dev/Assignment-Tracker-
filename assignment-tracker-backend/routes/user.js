const express = require('express');
const router = express.Router();
const { clerkClient, ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// POST /api/user/set-role
// This route is protected, so only a logged-in user can set their own role.
router.post('/set-role', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.auth.userId;

    // Validate the role payload
    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role provided' });
    }

    // Update the user's publicMetadata in Clerk
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role
      }
    });

    return res.status(200).json({ 
      message: 'Role updated successfully', 
      role: updatedUser.publicMetadata.role 
    });

  } catch (err) {
    console.error('Set Role Error:', err);
    return res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;