'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import Calendar from '@/components/shared/Calendar';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Users, Filter, FileText, Heart, DollarSign, Home, AlertCircle } from 'lucide-react';
import Select from '@/components/shared/Select';
import Input from '@/components/shared/Input';
import { format } from 'date-fns';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState({
    userId: '',
    status: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchData();
  }, [filters.year, filters.userId, filters.status]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.status) params.append('status', filters.status);
      params.append('year', filters.year);

      const [leavesRes, holidaysRes, usersRes] = await Promise.all([
        fetch(`/app/api/admin/leaves?${params}`),
        fetch(`/app/api/admin/holidays?year=${filters.year}`),
        fetch('/app/api/admin/users')
      ]);

      // Check content types
      const leavesContentType = leavesRes.headers.get('content-type');
      const holidaysContentType = holidaysRes.headers.get('content-type');
      const usersContentType = usersRes.headers.get('content-type');

      const [leavesData, holidaysData, usersData] = await Promise.all([
        leavesContentType && leavesContentType.includes('application/json') ? leavesRes.json() : { success: false, error: 'Invalid response' },
        holidaysContentType && holidaysContentType.includes('application/json') ? holidaysRes.json() : { success: false, error: 'Invalid response' },
        usersContentType && usersContentType.includes('application/json') ? usersRes.json() : { success: false, error: 'Invalid response' }
      ]);

      if (leavesData.success) {
        setLeaves(leavesData.leaves || []);
      } else {
        setError(leavesData.error || 'Failed to load leave requests');
      }
      if (holidaysData.success) {
        setHolidays(holidaysData.holidays || []);
      }
      if (usersData.success) {
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    setReviewLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/app/api/admin/leaves/${selectedLeave._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewStatus,
          rejectionReason: reviewStatus === 'rejected' ? rejectionReason : undefined
        })
      });

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setError('Server returned an invalid response. Please try again.');
        setReviewLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSuccess(`Leave request ${reviewStatus} successfully!`);
        await fetchData();
        setShowReviewModal(false);
        setSelectedLeave(null);
        setRejectionReason('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to review leave request');
      }
    } catch (error) {
      console.error('Error reviewing leave:', error);
      setError('An error occurred while reviewing leave request');
    } finally {
      setReviewLoading(false);
    }
  };

  const openReviewModal = (leave, status) => {
    setSelectedLeave(leave);
    setReviewStatus(status);
    setRejectionReason('');
    setShowReviewModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
      </div>
    );
  }

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected');

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pendingLeaves.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{approvedLeaves.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{rejectedLeaves.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select
              label="User"
              value={filters.userId}
              onChange={(value) => setFilters({ ...filters, userId: value })}
              options={[
                { value: '', label: 'All Users', icon: Users },
                ...users.map(user => ({ value: user.id || user._id, label: user.name, icon: Users }))
              ]}
              placeholder="Select user"
              icon={Users}
            />
          </div>
          <div>
            <Select
              label="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: '', label: 'All Status', icon: Filter },
                { value: 'pending', label: 'Pending', icon: Clock },
                { value: 'approved', label: 'Approved', icon: CheckCircle2 },
                { value: 'rejected', label: 'Rejected', icon: XCircle }
              ]}
              placeholder="Select status"
              icon={Filter}
            />
          </div>
          <div>
            <Select
              label="Year"
              value={filters.year.toString()}
              onChange={(value) => setFilters({ ...filters, year: parseInt(value) })}
              options={Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return { value: year.toString(), label: year.toString(), icon: CalendarIcon };
              })}
              placeholder="Select year"
              icon={CalendarIcon}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={fetchData} variant="secondary">
            Apply Filters
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Calendar
          holidays={holidays}
          leaves={leaves}
          weekendDays={[0, 6]}
        />

        {/* Leave Requests List */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Leave Requests</h2>
          {leaves.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No leave requests found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {leaves.map((leave) => {
                const user = leave.userId || {};
                const startDate = new Date(leave.startDate);
                const endDate = new Date(leave.endDate);
                const isSameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');

                return (
                  <div
                    key={leave._id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      leave.status === 'approved'
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                        : leave.status === 'rejected'
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                        : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{user.name || 'Unknown'}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            leave.status === 'approved'
                              ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                          }`}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                          {leave.leaveType && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                              {leave.leaveType === 'sick-leave' ? 'Sick Leave' :
                               leave.leaveType === 'paid-leave' ? 'Paid Leave' :
                               leave.leaveType === 'unpaid-leave' ? 'Unpaid Leave' :
                               leave.leaveType === 'work-from-home' ? 'Work From Home' : leave.leaveType}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {isSameDay
                            ? format(startDate, 'MMM d, yyyy')
                            : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
                          }
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {leave.type === 'half-day' 
                            ? `Half Day (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`
                            : 'Full Day'
                          }
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{leave.reason}</p>
                        {leave.reviewedBy && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Reviewed by {leave.reviewedBy.name} on {format(new Date(leave.reviewedAt), 'MMM d, yyyy')}
                          </p>
                        )}
                        {leave.rejectionReason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Reason: {leave.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          onClick={() => openReviewModal(leave, 'approved')}
                          variant="success"
                          size="sm"
                          className="flex-1"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => openReviewModal(leave, 'rejected')}
                          variant="danger"
                          size="sm"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedLeave(null);
          setRejectionReason('');
        }}
        title={reviewStatus === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
      >
        <div className="space-y-4">
          {selectedLeave && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Employee</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedLeave.userId?.name || 'Unknown'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-1">Date Range</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {format(new Date(selectedLeave.startDate), 'MMM d')} - {format(new Date(selectedLeave.endDate), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-1">Reason</p>
              <p className="text-slate-900 dark:text-slate-100">{selectedLeave.reason}</p>
            </div>
          )}
          {reviewStatus === 'rejected' && (
            <Input
              label="Rejection Reason"
              as="textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              rows={3}
              required
            />
          )}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowReviewModal(false);
                setSelectedLeave(null);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              variant={reviewStatus === 'approved' ? 'success' : 'danger'}
              className="flex-1"
              disabled={reviewStatus === 'rejected' && !rejectionReason.trim()}
              loading={reviewLoading}
            >
              {reviewStatus === 'approved' ? 'Approve' : 'Reject'} Leave
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
