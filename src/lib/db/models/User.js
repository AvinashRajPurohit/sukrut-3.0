import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    trim: true,
    default: null,
    sparse: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Delete the model if it exists to force recompilation with new schema
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model('User', userSchema);
