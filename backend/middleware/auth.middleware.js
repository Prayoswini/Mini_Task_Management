const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from Bearer <token> header
      token = req.headers.authorization.split(' ')[1];

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object (excluding password) to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User account not found or deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('JWT Authentication Error:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no authorization token provided'
    });
  }
};

module.exports = { protect };
