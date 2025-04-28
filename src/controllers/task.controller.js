const { Task } = require('../models/task.model');
const { User } = require('../models/user.model'); 
const { redisClient } = require('../config/redis');
const { TaskHistory } = require('../models/taskHistory.model');
const { addNotificationJob } = require('../queues/notification.queue');
const {
    getUserTasksAggregation,
    getTaskFullHistoryAggregation,
    getUsersInteractedWithTask,
  } = require('../aggregations/task.aggregation');

  // Get User's Tasks API
const getUserTasks = async (req, res) => {
    const { status, dueDate, page, limit } = req.query;
    const userId = req.params.userId;
  
    const tasks = await getUserTasksAggregation({ userId, status, dueDate, page, limit });
  
    res.json({ tasks });
  };
  
  // Get Full Task History API
  const getTaskHistory = async (req, res) => {
    const { taskId } = req.params;
  
    const history = await getTaskFullHistoryAggregation(taskId);
  
    res.json(history);
  };
  
  // Get Users Interacted with a Task
  const getInteractedUsers = async (req, res) => {
    const { taskId } = req.params;
  
    const users = await getUsersInteractedWithTask(taskId);
  
    res.json({ users });
  };
// Create Task
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedEmails } = req.body;
    const assignedUser = await User.find({email: assignedEmails});
    console.log(assignedUser,'jsgdjfb')
    
    const task = await Task.create({ title, description, status, dueDate: new Date() + 1,assignedUsers:assignedUser, createdBy: req.user.id });

    // Invalidate User's Cached Tasks
    await redisClient.del(`tasks:${task.assignedTo}`);
    await addNotificationJob({
        userId: assignedUser._id,
        taskId: task._id,
        title: 'Task Assigned/Updated',
        message: `A task has been assigned/updated for you.`,
      });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    next(error);
  }
};

// Get Single Task
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

// Update Task
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await redisClient.del(`tasks:${task.assignedTo}`);
    await TaskHistory.create({
        taskId: task._id,
        action: 'Updated Task',
        performedBy: req.user.id,
        oldValue: {}, // Can capture old status, etc.
        newValue: req.body,
      });

      await addNotificationJob({
        userId: assignedUser._id,
        taskId: task._id,
        title: 'Task Assigned/Updated',
        message: `A task has been assigned/updated for you.`,
      });

    res.status(200).json({ message: 'Task updated', task });
  } catch (error) {
    next(error);
  }
};

// Delete Task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await redisClient.del(`tasks:${task.assignedTo}`);

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// Get all tasks assigned to a user (with cache)
const getTasksByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status, dueDate, page = 1, limit = 10 } = req.query;

    // Try fetching from cache
    const cached = await redisClient.get(`tasks:${userId}`);
    if (cached) return res.status(200).json(JSON.parse(cached));

    // Build query
    let query = { assignedTo: userId };
    if (status) query.status = status;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const result = { tasks, page: Number(page), limit: Number(limit) };

    // Cache it
    await redisClient.set(`tasks:${userId}`, JSON.stringify(result), 'EX', 3600); // Cache for 1 hour

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUser,
};