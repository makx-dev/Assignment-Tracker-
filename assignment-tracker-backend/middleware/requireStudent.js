const { clerkClient, ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const checkStudentRole = async (req, res, next) => {
  try {
    // req.auth is populated by ClerkExpressRequireAuth
    const userId = req.auth.userId; 

    // Fetch the full user object from Clerk to check metadata
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== 'student') {
      return res.status(403).json({ error: 'Forbidden: Student access required' });
    }

    // Optional: Attach user data to req if downstream routes need it
    // req.user = user;
    
    next();
  } catch (err) {
    console.error('Student Auth Error:', err);
    return res.status(500).json({ error: 'Internal Server Error during auth' });
  }
};

// Export an array of middlewares: 
// 1. Validates the Clerk JWT token
// 2. Checks the student role
module.exports = [ClerkExpressRequireAuth(), checkStudentRole];