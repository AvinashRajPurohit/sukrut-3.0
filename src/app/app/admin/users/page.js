'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import { Plus, Pencil, Trash2, Users, User, ShieldCheck, Power, Lock } from 'lucide-react';
import { useNavbarActions } from '@/components/shared/NavbarActionsContext';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import ChangePasswordModal from '@/components/shared/ChangePasswordModal';

export default function UsersPage() {
  const router = useRouter();
  const { setActions } = useNavbarActions();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'user', isActive: true });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: '', user: null, onConfirm: null, loading: false, error: '' });
  const [changePasswordModal, setChangePasswordModal] = useState({ isOpen: false, userId: null, userName: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setActions(
      <Button 
        variant="outline"
        onClick={() => {
          setEditingUser(null);
          setFormData({ email: '', password: '', name: '', role: 'user', isActive: true });
          setShowModal(true);
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add User
      </Button>
    );
    return () => setActions(null);
  }, [setActions]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/app/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const url = editingUser 
        ? `/app/api/admin/users/${editingUser.id}`
        : '/app/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      // Prepare data - exclude password if editing and password is empty
      const submitData = { ...formData };
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }
      // Remove password from edit mode if empty
      if (editingUser && submitData.password === '') {
        delete submitData.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save user');
        setSubmitting(false);
        return;
      }

      setSuccess(editingUser ? 'User updated successfully!' : 'User created successfully!');
      setShowModal(false);
      setEditingUser(null);
      setFormData({ email: '', password: '', name: '', role: 'user', isActive: true });
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('An error occurred while saving user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ id: user.id });
    setFormData({
      email: user.email,
      password: '',
      name: user.name,
      role: user.role,
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setShowModal(true);
  };

  const handleToggleActive = (user) => {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    setConfirmationModal({
      isOpen: true,
      type: 'toggle',
      user: user,
      loading: false,
      error: '',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true, error: '' }));
        try {
          const res = await fetch(`/app/api/admin/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: newStatus })
          });

          const data = await res.json();
          if (data.success) {
            setSuccess(`User ${action}d successfully!`);
            await fetchUsers();
            setConfirmationModal({ isOpen: false, type: '', user: null, onConfirm: null, loading: false, error: '' });
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setConfirmationModal(prev => ({ ...prev, loading: false, error: data.error || `Failed to ${action} user` }));
          }
        } catch (error) {
          console.error(`Error ${action}ing user:`, error);
          setConfirmationModal(prev => ({ ...prev, loading: false, error: `Failed to ${action} user. Please try again.` }));
        }
      }
    });
  };

  const handleDelete = (user) => {
    setConfirmationModal({
      isOpen: true,
      type: 'delete',
      user: user,
      loading: false,
      error: '',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true, error: '' }));
        try {
          const res = await fetch(`/app/api/admin/users/${user.id}`, {
            method: 'DELETE'
          });

          const data = await res.json();
          if (res.ok && data.success) {
            setSuccess('User deleted successfully!');
            await fetchUsers();
            setConfirmationModal({ isOpen: false, type: '', user: null, onConfirm: null, loading: false, error: '' });
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setConfirmationModal(prev => ({ ...prev, loading: false, error: data.error || 'Failed to delete user' }));
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          setConfirmationModal(prev => ({ ...prev, loading: false, error: 'Failed to delete user. Please try again.' }));
        }
      }
    });
  };

  const handleChangePassword = (user) => {
    setChangePasswordModal({
      isOpen: true,
      userId: user.id,
      userName: user.name
    });
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
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-600 dark:text-emerald-400">
            {success}
          </div>
        )}

        <Card>
          {users.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No users found</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Get started by adding your first user</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {users.map((user, index) => (
                    <div
                      key={user.id || user._id || index}
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
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`
                            flex items-center justify-center w-12 h-12 rounded-xl font-bold text-white
                            ${user.role === 'admin' ? 'bg-gradient-to-br from-[#E39A2E] to-[#d18a1f]' : 'bg-gradient-to-br from-slate-400 to-slate-500'}
                            group-hover:scale-110 transition-transform
                          `}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 truncate">
                              {user.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`
                            inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
                            ${user.role === 'admin' 
                              ? 'bg-[#E39A2E]/10 text-[#E39A2E] border border-[#E39A2E]/20' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }
                          `}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                          <span className={`
                            inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border
                            ${user.isActive 
                              ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                            }
                          `}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleActive(user)}
                              className={`p-2 rounded-lg transition-all hover:scale-110 cursor-pointer ${
                                user.isActive
                                  ? 'hover:bg-amber-100 dark:hover:bg-amber-900/20 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                                  : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                              }`}
                              title={user.isActive ? 'Deactivate user' : 'Activate user'}
                            >
                              <Power className={`w-5 h-5 ${user.isActive ? '' : 'opacity-50'}`} />
                            </button>
                            <button
                              onClick={() => handleChangePassword(user)}
                              className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all hover:scale-110 cursor-pointer"
                              title="Change password"
                            >
                              <Lock className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110 cursor-pointer"
                              title="Edit user"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-110 cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          setFormData({ email: '', password: '', name: '', role: 'user', isActive: true });
          setError('');
        }}
        title={editingUser ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
            required
          />

          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password (min 6 characters)"
              required
              minLength={6}
            />
          )}

          {editingUser && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <label htmlFor="isActive" className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
                User Status
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  formData.isActive ? 'bg-[#E39A2E]' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[60px]">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}

          <Select
            label="Role"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            options={[
              { value: 'user', label: 'User', icon: User },
              { value: 'admin', label: 'Admin', icon: ShieldCheck }
            ]}
            placeholder="Select role"
            icon={User}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
                setFormData({ email: '', password: '', name: '', role: 'user', isActive: true });
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting} loading={submitting}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modals */}
      {confirmationModal.type === 'toggle' && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, type: '', user: null, onConfirm: null, loading: false, error: '' })}
          onConfirm={confirmationModal.onConfirm}
          title={`${confirmationModal.user?.isActive ? 'Deactivate' : 'Activate'} User`}
          message={
            confirmationModal.error 
              ? <span className="text-red-600 dark:text-red-400">{confirmationModal.error}</span>
              : `Are you sure you want to ${confirmationModal.user?.isActive ? 'deactivate' : 'activate'} ${confirmationModal.user?.name}?`
          }
          confirmText={confirmationModal.user?.isActive ? 'Deactivate' : 'Activate'}
          variant="warning"
          icon={Power}
          loading={confirmationModal.loading}
        />
      )}

      {confirmationModal.type === 'delete' && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, type: '', user: null, onConfirm: null, loading: false, error: '' })}
          onConfirm={confirmationModal.onConfirm}
          title="Delete User"
          message={
            confirmationModal.error
              ? <span className="text-red-600 dark:text-red-400">{confirmationModal.error}</span>
              : `Are you sure you want to permanently delete ${confirmationModal.user?.name}? This action cannot be undone.`
          }
          confirmText="Delete"
          variant="danger"
          icon={Trash2}
          loading={confirmationModal.loading}
        />
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordModal.isOpen}
        onClose={() => setChangePasswordModal({ isOpen: false, userId: null, userName: null })}
        userId={changePasswordModal.userId}
        userName={changePasswordModal.userName}
        onSuccess={() => {
          fetchUsers();
        }}
      />
    </>
  );
}
