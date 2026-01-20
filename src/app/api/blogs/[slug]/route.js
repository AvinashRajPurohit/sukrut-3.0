import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Blog from '@/lib/db/models/Blog';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug, published: true })
      .populate('author', 'name email')
      .lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Normalize blog object
    const normalizedBlog = {
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
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
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords || []
    };

    return NextResponse.json({
      success: true,
      blog: normalizedBlog
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
