'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, CheckCircle2, Star, FileText, Building, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const categories = [
  { value: 'All Articles', label: 'All Blogs', icon: FileText },
  { value: 'Spotlight', label: 'Spotlight', icon: Star },
  { value: 'Product Updates', label: 'Product Updates', icon: CheckCircle2 },
  { value: 'Company', label: 'Company', icon: Building },
  { value: 'Productivity', label: 'Productivity', icon: Zap }
];

export default function BlogClient({ initialBlogs = [], initialPagination = { total: 0, pages: 0 } }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Articles'); // Keep value as 'All Articles' for API compatibility
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlogs = async (category = selectedCategory, search = searchQuery, page = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All Articles') {
        params.append('category', category);
      }
      if (search) {
        params.append('search', search);
      }
      params.append('page', page.toString());
      params.append('limit', '10');

      const res = await fetch(`/api/blogs?${params}`);
      const data = await res.json();
      
      if (data.success) {
        if (append) {
          setBlogs(prev => [...prev, ...(data.blogs || [])]);
        } else {
          setBlogs(data.blogs || []);
        }
        setPagination(data.pagination || { total: 0, pages: 0 });
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBlogs(selectedCategory, searchQuery, 1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchBlogs(category, searchQuery, 1);
  };

  const handleLoadMore = () => {
    fetchBlogs(selectedCategory, searchQuery, currentPage + 1, true);
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : FileText;
  };

  const [headerRef, headerVisible] = useScrollAnimation();
  const [filtersRef, filtersVisible] = useScrollAnimation({ threshold: 0.1 });
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.1 });

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

        {/* Header Section */}
        <section className="relative bg-white pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 z-10 overflow-hidden pt-28 lg:pt-32">
          {/* Light Background with Visible Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Very subtle gradient overlay */}
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(227, 154, 46, 0.03) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(227, 154, 46, 0.02) 0%, transparent 50%)
                `,
              }}
            />
            
            {/* Visible geometric shapes - Circles */}
            <div className="absolute top-20 right-20 w-24 h-24">
              <div 
                className="w-full h-full rounded-full border-2 border-amber-200/40"
                style={{ animation: 'float-slow 8s ease-in-out infinite' }}
              />
            </div>
            <div className="absolute bottom-32 left-16 w-16 h-16">
              <div 
                className="w-full h-full rounded-full border-2 border-amber-300/40"
                style={{ animation: 'float-slow 10s ease-in-out infinite', animationDelay: '2s' }}
              />
            </div>
            <div className="absolute top-1/2 right-1/3 w-20 h-20">
              <div 
                className="w-full h-full rounded-full border-2 border-amber-200/35"
                style={{ animation: 'float-slow 9s ease-in-out infinite', animationDelay: '1s' }}
              />
            </div>
            
            {/* Visible geometric shapes - Triangles */}
            <div className="absolute top-32 left-24 w-0 h-0">
              <div 
                className="border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[52px] border-b-amber-200/30"
                style={{ animation: 'float-slow 7s ease-in-out infinite' }}
              />
            </div>
            <div className="absolute bottom-20 right-32 w-0 h-0">
              <div 
                className="border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-amber-300/30"
                style={{ animation: 'float-slow 11s ease-in-out infinite', animationDelay: '1.5s' }}
              />
            </div>
            
            {/* Visible geometric shapes - Squares/Diamonds */}
            <div className="absolute top-1/3 left-1/4 w-16 h-16">
              <div 
                className="w-full h-full border-2 border-amber-200/35 transform rotate-45"
                style={{ animation: 'float-slow 8.5s ease-in-out infinite', animationDelay: '0.5s' }}
              />
            </div>
            <div className="absolute bottom-1/4 right-1/4 w-12 h-12">
              <div 
                className="w-full h-full border-2 border-amber-300/35 transform rotate-45"
                style={{ animation: 'float-slow 9.5s ease-in-out infinite', animationDelay: '2.5s' }}
              />
            </div>
            
            {/* Visible hexagon shapes */}
            <div className="absolute top-24 left-1/2 w-20 h-20 -translate-x-1/2">
              <div 
                className="w-full h-full"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                  border: '2px solid rgba(227, 154, 46, 0.3)',
                  animation: 'float-slow 10s ease-in-out infinite',
                }}
              />
            </div>
            <div className="absolute bottom-28 right-1/3 w-14 h-14">
              <div 
                className="w-full h-full"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                  border: '2px solid rgba(227, 154, 46, 0.25)',
                  animation: 'float-slow 8s ease-in-out infinite',
                  animationDelay: '1s',
                }}
              />
            </div>
            
            {/* Visible lines pattern - subtle grid */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(227, 154, 46, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(227, 154, 46, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />
            
            {/* Visible diagonal lines */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 60px,
                    rgba(227, 154, 46, 0.06) 60px,
                    rgba(227, 154, 46, 0.06) 61px
                  )
                `,
              }}
            />
            
            {/* Visible dots pattern */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(227, 154, 46, 0.15) 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div 
            ref={headerRef}
            className={`relative max-w-7xl mx-auto text-center mt-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              headerVisible ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 -translate-y-12 scale-105 blur-md'
            }`}
          >
            <p className={`text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 uppercase tracking-wide transition-all duration-800 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
            >
              Blog
            </p>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-4 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] leading-tight ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              transitionDelay: '400ms',
              backgroundSize: '200% auto',
              animation: headerVisible ? 'gradient-shift 3s ease infinite' : 'none',
              lineHeight: '1.1',
              paddingBottom: '0.25rem'
            }}
            >
              Insight and Updates
            </h1>
            <p className={`text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4 transition-all duration-1000 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
            >
              Explore our curated collection of articles on software development, digital innovation, and technology trends. Insights, best practices, and expert perspectives to help you navigate the evolving tech landscape.
            </p>
          </div>
        </section>

        {/* All Blogs Section */}
        <section className="relative bg-white py-8 sm:py-12 px-4 sm:px-6 z-10">
          <div className="max-w-7xl mx-auto">
            <div 
              ref={filtersRef}
              className={`mb-6 sm:mb-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 transition-all duration-800 ease-out ${
                filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
              >
                All Blogs
              </h2>
              <p className={`text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 transition-all duration-800 ease-out ${
                filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
              >
                Find or list tools that will help designers build to test. Simplify design with our comprehensive and carefully edited library from the start.
              </p>

            {/* Search and Filters */}
            <div className={`flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 transition-all duration-800 ease-out ${
              filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-[#E39A2E] transition-all cursor-text"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`
                        inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer
                        ${isActive
                          ? 'bg-[#E39A2E] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{category.label}</span>
                      <span className="sm:hidden">{category.label.replace('All ', '')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          {loading && blogs.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-200 border-t-[#E39A2E]"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className={`text-center py-12 sm:py-20 transition-all duration-800 ease-out ${
              filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '800ms' }}
            >
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-slate-900 mb-2">No blogs found</p>
              <p className="text-sm sm:text-base text-slate-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div 
                ref={gridRef}
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                {blogs.map((blog, index) => {
                  const CategoryIcon = getCategoryIcon(blog.category);
                  return (
                    <Link
                      key={blog.id || index}
                      href={`/blog/${blog.slug}`}
                      className={`group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 cursor-pointer block ${
                        gridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {/* Placeholder for thumbnail - using gradient background */}
                      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[#E39A2E]/20 via-amber-100/10 to-slate-200 flex items-center justify-center overflow-hidden group-hover:from-[#E39A2E]/30 transition-all duration-500">
                        <CategoryIcon className="w-12 h-12 sm:w-16 sm:h-16 text-[#E39A2E]/30 group-hover:text-[#E39A2E]/50 transition-all duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite',
                          }}
                        />
                      </div>
                      
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                          <CategoryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E39A2E]" />
                          <span className="text-xs sm:text-sm font-medium text-slate-600">
                            {blog.category}
                          </span>
                          {blog.publishedAt && (
                            <span className="text-xs sm:text-sm text-slate-500">
                              {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#E39A2E] transition-colors">
                          {blog.title}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        
                        <span className="inline-flex items-center gap-2 text-sm sm:text-base text-[#E39A2E] font-medium hover:gap-3 transition-all group/link cursor-pointer">
                          Learn More
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Load More Button */}
              {pagination.pages > currentPage && (
                <div className={`text-center transition-all duration-800 ease-out ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${blogs.length * 50}ms` }}
                >
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#E39A2E] to-[#d18a1f] text-white font-medium rounded-lg hover:from-[#d18a1f] hover:to-[#E39A2E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Loading...' : 'View More'}
                  </button>
                </div>
              )}
            </>
          )}
          </div>
        </section>
      </main>
  );
}
