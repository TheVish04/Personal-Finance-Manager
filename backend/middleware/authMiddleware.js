// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Expect the header to be in the format: "Bearer <token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using your JWT secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
    // Attach the decoded user ID to the request object
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
