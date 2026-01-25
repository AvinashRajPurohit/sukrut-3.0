'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import Calendar from '@/components/shared/Calendar';
import { Plus, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, FileText, Heart, DollarSign, Home, AlertCircle, X } from 'lucide-react';
import DatePicker from '@/components/shared/DatePicker';
import Select from '@/components/shared/Select';
import { format } from 'date-fns';
import { useNavbarActions } from '@/components/shared/NavbarActionsContext';
import Alert from '@/components/shared/Alert';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

export default function LeavesPage() {
  const { setActions } = useNavbarActions();
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'sick-leave',
    startDate: '',
    endDate: '',
    type: 'full-day',
    halfDayType: 'first-half',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, leaveId: null, onConfirm: null, loading: false, error: '' });

  useEffect(() => {
    fetchData();
    fetchLeaveBalances();
  }, [currentYear]);

  const fetchLeaveBalances = async () => {
    try {
      const res = await fetch('/app/api/user/leave-balance');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Leave balances data:', data);
      if (data.success) {
        setLeaveBalances(data.balances || {});
      } else {
        console.error('Failed to fetch leave balances:', data.error);
        setLeaveBalances({});
      }
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      setLeaveBalances({});
    }
  };

  useEffect(() => {
    setActions(
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className="!px-2.5 sm:!px-3"
        title="Request Leave"
      >
        <Plus className="w-5 h-5 sm:mr-2" />
        <span className="hidden sm:inline">Request Leave</span>
      </Button>
    );
    return () => setActions(null);
  }, [setActions]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leavesRes, holidaysRes] = await Promise.all([
        fetch(`/app/api/user/leaves?year=${currentYear}`),
        fetch(`/app/api/admin/holidays?year=${currentYear}`)
      ]);

      const [leavesData, holidaysData] = await Promise.all([
        leavesRes.json(),
        holidaysRes.json()
      ]);

      if (leavesData.success) {
        setLeaves(leavesData.leaves || []);
      }
      if (holidaysData.success) {
        setHolidays(holidaysData.holidays || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
      const res = await fetch('/app/api/user/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Leave request submitted successfully!');
        await Promise.all([fetchData(), fetchLeaveBalances()]);
        setShowModal(false);
        setFormData({
          leaveType: 'sick-leave',
          startDate: '',
          endDate: '',
          type: 'full-day',
          halfDayType: 'first-half',
          reason: ''
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      setError('An error occurred while submitting leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setFormData({
      ...formData,
      startDate: dateStr,
      endDate: dateStr
    });
    setShowModal(true);
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
  const cancelledLeaves = leaves.filter(l => l.status === 'cancelled');

  const leaveTypeOptions = [
    { value: 'sick-leave', label: 'Sick Leave', icon: Heart },
    { value: 'paid-leave', label: 'Paid Leave', icon: DollarSign },
    { value: 'unpaid-leave', label: 'Unpaid Leave', icon: AlertCircle },
    { value: 'work-from-home', label: 'Work From Home', icon: Home }
  ];

  const leaveTypeLabels = {
    'sick-leave': 'Sick Leave',
    'paid-leave': 'Paid Leave',
    'unpaid-leave': 'Unpaid Leave',
    'work-from-home': 'Work From Home'
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <Alert type="error" message={error} onDismiss={() => setError('')} />
      )}
      {success && (
        <Alert type="success" message={success} onDismiss={() => setSuccess('')} />
      )}

      {/* Leave Balances */}
      <Card className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">Leave Balance</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Your available leave days for this period</p>
        </div>
        {leaveBalances === null ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E] mx-auto"></div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">Loading leave balances...</p>
          </div>
        ) : Object.keys(leaveBalances).length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No leave configurations found</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Please contact your administrator</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {leaveBalances.sickLeave && (
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">Sick Leave</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{leaveBalances.sickLeave.periodLabel}</p>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {leaveBalances.sickLeave.remaining.toFixed(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 shrink-0">of {leaveBalances.sickLeave.limit}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">days remaining</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Used</span>
                      <span className="font-medium">{leaveBalances.sickLeave.used.toFixed(1)} days</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 dark:bg-red-600 transition-all rounded-full"
                        style={{ 
                          width: `${Math.min(100, (leaveBalances.sickLeave.used / leaveBalances.sickLeave.limit) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {leaveBalances.paidLeave && (
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">Paid Leave</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{leaveBalances.paidLeave.periodLabel}</p>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {leaveBalances.paidLeave.remaining.toFixed(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 shrink-0">of {leaveBalances.paidLeave.limit}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">days remaining</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Used</span>
                      <span className="font-medium">{leaveBalances.paidLeave.used.toFixed(1)} days</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-600 transition-all rounded-full"
                        style={{ 
                          width: `${Math.min(100, (leaveBalances.paidLeave.used / leaveBalances.paidLeave.limit) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {leaveBalances.workFromHome && (
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base"><span className="sm:hidden">WFH</span><span className="hidden sm:inline">Work From Home</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{leaveBalances.workFromHome.periodLabel}</p>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {leaveBalances.workFromHome.remaining.toFixed(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 shrink-0">of {leaveBalances.workFromHome.limit}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">days remaining</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Used</span>
                      <span className="font-medium">{leaveBalances.workFromHome.used.toFixed(1)} days</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 dark:bg-purple-600 transition-all rounded-full"
                        style={{ 
                          width: `${Math.min(100, (leaveBalances.workFromHome.used / leaveBalances.workFromHome.limit) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{pendingLeaves.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20 shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">Approved</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{approvedLeaves.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-0.5 sm:mb-1">Rejected</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{rejectedLeaves.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-red-100 dark:bg-red-900/20 shrink-0">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Calendar */}
        <Calendar
          holidays={holidays}
          leaves={leaves}
          onDateClick={handleDateClick}
          selectedDate={selectedDate}
          weekendDays={[0, 6]}
        />

        {/* Leave Requests List */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">My Leave Requests</h2>
            <Select
              value={currentYear.toString()}
              onChange={(value) => setCurrentYear(parseInt(value))}
              options={Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return { value: year.toString(), label: year.toString(), icon: CalendarIcon };
              })}
              placeholder="Select year"
              icon={CalendarIcon}
            />
          </div>

          {leaves.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-700 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">No leave requests yet</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[600px] overflow-y-auto pb-3 sm:pb-4 min-h-0">
              {leaves.map((leave) => {
                const startDate = new Date(leave.startDate);
                const endDate = new Date(leave.endDate);
                const isSameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');

                return (
                  <div
                    key={leave._id}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      leave.status === 'approved'
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                        : leave.status === 'rejected'
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                        : leave.status === 'cancelled'
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        {leave.status === 'pending' && (
                          <div className="flex justify-end mb-2">
                            <button
                              onClick={() => handleCancelLeave(leave)}
                              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                              title="Cancel leave request"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            leave.status === 'approved'
                              ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              : leave.status === 'cancelled'
                              ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                              : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                          }`}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                          {leave.leaveType && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                              {leave.leaveType === 'work-from-home' ? (<><span className="sm:hidden">WFH</span><span className="hidden sm:inline">Work From Home</span></>) : (leaveTypeLabels[leave.leaveType] || leave.leaveType)}
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
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 line-clamp-2 sm:line-clamp-none">{leave.reason}</p>
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
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Request Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({
            leaveType: 'sick-leave',
            startDate: '',
            endDate: '',
            type: 'full-day',
            halfDayType: 'first-half',
            reason: ''
          });
          setError('');
        }}
        title="Request Leave"
      >
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-600 dark:text-emerald-400">
              {success}
            </div>
          )}
          <Select
            label="Leave Category"
            value={formData.leaveType}
            onChange={(value) => setFormData({ ...formData, leaveType: value })}
            options={leaveTypeOptions}
            placeholder="Select leave category"
            icon={CalendarIcon}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(value) => setFormData({ ...formData, startDate: value })}
              placeholder="Select start date"
              required
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(value) => setFormData({ ...formData, endDate: value })}
              placeholder="Select end date"
              minDate={formData.startDate}
              required
            />
          </div>
          <Select
            label="Duration Type"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
            options={[
              { value: 'full-day', label: 'Full Day', icon: FileText },
              { value: 'half-day', label: 'Half Day', icon: Clock }
            ]}
            placeholder="Select duration type"
            icon={FileText}
            required
          />
          {formData.type === 'half-day' && (
            <Select
              label="Half Day Type"
              value={formData.halfDayType}
              onChange={(value) => setFormData({ ...formData, halfDayType: value })}
              options={[
                { value: 'first-half', label: 'First Half', icon: Clock },
                { value: 'second-half', label: 'Second Half', icon: Clock }
              ]}
              placeholder="Select half day type"
              icon={Clock}
            />
          )}
          <Input
            label="Reason"
            as="textarea"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Please provide a reason for your leave request (minimum 10 characters)..."
            rows={4}
            required
            minLength={10}
          />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setFormData({
                  leaveType: 'sick-leave',
                  startDate: '',
                  endDate: '',
                  type: 'full-day',
                  halfDayType: 'first-half',
                  reason: ''
                });
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting} loading={submitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Leave Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, leaveId: null, onConfirm: null, loading: false, error: '' })}
        onConfirm={confirmationModal.onConfirm}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request? This action cannot be undone."
        confirmText="Cancel Leave"
        cancelText="Keep Request"
        loading={confirmationModal.loading}
        error={confirmationModal.error}
        variant="danger"
      />
    </div>
  );
}
