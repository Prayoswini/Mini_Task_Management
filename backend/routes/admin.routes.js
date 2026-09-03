const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllAdminTasks,
  getAdminStats
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Protect all admin endpoints with JWT + Admin role authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/tasks', getAllAdminTasks);
router.get('/stats', getAdminStats);

module.exports = router;
