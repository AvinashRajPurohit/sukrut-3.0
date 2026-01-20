'use client';

import { useEffect, useState, useRef } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import DatePicker from '@/components/shared/DatePicker';
import Modal from '@/components/shared/Modal';
import { format, isSameDay, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';
import { Filter, Search, Calendar, Users, Download, FileDown, Settings, Loader2 } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/lib/utils/export-reports';

const getLeaveTypeLabel = (type) => {
  const labels = {
    'sick-leave': 'Sick Leave',
    'paid-leave': 'Paid Leave',
    'unpaid-leave': 'Unpaid Leave',
    'work-from-home': 'Work From Home'
  };
  return labels[type] || type;
};

const getLeaveTypeColor = (type) => {
  const colors = {
    'sick-leave': 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    'paid-leave': 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    'unpaid-leave': 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    'work-from-home': 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };
  return colors[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
};

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    'approved': 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    'rejected': 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  };
  return colors[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
};

const COLUMNS = [
  { id: 'date', label: 'Date', minWidth: '120px' },
  { id: 'user', label: 'User', minWidth: '180px' },
  { id: 'recordType', label: 'Record Type', minWidth: '140px' },
  { id: 'punchIn', label: 'Punch In', minWidth: '110px' },
  { id: 'punchOut', label: 'Punch Out', minWidth: '110px' },
  { id: 'hours', label: 'Hours', minWidth: '90px' },
  { id: 'lateReason', label: 'Late Reason', minWidth: '200px' },
  { id: 'earlyReason', label: 'Early Reason', minWidth: '200px' },
  { id: 'status', label: 'Status', minWidth: '130px' },
  { id: 'leaveType', label: 'Leave Type', minWidth: '140px' },
  { id: 'leaveDuration', label: 'Leave Duration', minWidth: '160px' },
  { id: 'leavePeriod', label: 'Leave Period', minWidth: '200px' },
  { id: 'leaveReason', label: 'Leave Reason', minWidth: '250px' },
  { id: 'leaveStatus', label: 'Leave Status', minWidth: '130px' },
  { id: 'reviewedBy', label: 'Reviewed By', minWidth: '150px' },
  { id: 'rejectionReason', label: 'Rejection Reason', minWidth: '200px' },
];

export default function ReportsPage() {
  const [allAttendance, setAllAttendance] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const observerTarget = useRef(null);

  const LIMIT = 10;

  useEffect(() => {
    Promise.all([
      fetch('/app/api/admin/users').then(r => r.json()),
      fetchReports(1, true)
    ]).then(([usersData]) => {
      if (usersData.success) {
        setUsers(usersData.users || []);
      }
    });
  }, []);

  // Refetch reports when filters change
  useEffect(() => {
    // Skip initial mount to avoid double fetch
    if (users.length === 0) return;
    
    fetchReports(1, true);
  }, [selectedUserId, startDate, endDate]);

  const fetchReports = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (selectedUserId) params.append('userId', selectedUserId);
      params.append('page', pageNum);
      params.append('limit', LIMIT);

      const res = await fetch(`/app/api/admin/reports?${params}`);
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        if (isInitial) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        if (isInitial) {
          setAllAttendance(data.allAttendance || []);
          setAllLeaves(data.allLeaves || []);
          setDisplayedRecords([]);
          setPage(1);
        }

        // Combine and sort records
        const newRecords = [
          ...(data.attendance || []).map(record => ({
            type: 'attendance',
            date: new Date(record.date),
            data: record
          })),
          ...(data.leaves || []).flatMap(leave => {
            const days = eachDayOfInterval({
              start: startOfDay(new Date(leave.startDate)),
              end: endOfDay(new Date(leave.endDate))
            });
            return days.map(day => ({
              type: 'leave',
              date: day,
              data: leave
            }));
          })
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        if (isInitial) {
          setDisplayedRecords(newRecords);
        } else {
          setDisplayedRecords(prev => [...prev, ...newRecords]);
        }

        setHasMore(data.pagination?.hasMore || false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Calculate summary from all records
  const calculateSummary = () => {
    const allRecords = [
      ...allAttendance.map(record => ({
        type: 'attendance',
        date: new Date(record.date),
        data: record
      })),
      ...allLeaves.flatMap(leave => {
        const days = eachDayOfInterval({
          start: startOfDay(new Date(leave.startDate)),
          end: endOfDay(new Date(leave.endDate))
        });
        return days.map(day => ({
          type: 'leave',
          date: day,
          data: leave
        }));
      })
    ];

    return allRecords.reduce((acc, record) => {
      if (record.type === 'attendance') {
        if (record.data.punchInLateReason) acc.lateArrivals++;
        if (record.data.punchOutEarlyReason) acc.earlyLeaves++;
      } else if (record.type === 'leave' && record.data.status === 'approved') {
        const leave = record.data;
        const leaveDays = leave.type === 'full-day' ? 1 : 0.5;
        if (leave.leaveType === 'sick-leave') acc.sickLeave += leaveDays;
        if (leave.leaveType === 'paid-leave') acc.paidLeave += leaveDays;
        if (leave.leaveType === 'unpaid-leave') acc.unpaidLeave += leaveDays;
        if (leave.leaveType === 'work-from-home') acc.workFromHome += leaveDays;
      }
      return acc;
    }, {
      sickLeave: 0,
      paidLeave: 0,
      unpaidLeave: 0,
      workFromHome: 0,
      lateArrivals: 0,
      earlyLeaves: 0
    });
  };

  const summary = calculateSummary();

  // Filter displayed records by search term
  const filteredRecords = displayedRecords.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    if (record.type === 'attendance') {
      const user = record.data.userId || {};
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    } else {
      const user = record.data.userId || {};
      const leaveType = getLeaveTypeLabel(record.data.leaveType).toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        leaveType.includes(searchLower) ||
        record.data.reason?.toLowerCase().includes(searchLower)
      );
    }
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchReports(page + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, page]);

  const handleFilter = () => {
    fetchReports(1, true);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedUserId('');
    setSearchTerm('');
    fetchReports(1, true);
  };

  const handleExportPDF = () => {
    const allRecords = [
      ...allAttendance.map(record => ({
        type: 'attendance',
        date: new Date(record.date),
        data: record
      })),
      ...allLeaves.flatMap(leave => {
        const days = eachDayOfInterval({
          start: startOfDay(new Date(leave.startDate)),
          end: endOfDay(new Date(leave.endDate))
        });
        return days.map(day => ({
          type: 'leave',
          date: day,
          data: leave
        }));
      })
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const filtered = allRecords.filter(record => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      
      if (record.type === 'attendance') {
        const user = record.data.userId || {};
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      } else {
        const user = record.data.userId || {};
        const leaveType = getLeaveTypeLabel(record.data.leaveType).toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          leaveType.includes(searchLower) ||
          record.data.reason?.toLowerCase().includes(searchLower)
        );
      }
    });
    
    exportToPDF(filtered, 'admin-reports', visibleColumns, summary);
  };

  const handleExportExcel = () => {
    const allRecords = [
      ...allAttendance.map(record => ({
        type: 'attendance',
        date: new Date(record.date),
        data: record
      })),
      ...allLeaves.flatMap(leave => {
        const days = eachDayOfInterval({
          start: startOfDay(new Date(leave.startDate)),
          end: endOfDay(new Date(leave.endDate))
        });
        return days.map(day => ({
          type: 'leave',
          date: day,
          data: leave
        }));
      })
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const filtered = allRecords.filter(record => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      
      if (record.type === 'attendance') {
        const user = record.data.userId || {};
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      } else {
        const user = record.data.userId || {};
        const leaveType = getLeaveTypeLabel(record.data.leaveType).toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          leaveType.includes(searchLower) ||
          record.data.reason?.toLowerCase().includes(searchLower)
        );
      }
    });
    
    exportToExcel(filtered, 'admin-reports', visibleColumns, summary);
  };

  const toggleColumn = (columnId) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  if (loading && displayedRecords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Filter */}
            <div>
              <Select
                label="User"
                value={selectedUserId}
                onChange={(value) => setSelectedUserId(value)}
                options={[
                  { value: '', label: 'All Users', icon: Users },
                  ...users.map(user => ({ value: user.id || user._id, label: user.name, icon: Users }))
                ]}
                placeholder="Select user"
                icon={Users}
              />
            </div>

            {/* Start Date */}
            <div>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(value) => setStartDate(value)}
                placeholder="Select start date"
              />
            </div>

            {/* End Date */}
            <div>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(value) => setEndDate(value)}
                placeholder="Select end date"
                minDate={startDate}
              />
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, leave type..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E39A2E]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleFilter}
              className="px-6"
            >
              <Filter className="w-5 h-5 mr-2" />
              Apply Filters
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="px-6"
            >
              Reset
            </Button>
            <div className="ml-auto text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredRecords.length} of {allAttendance.length + allLeaves.length} records
            </div>
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Records</h2>
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowColumnModal(true)} variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Columns
            </Button>
            <Button onClick={handleExportPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Column Visibility Modal */}
        <Modal isOpen={showColumnModal} onClose={() => setShowColumnModal(false)} title="Show/Hide Columns">
          <div className="space-y-3">
            {COLUMNS.map(column => (
              <div key={column.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <span className="text-sm text-slate-900 dark:text-slate-100">{column.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumn(column.id);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    visibleColumns[column.id] ? 'bg-[#E39A2E]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      visibleColumns[column.id] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Modal>

        {filteredRecords.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">No records found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            {/* Table Container with Single Horizontal Scroll */}
            <div className="flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-auto">
              <table className="w-full" style={{ minWidth: '1700px' }}>
                <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {visibleColumns.date && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'date').minWidth }}>Date</th>}
                    {visibleColumns.user && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'user').minWidth }}>User</th>}
                    {visibleColumns.recordType && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'recordType').minWidth }}>Record Type</th>}
                    {visibleColumns.punchIn && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'punchIn').minWidth }}>Punch In</th>}
                    {visibleColumns.punchOut && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'punchOut').minWidth }}>Punch Out</th>}
                    {visibleColumns.hours && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'hours').minWidth }}>Hours</th>}
                    {visibleColumns.lateReason && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'lateReason').minWidth }}>Late Reason</th>}
                    {visibleColumns.earlyReason && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'earlyReason').minWidth }}>Early Reason</th>}
                    {visibleColumns.status && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'status').minWidth }}>Status</th>}
                    {visibleColumns.leaveType && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'leaveType').minWidth }}>Leave Type</th>}
                    {visibleColumns.leaveDuration && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'leaveDuration').minWidth }}>Leave Duration</th>}
                    {visibleColumns.leavePeriod && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'leavePeriod').minWidth }}>Leave Period</th>}
                    {visibleColumns.leaveReason && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'leaveReason').minWidth }}>Leave Reason</th>}
                    {visibleColumns.leaveStatus && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'leaveStatus').minWidth }}>Leave Status</th>}
                    {visibleColumns.reviewedBy && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'reviewedBy').minWidth }}>Reviewed By</th>}
                    {visibleColumns.rejectionReason && <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" style={{ minWidth: COLUMNS.find(c => c.id === 'rejectionReason').minWidth }}>Rejection Reason</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => {
                    if (record.type === 'attendance') {
                      const report = record.data;
                      const user = report.userId || {};
                      const punchIn = new Date(report.punchInTime);
                      const punchOut = report.punchOutTime ? new Date(report.punchOutTime) : null;
                      const hours = punchOut 
                        ? ((punchOut.getTime() - punchIn.getTime()) / (1000 * 60 * 60)).toFixed(2)
                        : '-';

                      return (
                        <tr key={`attendance-${report._id}`} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          {visibleColumns.date && (
                            <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {format(record.date, 'MMM d, yyyy')}
                            </td>
                          )}
                          {visibleColumns.user && (
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500">{user.email || ''}</p>
                              </div>
                            </td>
                          )}
                          {visibleColumns.recordType && (
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                Attendance
                              </span>
                            </td>
                          )}
                          {visibleColumns.punchIn && (
                            <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {format(punchIn, 'HH:mm:ss')}
                            </td>
                          )}
                          {visibleColumns.punchOut && (
                            <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {punchOut ? format(punchOut, 'HH:mm:ss') : '-'}
                            </td>
                          )}
                          {visibleColumns.hours && (
                            <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {hours !== '-' ? `${hours}h` : '-'}
                            </td>
                          )}
                          {visibleColumns.lateReason && (
                            <td className="py-4 px-6 text-sm text-amber-600 dark:text-amber-400 wrap-break-word" style={{ maxWidth: '200px' }}>
                              {report.punchInLateReason || '-'}
                            </td>
                          )}
                          {visibleColumns.earlyReason && (
                            <td className="py-4 px-6 text-sm text-amber-600 dark:text-amber-400 wrap-break-word" style={{ maxWidth: '200px' }}>
                              {report.punchOutEarlyReason || '-'}
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="py-4 px-6">
                              {punchOut ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                  Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                  In Progress
                                </span>
                              )}
                            </td>
                          )}
                          {visibleColumns.leaveType && <td className="py-4 px-6">-</td>}
                          {visibleColumns.leaveDuration && <td className="py-4 px-6">-</td>}
                          {visibleColumns.leavePeriod && <td className="py-4 px-6">-</td>}
                          {visibleColumns.leaveReason && <td className="py-4 px-6">-</td>}
                          {visibleColumns.leaveStatus && <td className="py-4 px-6">-</td>}
                          {visibleColumns.reviewedBy && <td className="py-4 px-6">-</td>}
                          {visibleColumns.rejectionReason && <td className="py-4 px-6">-</td>}
                        </tr>
                      );
                    } else {
                      const leave = record.data;
                      const user = leave.userId || {};
                      const isStartDate = isSameDay(new Date(leave.startDate), record.date);
                      const isEndDate = isSameDay(new Date(leave.endDate), record.date);
                      const isSingleDay = isSameDay(new Date(leave.startDate), new Date(leave.endDate));

                      return (
                        <tr key={`leave-${leave._id}-${format(record.date, 'yyyy-MM-dd')}`} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          {visibleColumns.date && (
                            <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {format(record.date, 'MMM d, yyyy')}
                              {isSingleDay ? null : isStartDate ? (
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Start</span>
                              ) : isEndDate ? (
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">End</span>
                              ) : (
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Middle</span>
                              )}
                            </td>
                          )}
                          {visibleColumns.user && (
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500">{user.email || ''}</p>
                              </div>
                            </td>
                          )}
                          {visibleColumns.recordType && (
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)} whitespace-nowrap`}>
                                {getLeaveTypeLabel(leave.leaveType)}
                              </span>
                            </td>
                          )}
                          {visibleColumns.punchIn && <td className="py-4 px-6">-</td>}
                          {visibleColumns.punchOut && <td className="py-4 px-6">-</td>}
                          {visibleColumns.hours && <td className="py-4 px-6">-</td>}
                          {visibleColumns.lateReason && <td className="py-4 px-6">-</td>}
                          {visibleColumns.earlyReason && <td className="py-4 px-6">-</td>}
                          {visibleColumns.status && <td className="py-4 px-6">-</td>}
                          {visibleColumns.leaveType && (
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)} whitespace-nowrap`}>
                                {getLeaveTypeLabel(leave.leaveType)}
                              </span>
                            </td>
                          )}
                          {visibleColumns.leaveDuration && (
                            <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {leave.type === 'full-day' ? 'Full Day' : `Half Day (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`}
                            </td>
                          )}
                          {visibleColumns.leavePeriod && (
                            <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                            </td>
                          )}
                          {visibleColumns.leaveReason && (
                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400 wrap-break-word" style={{ maxWidth: '250px' }}>
                              {leave.reason || '-'}
                            </td>
                          )}
                          {visibleColumns.leaveStatus && (
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)} whitespace-nowrap`}>
                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                              </span>
                            </td>
                          )}
                          {visibleColumns.reviewedBy && (
                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {leave.reviewedBy?.name || '-'}
                            </td>
                          )}
                          {visibleColumns.rejectionReason && (
                            <td className="py-4 px-6 text-sm text-red-600 dark:text-red-400 wrap-break-word" style={{ maxWidth: '200px' }}>
                              {leave.rejectionReason || '-'}
                            </td>
                          )}
                        </tr>
                      );
                    }
                  })}
                  {/* Loading indicator */}
                  {loadingMore && (
                    <tr>
                      <td colSpan={COLUMNS.filter(c => visibleColumns[c.id]).length} className="py-8 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-[#E39A2E]" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">Loading more records...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* Observer target for infinite scroll */}
                  {hasMore && !loadingMore && (
                    <tr ref={observerTarget}>
                      <td colSpan={COLUMNS.filter(c => visibleColumns[c.id]).length} className="h-1"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Summary Section - Fixed at bottom of table container */}
            {filteredRecords.length > 0 && (
              <div className="shrink-0 border-t-2 border-slate-300 dark:border-slate-600 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-2">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Late Arrivals</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{summary.lateArrivals}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Early Leaves</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{summary.earlyLeaves}</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sick Leave</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{summary.sickLeave.toFixed(1)} days</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Paid Leave</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{summary.paidLeave.toFixed(1)} days</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Unpaid Leave</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{summary.unpaidLeave.toFixed(1)} days</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Work From Home</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{summary.workFromHome.toFixed(1)} days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
