'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useNavbarActions } from '@/components/shared/NavbarActionsContext';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

export default function IPsPage() {
  const { setActions } = useNavbarActions();
  const [ips, setIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIP, setEditingIP] = useState(null);
  const [formData, setFormData] = useState({ ipAddress: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, ipId: null, onConfirm: null, loading: false, error: '' });

  useEffect(() => {
    fetchIPs();
  }, []);

  useEffect(() => {
    setActions(
      <Button 
        variant="outline"
        onClick={() => {
          setEditingIP(null);
          setFormData({ ipAddress: '', description: '' });
          setShowModal(true);
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add IP
      </Button>
    );
    return () => setActions(null);
  }, [setActions]);

  const fetchIPs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/app/api/admin/ips');
      const data = await res.json();
      if (data.success) {
        setIPs(data.ips || []);
      } else {
        setError(data.error || 'Failed to fetch IPs');
      }
    } catch (error) {
      console.error('Error fetching IPs:', error);
      setError('Failed to fetch IPs. Please try again.');
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
      const url = editingIP 
        ? `/app/api/admin/ips/${editingIP.id}`
        : '/app/api/admin/ips';
      const method = editingIP ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save IP');
        setSubmitting(false);
        return;
      }

      setSuccess(editingIP ? 'IP updated successfully!' : 'IP created successfully!');
      setShowModal(false);
      setEditingIP(null);
      setFormData({ ipAddress: '', description: '' });
      await fetchIPs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving IP:', error);
      setError('An error occurred while saving IP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ip) => {
    setEditingIP({ id: ip.id });
    setFormData({
      ipAddress: ip.ipAddress,
      description: ip.description || ''
    });
    setShowModal(true);
  };

  const handleToggleActive = async (ip) => {
    try {
      const res = await fetch(`/app/api/admin/ips/${ip._id || ip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ip.isActive })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`IP ${ip.isActive ? 'deactivated' : 'activated'} successfully!`);
        await fetchIPs();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update IP');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error updating IP:', error);
      setError('Failed to update IP. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = (ip) => {
    const ipId = ip._id || ip.id;
    setConfirmationModal({
      isOpen: true,
      ipId: ipId,
      loading: false,
      error: '',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true, error: '' }));
        try {
          const res = await fetch(`/app/api/admin/ips/${ipId}`, {
            method: 'DELETE'
          });

          const data = await res.json();
          if (res.ok && data.success) {
            setSuccess('IP deleted successfully!');
            await fetchIPs();
            setConfirmationModal({ isOpen: false, ipId: null, onConfirm: null, loading: false, error: '' });
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setConfirmationModal(prev => ({ ...prev, loading: false, error: data.error || 'Failed to delete IP' }));
          }
        } catch (error) {
          console.error('Error deleting IP:', error);
          setConfirmationModal(prev => ({ ...prev, loading: false, error: 'Failed to delete IP. Please try again.' }));
        }
      }
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
      <div className="space-y-6">
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
          {ips.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No IPs configured</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">IP Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ips.map((ip) => (
                    <tr key={ip.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100 font-mono">{ip.ipAddress}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{ip.description || '-'}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(ip)}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            ip.isActive 
                              ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/30' 
                              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                          }`}
                        >
                          {ip.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(ip)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ip)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingIP(null);
          setFormData({ ipAddress: '', description: '' });
          setError('');
          setSubmitting(false);
        }}
        title={editingIP ? 'Edit IP' : 'Add IP'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Input
            label="IP Address"
            value={formData.ipAddress}
            onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
            placeholder="192.168.1.1"
            required
          />

          <Input
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Office Network"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setEditingIP(null);
                setFormData({ ipAddress: '', description: '' });
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting} loading={submitting}>
              {editingIP ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, ipId: null, onConfirm: null, loading: false, error: '' })}
        onConfirm={confirmationModal.onConfirm}
        title="Delete IP Address"
        message={
          confirmationModal.error
            ? <span className="text-red-600 dark:text-red-400">{confirmationModal.error}</span>
            : "Are you sure you want to delete this IP address? This action cannot be undone."
        }
        confirmText="Delete"
        variant="danger"
        icon={Trash2}
        loading={confirmationModal.loading}
      />
    </>
  );
}
