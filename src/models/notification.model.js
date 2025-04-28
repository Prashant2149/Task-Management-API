const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  meta: {
    type: Object, // Can store taskId, status change info, etc.
    default: {},
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ userId: 1 });
notificationSchema.index({ 'meta.taskId': 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;