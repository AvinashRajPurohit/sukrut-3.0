import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Blog from '@/lib/db/models/Blog';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';
import { generateSEOMetadata } from '@/lib/utils/seo';

const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  category: z.enum(['All Articles', 'Spotlight', 'Product Updates', 'Company', 'Productivity']).optional(),
  published: z.boolean().optional()
});

export async function GET(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const blogId = resolvedParams.id;

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId)
      .populate('author', 'name email')
      .lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: {
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
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const blogId = resolvedParams.id;

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updateBlogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const data = validation.data;

    // Handle slug uniqueness if changed
    if (data.slug && data.slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug: data.slug, _id: { $ne: blogId } });
      if (existingBlog) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
      blog.slug = data.slug;
    }

    // Handle published status change
    if (data.published !== undefined) {
      blog.published = data.published;
      if (data.published && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    // Update other fields
    if (data.title) blog.title = data.title;
    if (data.excerpt) blog.excerpt = data.excerpt;
    if (data.content) blog.content = data.content;
    if (data.category) blog.category = data.category;

    // Auto-regenerate SEO metadata if title, excerpt, content, or category changed
    const titleChanged = data.title !== undefined;
    const excerptChanged = data.excerpt !== undefined;
    const contentChanged = data.content !== undefined;
    const categoryChanged = data.category !== undefined;
    
    if (titleChanged || excerptChanged || contentChanged || categoryChanged) {
      const finalTitle = data.title || blog.title;
      const finalExcerpt = data.excerpt || blog.excerpt;
      const finalContent = data.content || blog.content;
      const finalCategory = data.category || blog.category;
      
      const seoMetadata = generateSEOMetadata(
        finalTitle,
        finalExcerpt,
        finalContent,
        finalCategory
      );
      
      blog.metaTitle = seoMetadata.metaTitle;
      blog.metaDescription = seoMetadata.metaDescription;
      blog.metaKeywords = seoMetadata.metaKeywords;
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blogId)
      .populate('author', 'name email')
      .lean();

    return NextResponse.json({
      success: true,
      blog: {
        id: updatedBlog._id.toString(),
        title: updatedBlog.title,
        slug: updatedBlog.slug,
        excerpt: updatedBlog.excerpt,
        content: updatedBlog.content,
        category: updatedBlog.category,
        author: updatedBlog.author ? {
          id: updatedBlog.author._id?.toString() || updatedBlog.author._id,
          name: updatedBlog.author.name,
          email: updatedBlog.author.email
        } : null,
        published: updatedBlog.published,
        publishedAt: updatedBlog.publishedAt,
        createdAt: updatedBlog.createdAt,
        updatedAt: updatedBlog.updatedAt,
        metaTitle: updatedBlog.metaTitle,
        metaDescription: updatedBlog.metaDescription,
        metaKeywords: updatedBlog.metaKeywords || []
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const blogId = resolvedParams.id;

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
