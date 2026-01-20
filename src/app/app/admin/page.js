'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import BarChart from '@/components/shared/BarChart';
import LineChart from '@/components/shared/LineChart';
import PieChart from '@/components/shared/PieChart';
import ChartModal from '@/components/shared/ChartModal';
import { 
  Users, 
  Server, 
  FileText, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Settings,
  BarChart3,
  Calendar,
  Filter,
  TrendingUp,
  Maximize2,
  Bell,
  XCircle,
  AlertCircle,
  Home,
  UserCheck,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from '@/components/shared/DatePicker';
import Alert from '@/components/shared/Alert';
import Button from '@/components/shared/Button';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [overallAnalytics, setOverallAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedChart, setExpandedChart] = useState(null);
  const [period, setPeriod] = useState('week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
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
      fetch('/app/api/admin/stats').then(async r => {
        const contentType = r.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return { success: false };
        }
        return r.json();
      })
    ]).then(([userData, statsData]) => {
      if (userData.success) {
        setUser(userData.user);
        if (statsData.success) {
          setStats(statsData);
        } else {
          setError(statsData.error || 'Failed to load statistics');
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

  useEffect(() => {
    fetchOverallAnalytics();
  }, [period, customStartDate, customEndDate]);

  const fetchOverallAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (period === 'custom' && customStartDate && customEndDate) {
        params.append('startDate', customStartDate);
        params.append('endDate', customEndDate);
      }

      const res = await fetch(`/app/api/admin/overall-analytics?${params}`);
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setAnalyticsLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setOverallAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching overall analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-[#E39A2E]"></div>
        </div>
      </div>
    );
  }

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';


  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or deactivate users',
      icon: Users,
      href: '/app/admin/users',
      color: 'blue'
    },
    {
      title: 'Leave Requests',
      description: 'Review and manage leave requests',
      icon: Calendar,
      href: '/app/admin/leaves',
      color: 'amber',
      badge: stats?.pendingLeaves > 0 ? stats.pendingLeaves : null
    },
    {
      title: 'View Reports',
      description: 'Check attendance and leave reports',
      icon: FileText,
      href: '/app/admin/reports',
      color: 'emerald'
    },
    {
      title: 'Manage Holidays',
      description: 'Add or edit holidays',
      icon: Calendar,
      href: '/app/admin/holidays',
      color: 'violet'
    },
    {
      title: 'IP Management',
      description: 'Configure allowed IP addresses',
      icon: Server,
      href: '/app/admin/ips',
      color: 'cyan'
    },
    {
      title: 'Notifications',
      description: 'View all notifications',
      icon: Bell,
      href: '/app/admin/notifications',
      color: 'purple'
    },
    {
      title: 'Settings',
      description: 'Configure attendance rules',
      icon: Settings,
      href: '/app/admin/settings',
      color: 'slate'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header removed - now in layout */}


      {/* Overall System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.activeUsers || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {stats?.totalUsers || 0} total users
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Leaves</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.pendingLeaves || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {stats?.totalLeaves || 0} total requests
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">This Week Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.thisWeekAttendance || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {stats?.thisMonthAttendance || 0} this month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Today's Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats?.todayAttendance || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {stats?.totalRecords || 0} total records
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Period Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Analytics Period:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'custom', label: 'Custom Range' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${period === option.value
                    ? 'bg-[#E39A2E] text-white shadow-lg shadow-[#E39A2E]/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
          {period === 'custom' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <DatePicker
                value={customStartDate}
                onChange={(value) => setCustomStartDate(value)}
                placeholder="Start date"
              />
              <span className="text-slate-600 dark:text-slate-400">to</span>
              <DatePicker
                value={customEndDate}
                onChange={(value) => setCustomEndDate(value)}
                placeholder="End date"
                minDate={customStartDate}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Overall Analytics Charts */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : overallAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Users Chart */}
          <Card className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Active Users</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Users who punched in each day</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedChart('activeUsers')}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Expand chart"
                >
                  <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <LineChart
              data={overallAnalytics.charts.activeUsers.map(d => ({ label: d.date, value: d.count }))}
              color="#3b82f6"
              height={250}
            />
          </Card>

          {/* Leave Requests Trend */}
          <Card className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Leave Requests Trend</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Leave requests by status</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedChart('leaveTrend')}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Expand chart"
                >
                  <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
            <BarChart
              data={overallAnalytics.charts.leaveTrend.map(d => ({
                label: d.date,
                value: d.pending + d.approved + d.rejected,
                pending: d.pending,
                approved: d.approved,
                rejected: d.rejected
              }))}
              color="#f59e0b"
              height={250}
            />
          </Card>

          {/* Attendance Trend */}
          <Card className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Attendance Trend</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Daily attendance records</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedChart('attendanceTrend')}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Expand chart"
                >
                  <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <LineChart
              data={overallAnalytics.charts.attendanceTrend.map(d => ({ label: d.date, value: d.count }))}
              color="#a855f7"
              height={250}
            />
          </Card>

          {/* Overall System Activity */}
          <Card className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">System Activity</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Combined activity overview</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedChart('systemActivity')}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Expand chart"
                >
                  <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            <BarChart
              data={overallAnalytics.charts.systemActivity.map(d => ({
                label: d.date,
                value: d.attendance + d.leaves
              }))}
              color="#10b981"
              height={250}
            />
          </Card>
        </div>
      )}

      {/* Chart Modals */}
      {overallAnalytics && (
        <>
          <ChartModal
            isOpen={expandedChart === 'activeUsers'}
            onClose={() => setExpandedChart(null)}
            title="Active Users"
            subtitle="Users who punched in each day"
          >
            <LineChart
              data={overallAnalytics.charts.activeUsers.map(d => ({ label: d.date, value: d.count }))}
              color="#3b82f6"
              height={600}
              fullHeight={true}
            />
          </ChartModal>

          <ChartModal
            isOpen={expandedChart === 'leaveTrend'}
            onClose={() => setExpandedChart(null)}
            title="Leave Requests Trend"
            subtitle="Leave requests by status"
          >
            <BarChart
              data={overallAnalytics.charts.leaveTrend.map(d => ({
                label: d.date,
                value: d.pending + d.approved + d.rejected
              }))}
              color="#f59e0b"
              height={600}
              fullHeight={true}
            />
          </ChartModal>

          <ChartModal
            isOpen={expandedChart === 'attendanceTrend'}
            onClose={() => setExpandedChart(null)}
            title="Attendance Trend"
            subtitle="Daily attendance records"
          >
            <LineChart
              data={overallAnalytics.charts.attendanceTrend.map(d => ({ label: d.date, value: d.count }))}
              color="#a855f7"
              height={600}
              fullHeight={true}
            />
          </ChartModal>

          <ChartModal
            isOpen={expandedChart === 'systemActivity'}
            onClose={() => setExpandedChart(null)}
            title="System Activity"
            subtitle="Combined activity overview"
          >
            <BarChart
              data={overallAnalytics.charts.systemActivity.map(d => ({
                label: d.date,
                value: d.attendance + d.leaves
              }))}
              color="#10b981"
              height={600}
              fullHeight={true}
            />
          </ChartModal>
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
            <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
              amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
              emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
              violet: 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
              cyan: 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
              purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
              slate: 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
            };
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#E39A2E]/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                {action.badge && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {action.badge > 9 ? '9+' : action.badge}
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${colorClasses[action.color] || colorClasses.slate} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E39A2E] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-[#E39A2E] transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
