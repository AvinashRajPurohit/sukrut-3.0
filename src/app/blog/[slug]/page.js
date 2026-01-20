import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';

async function getBlogBySlug(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    let fetchUrl;
    
    if (baseUrl) {
      fetchUrl = `${baseUrl}/api/blogs/${slug}`;
    } else if (process.env.VERCEL_URL) {
      fetchUrl = `https://${process.env.VERCEL_URL}/api/blogs/${slug}`;
    } else {
      fetchUrl = `http://localhost:3000/api/blogs/${slug}`;
    }

    const res = await fetch(fetchUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.blog : null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: blog.metaTitle || `${blog.title} | Blog`,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords && blog.metaKeywords.length > 0 
      ? blog.metaKeywords.join(', ') 
      : undefined,
    authors: blog.author ? [{ name: blog.author.name }] : undefined,
    creator: blog.author?.name || 'Sukrut',
    publisher: 'Sukrut',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: blog.author ? [blog.author.name] : undefined,
      siteName: 'Sukrut',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      creator: blog.author?.name ? `@${blog.author.name.replace(/\s+/g, '').toLowerCase()}` : '@sukrut',
    },
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    other: {
      'article:author': blog.author?.name || 'Sukrut',
      'article:published_time': blog.publishedAt,
      'article:modified_time': blog.updatedAt || blog.createdAt,
      'article:section': blog.category,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;
  
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.excerpt,
            datePublished: blog.publishedAt,
            dateModified: blog.updatedAt || blog.createdAt,
            author: blog.author ? {
              '@type': 'Person',
              name: blog.author.name,
            } : undefined,
            publisher: {
              '@type': 'Organization',
              name: 'Sukrut',
            },
          }),
        }}
      />
      <BlogDetailClient blog={blog} />
    </>
  );
}
