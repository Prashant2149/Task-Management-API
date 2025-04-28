const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    action: {
      type: String, // e.g., "Created", "Updated Status", "Commented"
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
taskHistorySchema.index({ taskId: 1 });
const TaskHistory = mongoose.model('TaskHistory', taskHistorySchema);

module.exports = { TaskHistory };