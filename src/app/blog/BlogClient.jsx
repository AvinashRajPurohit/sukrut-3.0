'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, CheckCircle2, Star, FileText, Building, Zap } from 'lucide-react';
import { format } from 'date-fns';

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

  return (
    <main className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 uppercase tracking-wide">
              Blog
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Insight and Updates
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
              A collection of hand-picked blogs for freelancers, by freelancers. Deep dives, insights, and honest advice to navigate the freelance landscape.
            </p>
          </div>
        </section>

        {/* All Blogs Section */}
        <section className="bg-white py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                All Blogs
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                Find or list tools that will help designers build to test. Simplify design with our comprehensive and carefully edited library from the start.
              </p>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6">
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
            <div className="text-center py-12 sm:py-20">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium text-slate-900 mb-2">No blogs found</p>
              <p className="text-sm sm:text-base text-slate-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                {blogs.map((blog, index) => {
                  const CategoryIcon = getCategoryIcon(blog.category);
                  return (
                    <Link
                      key={blog.id || index}
                      href={`/blog/${blog.slug}`}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
                    >
                      {/* Placeholder for thumbnail - using gradient background */}
                      <div className="h-40 sm:h-48 bg-gradient-to-br from-[#E39A2E]/20 to-slate-200 flex items-center justify-center">
                        <CategoryIcon className="w-12 h-12 sm:w-16 sm:h-16 text-[#E39A2E]/30" />
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
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-[#E39A2E] text-white font-medium rounded-lg hover:bg-[#d18a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
