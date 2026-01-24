import BlogClient from './BlogClient';
import { getBlogsForPage } from '@/lib/blog';

export const dynamic = 'force-dynamic';

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

export default async function BlogPage({ searchParams }) {
  const resolved = searchParams && typeof searchParams.then === 'function'
    ? await searchParams
    : searchParams || {};
  const category = resolved?.category || 'All Articles';
  const search = resolved?.search || null;

  const { blogs, pagination } = await getBlogsForPage({
    category,
    search,
    page: 1,
    limit: 20,
  });

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
      <BlogClient
        initialBlogs={blogs}
        initialPagination={pagination}
        initialCategory={category}
        initialSearch={search || ''}
      />
    </>
  );
}
