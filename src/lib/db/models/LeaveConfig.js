import mongoose from 'mongoose';

const LeaveConfigSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'leaveConfig', // Ensure only one config document
  },
  sickLeave: {
    limit: {
      type: Number,
      default: 0,
      min: 0,
    },
    period: {
      type: String,
      enum: ['yearly', 'monthly'],
      default: 'yearly',
    },
  },
  paidLeave: {
    limit: {
      type: Number,
      default: 0,
      min: 0,
    },
    period: {
      type: String,
      enum: ['yearly', 'monthly'],
      default: 'yearly',
    },
  },
  unpaidLeave: {
    limit: {
      type: Number,
      default: 0,
      min: 0,
    },
    period: {
      type: String,
      enum: ['yearly', 'monthly'],
      default: 'yearly',
    },
  },
  workFromHome: {
    limit: {
      type: Number,
      default: 0,
      min: 0,
    },
    period: {
      type: String,
      enum: ['yearly', 'monthly'],
      default: 'yearly',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

LeaveConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.LeaveConfig || mongoose.model('LeaveConfig', LeaveConfigSchema);
