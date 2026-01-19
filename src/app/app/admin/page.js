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
  Maximize2
} from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from '@/components/shared/DatePicker';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [expandedChart, setExpandedChart] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/app/api/auth/me').then(r => r.json()),
      fetch('/app/api/admin/stats').then(r => r.json())
    ]).then(([userData, statsData]) => {
      if (userData.success) {
        setUser(userData.user);
        if (statsData.success) {
          setStats(statsData);
        }
      } else {
        router.push('/app/login');
      }
    }).catch(() => router.push('/app/login'))
    .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    fetchAnalytics();
  }, [period, customStartDate, customEndDate]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (period === 'custom' && customStartDate && customEndDate) {
        params.append('startDate', customStartDate);
        params.append('endDate', customEndDate);
      }

      const res = await fetch(`/app/api/admin/analytics?${params}`);
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or deactivate users',
      icon: Users,
      href: '/app/admin/users',
      color: 'blue'
    },
    {
      title: 'IP Management',
      description: 'Configure allowed IP addresses',
      icon: Server,
      href: '/app/admin/ips',
      color: 'purple'
    },
    {
      title: 'View Reports',
      description: 'Check attendance reports',
      icon: FileText,
      href: '/app/admin/reports',
      color: 'emerald'
    },
    {
      title: 'Settings',
      description: 'Configure attendance rules',
      icon: Settings,
      href: '/app/admin/settings',
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header removed - now in layout */}

      {/* Period Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter Period:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {periodOptions.map((option) => (
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

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Records</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {analytics ? analytics.stats.totalRecords : stats?.totalRecords || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {analytics ? 'In selected period' : 'All time'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {analytics ? `${analytics.stats.completionRate}%` : '-'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Records completed</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {analytics ? analytics.stats.totalHours : '-'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Hours worked</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {analytics ? analytics.stats.uniqueUsers : stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {analytics ? 'Unique users' : 'Total users'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid - Row 1 */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
            </div>
          </Card>
        </div>
      ) : analytics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Attendance Chart */}
            <Card className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daily Attendance Trend</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Attendance over time</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedChart('daily')}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Expand chart"
                  >
                    <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <LineChart
                data={analytics.charts.dailyAttendance.map(d => ({ label: d.date, value: d.count }))}
                color="#E39A2E"
                height={250}
              />
            </Card>

            {/* Weekly Attendance Chart */}
            <Card className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Weekly Pattern</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Attendance by day of week</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedChart('weekly')}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Expand chart"
                  >
                    <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <BarChart
                data={analytics.charts.weeklyAttendance.map(w => ({ label: w.day, value: w.count }))}
                color="#E39A2E"
                height={250}
              />
            </Card>
          </div>

          {/* Charts Grid - Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Distribution Chart */}
            <Card className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Hourly Distribution</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Punch-in times distribution</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedChart('hourly')}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Expand chart"
                  >
                    <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
              <BarChart
                data={analytics.charts.hourlyDistribution.map(h => ({ label: `${h.hour}:00`, value: h.count }))}
                color="#E39A2E"
                height={250}
              />
            </Card>

            {/* Status Distribution Pie Chart */}
            <Card className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Status Distribution</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Attendance status breakdown</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedChart('status')}
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
              <PieChart
                data={[
                  { label: 'Completed', value: analytics.charts.statusDistribution.completed, color: '#10b981' },
                  { label: 'In Progress', value: analytics.charts.statusDistribution.inProgress, color: '#f59e0b' },
                  { label: 'Late Arrivals', value: analytics.charts.statusDistribution.late, color: '#ef4444' },
                  { label: 'Early Leaves', value: analytics.charts.statusDistribution.early, color: '#8b5cf6' }
                ]}
                height={250}
              />
            </Card>
          </div>
        </>
      )}

      {/* Chart Modals */}
      {analytics && (
        <>
          <ChartModal
            isOpen={expandedChart === 'daily'}
            onClose={() => setExpandedChart(null)}
            title="Daily Attendance Trend"
            subtitle="Attendance over time"
          >
            <LineChart
              data={analytics.charts.dailyAttendance.map(d => ({ label: d.date, value: d.count }))}
              color="#E39A2E"
              height={600}
              fullHeight={true}
            />
          </ChartModal>

          <ChartModal
            isOpen={expandedChart === 'weekly'}
            onClose={() => setExpandedChart(null)}
            title="Weekly Pattern"
            subtitle="Attendance by day of week"
          >
            <BarChart
              data={analytics.charts.weeklyAttendance.map(w => ({ label: w.day, value: w.count }))}
              color="#E39A2E"
              height={600}
              fullHeight={true}
            />
          </ChartModal>

          <ChartModal
            isOpen={expandedChart === 'hourly'}
            onClose={() => setExpandedChart(null)}
            title="Hourly Distribution"
            subtitle="Punch-in times distribution"
          >
            <BarChart
              data={analytics.charts.hourlyDistribution.map(h => ({ label: `${h.hour}:00`, value: h.count }))}
              color="#E39A2E"
              height={600}
              fullHeight={true}
            />
          </ChartModal>

          <ChartModal
            isOpen={expandedChart === 'status'}
            onClose={() => setExpandedChart(null)}
            title="Status Distribution"
            subtitle="Attendance status breakdown"
          >
            <div className="flex items-center justify-center h-full">
              <PieChart
                data={[
                  { label: 'Completed', value: analytics.charts.statusDistribution.completed, color: '#10b981' },
                  { label: 'In Progress', value: analytics.charts.statusDistribution.inProgress, color: '#f59e0b' },
                  { label: 'Late Arrivals', value: analytics.charts.statusDistribution.late, color: '#ef4444' },
                  { label: 'Early Leaves', value: analytics.charts.statusDistribution.early, color: '#8b5cf6' }
                ]}
                height={600}
                fullHeight={true}
              />
            </div>
          </ChartModal>
        </>
      )}

      {/* User Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users Activity */}
        {analytics && analytics.charts.userActivity.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">User Activity Overview</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Most active users in selected period</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analytics.charts.userActivity.slice(0, 10).map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-[#E39A2E]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E39A2E] to-[#d18a1f] flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {user.totalDays} days • {user.totalHours.toFixed(1)}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.lateCount > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                        {user.lateCount} late
                      </span>
                    )}
                    {user.earlyCount > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                        {user.earlyCount} early
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
              <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#E39A2E]/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
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
    </div>
  );
}
