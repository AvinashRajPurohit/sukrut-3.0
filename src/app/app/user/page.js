'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PunchCard from '@/components/user/PunchCard';
import Card from '@/components/shared/Card';
import BarChart from '@/components/shared/BarChart';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Clock, Calendar, CheckCircle2, FileText, ArrowRight, BarChart3 } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/app/api/auth/me').then(r => r.json()),
      fetch('/app/api/user/reports?startDate=' + new Date(new Date().setDate(1)).toISOString().split('T')[0]).then(r => r.json())
    ]).then(([userData, reportsData]) => {
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
      } else {
        router.push('/app/login');
      }
    }).catch(() => router.push('/app/login'))
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Punch Card - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <PunchCard />
          
          {/* Weekly Activity Chart */}
          {recentActivity.length > 0 && (
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* This Month Stats */}
          <Card>
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

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Card>
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
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Access</h2>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
