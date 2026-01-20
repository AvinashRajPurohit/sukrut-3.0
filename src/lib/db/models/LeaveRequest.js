import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true
  },
  leaveType: {
    type: String,
    enum: ['sick-leave', 'paid-leave', 'unpaid-leave', 'work-from-home'],
    required: true
  },
  type: {
    type: String,
    enum: ['full-day', 'half-day'],
    required: true
  },
  halfDayType: {
    type: String,
    enum: ['first-half', 'second-half'],
    required: function() {
      return this.type === 'half-day';
    }
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

leaveRequestSchema.pre('save', async function() {
  this.updatedAt = new Date();
});

// Delete the model if it exists to force recompilation with new schema
if (mongoose.models.LeaveRequest) {
  delete mongoose.models.LeaveRequest;
}

export default mongoose.model('LeaveRequest', leaveRequestSchema);
