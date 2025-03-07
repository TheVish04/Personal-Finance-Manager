// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should contain { id: user._id }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
