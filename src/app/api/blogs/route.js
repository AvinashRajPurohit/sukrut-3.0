import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Blog from '@/lib/db/models/Blog';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query for published blogs only
    const query = { published: true };
    
    if (category && category !== 'All Articles') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email')
        .select('-content') // Don't send full content in list
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    // Normalize blog objects
    const normalizedBlogs = blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author ? {
        id: blog.author._id?.toString() || blog.author._id,
        name: blog.author.name,
        email: blog.author.email
      } : null,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription
    }));

    return NextResponse.json({
      success: true,
      blogs: normalizedBlogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
