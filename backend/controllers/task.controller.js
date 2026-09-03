const Task = require('../models/Task');

// @desc    Get tasks for logged-in user (or all tasks if admin) with filtering & search
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, title, status, priority } = req.query;

    // Base query: regular users only see their own tasks
    let query = {};
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    // Search by title (case-insensitive regex)
    const searchTerm = search || title;
    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    // Filter by status if provided
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority if provided
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

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email role');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Check ownership if user is not an admin
    if (req.user.role !== 'admin' && task.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this task'
      });
    }

    return res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, description, and dueDate'
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id).populate('createdBy', 'name email role');

    return res.status(201).json({
      success: true,
      task: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Ensure user is task owner or admin
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const updatedTask = await Task.findById(task._id).populate('createdBy', 'name email role');

    return res.status(200).json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Ensure user is task owner or admin
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Task successfully deleted',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
