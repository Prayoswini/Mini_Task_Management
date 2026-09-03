const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Exclude password field explicitly
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/deactivate a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent admin from deleting their own account
    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Admin users cannot delete their own account'
      });
    }

    // Delete user's associated tasks
    await Task.deleteMany({ createdBy: userToDelete._id });

    // Delete user account
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User and associated tasks successfully deleted',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks created by all users (Admin only)
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllAdminTasks = async (req, res, next) => {
  try {
    const { search, title, user, createdBy, status, priority } = req.query;

    let query = {};

    // Filter by user ID if provided
    const userIdFilter = user || createdBy;
    if (userIdFilter && userIdFilter !== 'All') {
      query.createdBy = userIdFilter;
    }

    // Search by task title
    const searchTerm = search || title;
    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard statistics (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllAdminTasks,
  getAdminStats
};
