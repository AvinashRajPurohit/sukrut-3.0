import mongoose from 'mongoose';

const weekendConfigSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'config'
  },
  weekendDays: {
    type: [Number],
    default: [0, 6], // Sunday and Saturday by default
    validate: {
      validator: function(v) {
        return v.every(day => day >= 0 && day <= 6);
      },
      message: 'Weekend days must be between 0 (Sunday) and 6 (Saturday)'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

weekendConfigSchema.pre('save', async function() {
  this.updatedAt = new Date();
});

export default mongoose.models.WeekendConfig || mongoose.model('WeekendConfig', weekendConfigSchema);
