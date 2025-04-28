const { TaskComment } = require('../models/taskComment.model');

// Add Comment
const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { comment } = req.body;

    const newComment = await TaskComment.create({
      taskId,
      comment,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Comment added', newComment });
  } catch (error) {
    next(error);
  }
};

// Get Comments for Task
const getCommentsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const comments = await TaskComment.find({ taskId })
      .populate('createdBy', 'name email') // Optional: get user's name/email
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getCommentsByTask };