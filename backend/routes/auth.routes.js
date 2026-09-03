const express = require('express');
const router = express.Router();
const { loginUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public auth routes
router.post('/login', loginUser);

// Protected auth route
router.get('/me', protect, getMe);

module.exports = router;
