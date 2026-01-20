'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PunchCard from '@/components/user/PunchCard';
import Card from '@/components/shared/Card';
import BarChart from '@/components/shared/BarChart';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { Clock, Calendar, CheckCircle2, FileText, ArrowRight, BarChart3, AlertCircle, XCircle, CheckCircle, Home } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendanceConfig, setAttendanceConfig] = useState(null);
  const [leaveBalances, setLeaveBalances] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    setLoading(true);
    setError('');
    
    Promise.all([
      fetch('/app/api/auth/me').then(async r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await r.text();
          console.error('Non-JSON response from /api/auth/me:', text.substring(0, 200));
          return { success: false, error: 'Invalid response from server' };
        }
        return r.json();
      }),
      fetch('/app/api/user/reports?startDate=' + new Date(new Date().setDate(1)).toISOString().split('T')[0]).then(async r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return { success: false, reports: [] };
        }
        return r.json();
      }).catch(() => ({ success: false, reports: [] })),
      fetch(`/app/api/user/leaves?year=${year}&month=${month}`).then(async r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return { success: false, leaves: [] };
        }
        return r.json();
      }).catch(() => ({ success: false, leaves: [] })),
      fetch('/app/api/user/config').then(async r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return { success: false };
        }
        return r.json();
      }).catch(() => ({ success: false })),
      fetch('/app/api/user/leave-balance').then(async r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return { success: false, balances: {} };
        }
        return r.json();
      }).catch(() => ({ success: false, balances: {} }))
    ]).then(([userData, reportsData, leavesData, configData, balanceData]) => {
      if (userData.success) {
        setUser(userData.user);
        
        if (reportsData.success) {
          const records = reportsData.reports || [];
          const completed = records.filter(r => r.punchOutTime).length;
          const totalHours = records.reduce((sum, r) => {
            if (r.punchOutTime) {
              const hours = (new Date(r.punchOutTime) - new Date(r.punchInTime)) / (1000 * 60 * 60);
              return sum + hours;
            }
            return sum;
          }, 0);
          
          const lateCount = records.filter(r => r.punchInLateReason).length;
          const earlyCount = records.filter(r => r.punchOutEarlyReason).length;
          
          setStats({ 
            completed, 
            totalHours: totalHours.toFixed(1),
            lateCount,
            earlyCount
          });
          
          setRecentActivity(records.slice(0, 5));
        }
        
        if (leavesData.success) {
          setLeaves(leavesData.leaves || []);
        }
        
        if (configData.success) {
          setAttendanceConfig(configData.config);
        }
        
        if (balanceData.success) {
          setLeaveBalances(balanceData.balances || {});
        }
      } else {
        if (userData.error === 'Unauthorized') {
          router.push('/app/login');
        } else {
          setError(userData.error || 'Failed to load dashboard data');
        }
      }
    }).catch((error) => {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard. Please try again.');
    })
    .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-[#E39A2E]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} onDismiss={() => setError('')} />
        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weeklyData = [];
  const today = new Date();
  const currentDay = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - currentDay);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dayRecords = recentActivity.filter(r => {
      const recordDate = new Date(r.date);
      return format(recordDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    weeklyData.push({
      day: format(day, 'EEE'),
      count: dayRecords.length
    });
  }

  // Filter leaves for current month
  const currentMonthLeaves = leaves.filter(leave => {
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    return isWithinInterval(leaveStart, { start: monthStart, end: monthEnd }) ||
           isWithinInterval(leaveEnd, { start: monthStart, end: monthEnd }) ||
           (leaveStart <= monthStart && leaveEnd >= monthEnd);
  });

  // Calculate leave statistics
  const leaveStats = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    total: leaves.length
  };

  const leaveTypeLabels = {
    'sick-leave': 'Sick Leave',
    'paid-leave': 'Paid Leave',
    'unpaid-leave': 'Unpaid Leave',
    'work-from-home': 'Work From Home'
  };

  const leaveStatusColors = {
    'pending': { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', icon: Clock },
    'approved': { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle },
    'rejected': { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: XCircle }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col space-y-6 h-full">
          {/* Punch Card */}
          <div className="shrink-0">
            <PunchCard />
          </div>
          
          {/* Weekly Activity Chart */}
          {recentActivity.length > 0 && (
            <div className="shrink-0">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">This Week's Activity</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your attendance pattern</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#E39A2E]/10">
                    <BarChart3 className="w-5 h-5 text-[#E39A2E]" />
                  </div>
                </div>
                <BarChart
                  data={weeklyData}
                  color="#E39A2E"
                  height={200}
                />
              </Card>
            </div>
          )}

          {/* Leave Details for Current Month - Always Show, flex-grow to fill space */}
          <Card className="flex-1 flex flex-col min-h-0 h-full">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Leave Details - {format(new Date(), 'MMMM yyyy')}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your leave requests for this month</p>
              </div>
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            
            {currentMonthLeaves.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
                {currentMonthLeaves.map((leave, index) => {
                  const StatusIcon = leaveStatusColors[leave.status]?.icon || Clock;
                  const statusColor = leaveStatusColors[leave.status] || leaveStatusColors.pending;
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  const isSameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
                  
                  return (
                    <div 
                      key={index} 
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                              {leaveTypeLabels[leave.leaveType] || leave.leaveType}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor.bg} ${statusColor.text} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            {isSameDay 
                              ? format(startDate, 'MMM d, yyyy')
                              : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
                            }
                            {leave.type === 'half-day' && (
                              <span className="ml-2 text-xs text-slate-500">
                                ({leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})
                              </span>
                            )}
                          </p>
                          {leave.reason && (
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 line-clamp-2">
                              {leave.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      {leave.reviewedBy && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Reviewed by {leave.reviewedBy.name} on {format(new Date(leave.reviewedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center min-h-[200px]">
                <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">No leave requests for this month</p>
                <Link 
                  href="/app/user/leaves"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Request a leave →
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col space-y-6 h-full">
          {/* This Month Stats */}
          <Card className="shrink-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">This Month</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Days Completed</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats?.completed || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total Hours</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats?.totalHours || '0'}h</p>
                  </div>
                </div>
              </div>
              {stats && (stats.lateCount > 0 || stats.earlyCount > 0) && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  {stats.lateCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Late Arrivals</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">{stats.lateCount}</span>
                    </div>
                  )}
                  {stats.earlyCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Early Leaves</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{stats.earlyCount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Leave Statistics */}
          <Card className="shrink-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Leave Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{leaveStats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Approved</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{leaveStats.approved}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Rejected</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{leaveStats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Leave Balances */}
          {leaveBalances && Object.keys(leaveBalances).length > 0 && (
            <Card className="shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Leave Balances</h2>
              <div className="space-y-3">
                {Object.entries(leaveBalances).map(([leaveType, balance]) => {
                  if (!balance || balance.limit === null || balance.limit === undefined) return null;
                  
                  const typeLabel = leaveTypeLabels[leaveType] || leaveType.replace('-', ' ');
                  const used = balance.used || 0;
                  const limit = balance.limit || 0;
                  const available = limit - used;
                  const percentage = limit > 0 ? (used / limit) * 100 : 0;
                  
                  return (
                    <div key={leaveType} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{typeLabel}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {available.toFixed(1)} / {limit.toFixed(1)} days
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            percentage >= 80 ? 'bg-red-500' : 
                            percentage >= 60 ? 'bg-amber-500' : 
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Used: {used.toFixed(1)} days • Available: {available.toFixed(1)} days
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Early Leave Configuration Info */}
          {attendanceConfig && attendanceConfig.earlyLeaveThresholdMinutes > 0 && (
            <Card className="shrink-0">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 shrink-0">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Early Leave Policy</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Leaving {attendanceConfig.earlyLeaveThresholdMinutes} minutes before the scheduled end time ({attendanceConfig.endTime?.substring(0, 5)}) requires a reason.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Card className="shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((record, index) => {
                  const punchIn = new Date(record.punchInTime);
                  const punchOut = record.punchOutTime ? new Date(record.punchOutTime) : null;
                  return (
                    <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {format(punchIn, 'MMM d')}
                        </span>
                        {punchOut ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            Complete
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                            In Progress
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        <span className="font-mono">{format(punchIn, 'HH:mm')}</span>
                        {punchOut && (
                          <>
                            <span className="mx-2 text-slate-400">→</span>
                            <span className="font-mono">{format(punchOut, 'HH:mm')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Quick Access */}
          <Card className="shrink-0 mt-auto">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Access</h2>
            <div className="space-y-3">
              <Link 
                href="/app/user/reports"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#E39A2E]/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#E39A2E]/10 group-hover:bg-[#E39A2E]/20 transition-colors">
                    <FileText className="w-5 h-5 text-[#E39A2E]" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">View Reports</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Attendance history</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#E39A2E] group-hover:translate-x-1 transition-all" />
              </Link>
              
              <Link 
                href="/app/user/leaves"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Leave Requests</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manage your leaves</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
