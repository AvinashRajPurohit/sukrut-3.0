import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog | Insight and Updates',
  description: 'Explore our curated collection of articles on software development, digital innovation, and technology trends. Insights, best practices, and expert perspectives to help you navigate the evolving tech landscape.',
  keywords: ['blog', 'blogs', 'software development', 'technology insights', 'digital innovation', 'tech trends', 'programming', 'IT solutions', 'software engineering', 'company news'],
  authors: [{ name: 'Sukrut' }],
  creator: 'Sukrut',
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
    title: 'Blog | Insight and Updates',
    description: 'Explore our curated collection of articles on software development, digital innovation, and technology trends.',
    type: 'website',
    siteName: 'Sukrut',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Insight and Updates',
    description: 'Explore our curated collection of articles on software development, digital innovation, and technology trends.',
    creator: '@sukrut',
  },
  alternates: {
    canonical: '/blog',
  },
  other: {
    'article:author': 'Sukrut',
  },
};

async function getBlogs(category = null, search = null) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All Articles') {
      params.append('category', category);
    }
    if (search) {
      params.append('search', search);
    }
    params.append('limit', '20');

    // For server-side fetch, use absolute URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        baseUrl = 'http://localhost:3000';
      }
    }
    
    const res = await fetch(`${baseUrl}/api/blogs?${params}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return { blogs: [], pagination: { total: 0, pages: 0 } };
    }

    const data = await res.json();
    return data.success ? data : { blogs: [], pagination: { total: 0, pages: 0 } };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], pagination: { total: 0, pages: 0 } };
  }
}

export default async function BlogPage({ searchParams }) {
  const category = searchParams?.category || 'All Articles';
  const search = searchParams?.search || null;
  const { blogs, pagination } = await getBlogs(category, search);

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sukrut Blog',
    description: 'Explore our curated collection of articles on software development, digital innovation, and technology trends. Insights, best practices, and expert perspectives to help you navigate the evolving tech landscape.',
    url: '/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Sukrut',
    },
    blogPost: blogs.map(blog => ({
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt,
      datePublished: blog.publishedAt,
      dateModified: blog.updatedAt || blog.createdAt,
      author: blog.author ? {
        '@type': 'Person',
        name: blog.author.name,
      } : undefined,
      url: `/blog/${blog.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <BlogClient initialBlogs={blogs} initialPagination={pagination} />
    </>
  );
}
