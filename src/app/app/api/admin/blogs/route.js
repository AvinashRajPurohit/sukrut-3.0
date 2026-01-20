import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Blog from '@/lib/db/models/Blog';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';
import mongoose from 'mongoose';
import { generateSEOMetadata } from '@/lib/utils/seo';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['All Articles', 'Spotlight', 'Product Updates', 'Company', 'Productivity']),
  published: z.boolean().default(false)
});

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query = {};
    
    if (category && category !== 'All Articles') {
      query.category = category;
    }

    if (published !== null && published !== undefined) {
      query.published = published === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    const normalizedBlogs = blogs.map(blog => ({
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
      published: blog.published,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords || []
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
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAdmin();

    const body = await request.json();
    const validation = blogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Generate slug if not provided
    let slug = data.slug;
    if (!slug) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      // Append timestamp to make it unique
      slug = `${slug}-${Date.now()}`;
    }

    // Set publishedAt if publishing
    let publishedAt = null;
    if (data.published) {
      publishedAt = new Date();
    }

    // Auto-generate SEO metadata
    const seoMetadata = generateSEOMetadata(
      data.title,
      data.excerpt,
      data.content,
      data.category
    );

    const blog = await Blog.create({
      ...data,
      slug,
      author: new mongoose.Types.ObjectId(user.id),
      publishedAt,
      ...seoMetadata
    });

    return NextResponse.json({
      success: true,
      blog: {
        id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        published: blog.published,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        metaKeywords: blog.metaKeywords
      }
    }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
