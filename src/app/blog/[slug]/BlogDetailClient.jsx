'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Star, FileText, Building, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const categoryIcons = {
  'All Articles': FileText,
  'Spotlight': Star,
  'Product Updates': CheckCircle2,
  'Company': Building,
  'Productivity': Zap
};

export default function BlogDetailClient({ blog }) {
  const CategoryIcon = categoryIcons[blog.category] || FileText;
  const [headerRef, headerVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
        {/* Premium background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/20 via-amber-100/10 to-transparent rounded-full blur-3xl animate-float-slow"
            style={{ animationDuration: '8s' }}
          />
          <div 
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-amber-200/20 via-amber-100/10 to-transparent rounded-full blur-3xl animate-float-slow"
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          />
        </div>

        <article className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 pt-20 lg:pt-24">
          {/* Back Button */}
          <div 
            ref={headerRef}
            className={`transition-all duration-800 ease-out ${
              headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#E39A2E] mb-6 sm:mb-8 transition-all duration-300 cursor-pointer text-sm sm:text-base group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </div>

          {/* Category and Date */}
          <div 
            className={`flex flex-wrap items-center gap-2 mb-4 transition-all duration-800 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
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
          <h1 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              headerVisible ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-105 blur-md'
            }`}
            style={{ 
              transitionDelay: '400ms',
              backgroundSize: '200% auto',
              animation: headerVisible ? 'gradient-shift 3s ease infinite' : 'none'
            }}
          >
            {blog.title}
          </h1>

          {/* Author */}
          {blog.author && (
            <div 
              className={`mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200 transition-all duration-800 ease-out ${
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <p className="text-xs sm:text-sm text-slate-600">
                By <span className="font-medium text-slate-900">{blog.author.name}</span>
              </p>
            </div>
          )}

          {/* Content */}
          <div 
            ref={contentRef}
            className={`blog-content transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '800ms' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </main>
  );
}
