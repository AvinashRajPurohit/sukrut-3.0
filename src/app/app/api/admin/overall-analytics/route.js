import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import User from '@/lib/db/models/User';
import { requireAdmin } from '@/lib/auth/middleware';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format, eachDayOfInterval } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let chartStartDate, chartEndDate;
    const now = new Date();

    switch (period) {
      case 'today':
        chartStartDate = startOfDay(now);
        chartEndDate = endOfDay(now);
        break;
      case 'week':
        chartStartDate = startOfWeek(now, { weekStartsOn: 1 });
        chartEndDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        chartStartDate = startOfMonth(now);
        chartEndDate = endOfMonth(now);
        break;
      case 'custom':
        if (startDateParam && endDateParam) {
          chartStartDate = startOfDay(new Date(startDateParam));
          chartEndDate = endOfDay(new Date(endDateParam));
        } else {
          chartStartDate = startOfMonth(now);
          chartEndDate = endOfMonth(now);
        }
        break;
      default:
        chartStartDate = startOfMonth(now);
        chartEndDate = endOfMonth(now);
    }

    const chartDays = eachDayOfInterval({ start: chartStartDate, end: chartEndDate });
    
    // Limit data points based on period - allow more for month view
    let maxDataPoints;
    switch (period) {
      case 'today':
        maxDataPoints = 1; // Just today
        break;
      case 'week':
        maxDataPoints = 7; // All 7 days of the week
        break;
      case 'month':
        maxDataPoints = 31; // All days in a month
        break;
      case 'custom':
        // For custom ranges, allow up to 60 days, then sample
        maxDataPoints = Math.min(chartDays.length, 60);
        break;
      default:
        maxDataPoints = 31;
    }
    
    let sampledDays = chartDays;
    if (chartDays.length > maxDataPoints) {
      const step = Math.ceil(chartDays.length / maxDataPoints);
      sampledDays = chartDays.filter((_, index) => index % step === 0 || index === chartDays.length - 1);
    }

    // Get data for last 30 days
    const [attendanceRecords, leaveRequests, users] = await Promise.all([
      AttendanceRecord.find({
        date: { $gte: chartStartDate, $lte: chartEndDate }
      }).lean(),
      LeaveRequest.find({
        createdAt: { $gte: chartStartDate, $lte: chartEndDate }
      }).lean(),
      User.find({ isActive: true }).select('name email createdAt').lean()
    ]);

    // 1. Active Users (users who punched in each day)
    const activeUsersData = sampledDays.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const dayRecords = attendanceRecords.filter(r => {
        const recordDate = r.date instanceof Date ? r.date : new Date(r.date);
        const recordDateOnly = startOfDay(recordDate);
        return recordDateOnly.getTime() === dayStart.getTime();
      });
      const uniqueUsers = new Set(dayRecords.map(r => {
        // userId is an ObjectId when using .lean(), convert to string
        const userId = r.userId;
        return userId ? (userId.toString ? userId.toString() : String(userId)) : null;
      }).filter(Boolean));
      // Format: Week view = day name, Short = MMM dd, Month = day number, Custom = MMM d (with month)
      let dateFormat;
      if (chartDays.length <= 7) {
        dateFormat = 'EEE'; // Mon, Tue, etc.
      } else if (chartDays.length <= 14) {
        dateFormat = 'MMM dd'; // Jan 15
      } else if (period === 'custom') {
        dateFormat = 'MMM d'; // Jan 15 (with month name)
      } else {
        dateFormat = 'd'; // Just day number for month view
      }
      return {
        date: format(day, dateFormat),
        count: uniqueUsers.size
      };
    });

    // 2. Leave Requests Trend (by status)
    const leaveTrendData = sampledDays.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const dayLeaves = leaveRequests.filter(l => {
        const created = new Date(l.createdAt);
        return created >= dayStart && created <= dayEnd;
      });
      let dateFormat;
      if (chartDays.length <= 7) {
        dateFormat = 'EEE';
      } else if (chartDays.length <= 14) {
        dateFormat = 'MMM dd';
      } else if (period === 'custom') {
        dateFormat = 'MMM d';
      } else {
        dateFormat = 'd';
      }
      return {
        date: format(day, dateFormat),
        pending: dayLeaves.filter(l => l.status === 'pending').length,
        approved: dayLeaves.filter(l => l.status === 'approved').length,
        rejected: dayLeaves.filter(l => l.status === 'rejected').length
      };
    });

    // 3. Attendance Trend
    const attendanceTrendData = sampledDays.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const dayRecords = attendanceRecords.filter(r => {
        const recordDate = r.date instanceof Date ? r.date : new Date(r.date);
        const recordDateOnly = startOfDay(recordDate);
        return recordDateOnly.getTime() === dayStart.getTime();
      });
      let dateFormat;
      if (chartDays.length <= 7) {
        dateFormat = 'EEE';
      } else if (chartDays.length <= 14) {
        dateFormat = 'MMM dd';
      } else if (period === 'custom') {
        dateFormat = 'MMM d';
      } else {
        dateFormat = 'd';
      }
      return {
        date: format(day, dateFormat),
        count: dayRecords.length,
        completed: dayRecords.filter(r => r.punchOutTime).length,
        inProgress: dayRecords.filter(r => !r.punchOutTime).length
      };
    });

    // 4. Overall System Activity (combining attendance and leaves)
    const systemActivityData = sampledDays.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const attendanceCount = attendanceRecords.filter(r => {
        const recordDate = r.date instanceof Date ? r.date : new Date(r.date);
        const recordDateOnly = startOfDay(recordDate);
        return recordDateOnly.getTime() === dayStart.getTime();
      }).length;
      
      const leaveCount = leaveRequests.filter(l => {
        const created = new Date(l.createdAt);
        return created >= dayStart && created <= dayEnd;
      }).length;
      
      let dateFormat;
      if (chartDays.length <= 7) {
        dateFormat = 'EEE';
      } else if (chartDays.length <= 14) {
        dateFormat = 'MMM dd';
      } else if (period === 'custom') {
        dateFormat = 'MMM d';
      } else {
        dateFormat = 'd';
      }
      return {
        date: format(day, dateFormat),
        attendance: attendanceCount,
        leaves: leaveCount
      };
    });

    return NextResponse.json({
      success: true,
      charts: {
        activeUsers: activeUsersData,
        leaveTrend: leaveTrendData,
        attendanceTrend: attendanceTrendData,
        systemActivity: systemActivityData
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Overall analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
