import mongoose from 'mongoose';

const attendanceConfigSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'config'
  },
  startTime: {
    type: String,
    default: '10:00:00'
  },
  endTime: {
    type: String,
    default: '19:00:00'
  },
  lateThresholdMinutes: {
    type: Number,
    default: 30
  },
  earlyLeaveThresholdMinutes: {
    type: Number,
    default: 0
  },
  requireReasonOnLate: {
    type: Boolean,
    default: true
  },
  requireReasonOnEarly: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  _id: false
});

export default mongoose.models.AttendanceConfig || mongoose.model('AttendanceConfig', attendanceConfigSchema);
