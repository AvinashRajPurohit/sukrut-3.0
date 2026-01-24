import connectDB from '@/lib/db/connection';
import Blog from '@/lib/db/models/Blog';

/**
 * Fetch published blogs directly from DB (for SSR). More reliable than
 * fetching /api/blogs from the server, and avoids baseUrl/localhost issues.
 * Includes blogs where published=true or where published is not set (legacy).
 */
export async function getBlogsForPage({ category = 'All Articles', search = null, page = 1, limit = 20 } = {}) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    // Include published=true OR legacy docs where published doesn't exist
    const andConditions = [
      { $or: [ { published: true }, { published: { $exists: false } } ] },
    ];
    if (category && category !== 'All Articles') {
      andConditions.push({ category });
    }
    if (search && search.trim()) {
      andConditions.push({
        $or: [
          { title: { $regex: search.trim(), $options: 'i' } },
          { excerpt: { $regex: search.trim(), $options: 'i' } },
          { content: { $regex: search.trim(), $options: 'i' } },
        ],
      });
    }
    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email')
        .select('-content')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    const normalizedBlogs = blogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author
        ? {
            id: blog.author._id?.toString() || blog.author._id,
            name: blog.author.name,
            email: blog.author.email,
          }
        : null,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
    }));

    return {
      blogs: normalizedBlogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 0,
      },
    };
  } catch (error) {
    console.error('getBlogsForPage error:', error);
    return { blogs: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
  }
}
