const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
taskCommentSchema.index({ taskId: 1 });
const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = { TaskComment };