import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // null for admin-only notifications
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'punch_in',
      'punch_out',
      'late_arrival',
      'early_departure',
      'leave_request',
      'leave_approved',
      'leave_rejected',
      'leave_cancelled',
      'user_registered',
      'user_deactivated',
      'ip_added',
      'ip_removed',
      'holiday_added',
      'system_alert'
    ],
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
