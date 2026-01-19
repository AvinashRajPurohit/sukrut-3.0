import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  punchInTime: {
    type: Date,
    required: true
  },
  punchOutTime: {
    type: Date,
    default: null
  },
  punchInIP: {
    type: String,
    required: true
  },
  punchOutIP: {
    type: String,
    default: null
  },
  punchInLateReason: {
    type: String,
    default: null
  },
  punchOutEarlyReason: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceRecordSchema.index({ userId: 1, date: 1 });
attendanceRecordSchema.index({ date: -1 });

export default mongoose.models.AttendanceRecord || mongoose.model('AttendanceRecord', attendanceRecordSchema);
