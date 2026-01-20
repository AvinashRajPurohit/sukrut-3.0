'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import RichTextEditor from '@/components/shared/RichTextEditor';
import { Plus, Pencil, Trash2, FileText, Search, Eye, EyeOff, CheckCircle2, Star } from 'lucide-react';
import { useNavbarActions } from '@/components/shared/NavbarActionsContext';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import Alert from '@/components/shared/Alert';
import { format } from 'date-fns';

export default function BlogsPage() {
  const { setActions } = useNavbarActions();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'All Articles',
    published: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: '', blog: null, onConfirm: null, loading: false, error: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Articles');
  const [publishedFilter, setPublishedFilter] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, [categoryFilter, publishedFilter]);

  useEffect(() => {
    setActions(
      <Button 
        variant="outline"
        onClick={() => {
          setEditingBlog(null);
          setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            category: 'All Articles',
            published: false
          });
          setShowModal(true);
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Blog
      </Button>
    );
    return () => setActions(null);
  }, [setActions]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All Articles') {
        params.append('category', categoryFilter);
      }
      if (publishedFilter !== 'all') {
        params.append('published', publishedFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const res = await fetch(`/app/api/admin/blogs?${params}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        setError(data.error || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBlogs();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (editingBlog && !editingBlog.id) {
        setError('Invalid blog ID. Please try again.');
        setSubmitting(false);
        return;
      }

      const url = editingBlog 
        ? `/app/api/admin/blogs/${editingBlog.id}`
        : '/app/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const submitData = { ...formData };
      if (!submitData.slug && submitData.title) {
        // Auto-generate slug from title
        submitData.slug = submitData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'include'
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setError('Server returned an invalid response. Please try again.');
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Optionally redirect to login
          setTimeout(() => {
            window.location.href = '/app/login';
          }, 2000);
        } else {
          setError(data.error || 'Failed to save blog');
        }
        setSubmitting(false);
        return;
      }

      setSuccess(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
      setShowModal(false);
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'All Articles',
        published: false
      });
      await fetchBlogs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving blog:', error);
      setError('An error occurred while saving blog. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    const blogId = blog.id || blog._id?.toString() || blog._id;
    if (!blogId) {
      setError('Invalid blog data. Blog ID is missing.');
      return;
    }
    setEditingBlog({ id: blogId.toString() });
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      published: blog.published
    });
    setShowModal(true);
  };

  const handleDelete = (blog) => {
    const blogId = blog.id || blog._id;
    setConfirmationModal({
      isOpen: true,
      type: 'delete',
      blog: blog,
      loading: false,
      error: '',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true, error: '' }));
        try {
          const res = await fetch(`/app/api/admin/blogs/${blogId}`, {
            method: 'DELETE',
            credentials: 'include'
          });

          const data = await res.json();
          if (res.ok && data.success) {
            setSuccess('Blog deleted successfully!');
            await fetchBlogs();
            setConfirmationModal({ isOpen: false, type: '', blog: null, onConfirm: null, loading: false, error: '' });
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setConfirmationModal(prev => ({ ...prev, loading: false, error: data.error || 'Failed to delete blog' }));
          }
        } catch (error) {
          console.error('Error deleting blog:', error);
          setConfirmationModal(prev => ({ ...prev, loading: false, error: 'Failed to delete blog. Please try again.' }));
        }
      }
    });
  };

  const handleTogglePublished = async (blog) => {
    const blogId = blog.id || blog._id;
    try {
          const res = await fetch(`/app/api/admin/blogs/${blogId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: !blog.published }),
            credentials: 'include'
          });

      const data = await res.json();
      if (data.success) {
        setSuccess(`Blog ${!blog.published ? 'published' : 'unpublished'} successfully!`);
        await fetchBlogs();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update blog status');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Failed to update blog status. Please try again.');
    }
  };


  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Spotlight':
        return Star;
      case 'Product Updates':
        return CheckCircle2;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {error && !showModal && (
          <Alert type="error" message={error} onDismiss={() => setError('')} />
        )}
        {success && (
          <Alert type="success" message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: 'All Articles', label: 'All Articles' },
                { value: 'Spotlight', label: 'Spotlight' },
                { value: 'Product Updates', label: 'Product Updates' },
                { value: 'Company', label: 'Company' },
                { value: 'Productivity', label: 'Productivity' }
              ]}
              className="w-full md:w-48"
            />
            <Select
              value={publishedFilter}
              onChange={setPublishedFilter}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'true', label: 'Published' },
                { value: 'false', label: 'Draft' }
              ]}
              className="w-full md:w-40"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        <Card>
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No blogs found</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Get started by adding your first blog post</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {blogs.map((blog, index) => {
                const CategoryIcon = getCategoryIcon(blog.category);
                return (
                  <div
                    key={blog.id || index}
                    className={`
                      group p-5 rounded-xl border-2 transition-all duration-300
                      bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50
                      border-slate-200 dark:border-slate-700
                      hover:border-[#E39A2E]/30 hover:shadow-lg hover:shadow-[#E39A2E]/10
                      hover:-translate-y-1
                      animate-in fade-in slide-in-from-bottom-4
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CategoryIcon className="w-4 h-4 text-[#E39A2E]" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {blog.category}
                          </span>
                          {blog.publishedAt && (
                            <span className="text-sm text-slate-500 dark:text-slate-500">
                              {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            blog.published
                              ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublished(blog)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 cursor-pointer ${
                            blog.published
                              ? 'hover:bg-amber-100 dark:hover:bg-amber-900/20 text-slate-600 dark:text-slate-400 hover:text-amber-600'
                              : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                          }`}
                          title={blog.published ? 'Unpublish' : 'Publish'}
                        >
                          {blog.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110 cursor-pointer"
                          title="Edit blog"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-110 cursor-pointer"
                          title="Delete blog"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBlog(null);
          setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            category: 'All Articles',
            published: false
          });
          setError('');
        }}
        title={editingBlog ? 'Edit Blog' : 'Add Blog'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert type="error" message={error} onDismiss={() => setError('')} />
          )}

          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter blog title"
            required
          />

          <Input
            label="Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Short description of the blog post"
            required
            maxLength={500}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog content here..."
            />
          </div>

          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={[
              { value: 'All Articles', label: 'All Articles' },
              { value: 'Spotlight', label: 'Spotlight' },
              { value: 'Product Updates', label: 'Product Updates' },
              { value: 'Company', label: 'Company' },
              { value: 'Productivity', label: 'Productivity' }
            ]}
            required
          />

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <label htmlFor="published" className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
              Published
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, published: !formData.published })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                formData.published ? 'bg-[#E39A2E]' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.published ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[60px]">
              {formData.published ? 'Yes' : 'No'}
            </span>
          </div>


          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setEditingBlog(null);
                setFormData({
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  category: 'All Articles',
                  published: false,
                  metaTitle: '',
                  metaDescription: '',
                  metaKeywords: []
                });
                setKeywordInput('');
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting} loading={submitting}>
              {editingBlog ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {confirmationModal.type === 'delete' && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, type: '', blog: null, onConfirm: null, loading: false, error: '' })}
          onConfirm={confirmationModal.onConfirm}
          title="Delete Blog"
          message={
            confirmationModal.error
              ? <span className="text-red-600 dark:text-red-400">{confirmationModal.error}</span>
              : `Are you sure you want to permanently delete "${confirmationModal.blog?.title}"? This action cannot be undone.`
          }
          confirmText="Delete"
          variant="danger"
          icon={Trash2}
          loading={confirmationModal.loading}
        />
      )}
    </>
  );
}
