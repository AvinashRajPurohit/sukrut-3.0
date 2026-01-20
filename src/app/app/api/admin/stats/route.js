import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import AllowedIP from '@/lib/db/models/AllowedIP';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import Holiday from '@/lib/db/models/Holiday';
import Notification from '@/lib/db/models/Notification';
import { requireAdmin } from '@/lib/auth/middleware';
import { startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const today = startOfDay(new Date());
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const yearStart = startOfYear(new Date());
    const yearEnd = endOfYear(new Date());

    const [
      totalUsers,
      activeUsers,
      totalIPs,
      activeIPs,
      todayAttendance,
      thisWeekAttendance,
      thisMonthAttendance,
      totalRecords,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      totalLeaves,
      totalHolidays,
      upcomingHolidays,
      unreadNotifications,
      totalNotifications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      AllowedIP.countDocuments(),
      AllowedIP.countDocuments({ isActive: true }),
      AttendanceRecord.countDocuments({ date: today }),
      AttendanceRecord.countDocuments({ date: { $gte: weekStart, $lte: weekEnd } }),
      AttendanceRecord.countDocuments({ date: { $gte: monthStart, $lte: monthEnd } }),
      AttendanceRecord.countDocuments(),
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      LeaveRequest.countDocuments({ status: 'rejected' }),
      LeaveRequest.countDocuments(),
      Holiday.countDocuments(),
      Holiday.countDocuments({ date: { $gte: today } }),
      Notification.countDocuments({ userId: null, isRead: false }),
      Notification.countDocuments({ userId: null })
    ]);

    // Get current month leave stats
    const currentMonthLeaves = await LeaveRequest.countDocuments({
      startDate: { $gte: monthStart, $lte: monthEnd }
    });

    return NextResponse.json({
      success: true,
      // User stats
      totalUsers,
      activeUsers,
      // IP stats
      totalIPs,
      activeIPs,
      // Attendance stats
      todayAttendance,
      thisWeekAttendance,
      thisMonthAttendance,
      totalRecords,
      // Leave stats
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      totalLeaves,
      currentMonthLeaves,
      // Holiday stats
      totalHolidays,
      upcomingHolidays,
      // Notification stats
      unreadNotifications,
      totalNotifications
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
