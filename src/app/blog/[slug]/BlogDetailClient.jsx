'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Star, FileText, Building, Zap } from 'lucide-react';
import { format } from 'date-fns';

const categoryIcons = {
  'All Articles': FileText,
  'Spotlight': Star,
  'Product Updates': CheckCircle2,
  'Company': Building,
  'Productivity': Zap
};

export default function BlogDetailClient({ blog }) {

  const CategoryIcon = categoryIcons[blog.category] || FileText;

  return (
    <main className="min-h-screen bg-white">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#E39A2E] mb-6 sm:mb-8 transition-colors cursor-pointer text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category and Date */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CategoryIcon className="w-4 h-4 text-[#E39A2E]" />
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              {blog.category}
            </span>
            {blog.publishedAt && (
              <span className="text-xs sm:text-sm text-slate-500">
                {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author */}
          {blog.author && (
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200">
              <p className="text-xs sm:text-sm text-slate-600">
                By <span className="font-medium text-slate-900">{blog.author.name}</span>
              </p>
            </div>
          )}

          {/* Content */}
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </main>
  );
}
