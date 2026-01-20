import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['All Articles', 'Spotlight', 'Product Updates', 'Company', 'Productivity'],
    default: 'All Articles',
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  published: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date,
    default: null,
    index: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  metaKeywords: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index for efficient queries
blogSchema.index({ published: 1, publishedAt: -1 });
blogSchema.index({ category: 1, published: 1, publishedAt: -1 });
blogSchema.index({ slug: 1, published: 1 });

// Delete the model if it exists to force recompilation with new schema
if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export default mongoose.model('Blog', blogSchema);
