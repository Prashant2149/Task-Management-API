const Task = require('../models/task.model');

const TaskHistory = require('../models/taskHistory.model');
const TaskComment = require('../models/taskComment.model');
const Notification = require('../models/notification.model');

const getTaskFullHistoryAggregation = async (taskId) => {
  const [history, comments, notifications] = await Promise.all([
    TaskHistory.find({ taskId }).sort({ createdAt: 1 }),
    TaskComment.find({ taskId }).sort({ createdAt: 1 }),
    Notification.find({ 'meta.taskId': taskId }).sort({ createdAt: 1 }),
  ]);

  return {
    history,
    comments,
    notifications,
  };
};

module.exports = {
  getTaskFullHistoryAggregation,
};

const getUsersInteractedWithTask = async (taskId) => {
    const commentsUsers = await TaskComment.distinct('userId', { taskId });
    const historyUsers = await TaskHistory.distinct('changedBy', { taskId });
  
    const allUsers = Array.from(new Set([...commentsUsers, ...historyUsers]));
  
    return allUsers;
  };
  
  module.exports = {
    getUsersInteractedWithTask,
  };

const getUserTasksAggregation = async ({ userId, status, dueDate, page = 1, limit = 10 }) => {
  const matchStage = {
    assignedTo: userId,
  };

  if (status) {
    matchStage.status = status;
  }

  if (dueDate) {
    matchStage.dueDate = { $lte: new Date(dueDate) };
  }

  const tasks = await Task.aggregate([
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        dueDate: 1,
        createdAt: 1,
      },
    },
  ]);

  return tasks;
};

module.exports = {
  getUserTasksAggregation,
};
