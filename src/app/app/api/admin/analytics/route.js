import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import User from '@/lib/db/models/User';
import { requireAdmin } from '@/lib/auth/middleware';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format, eachDayOfInterval } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate, endDate;
    const now = new Date();

    switch (period) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'custom':
        if (startDateParam && endDateParam) {
          startDate = startOfDay(new Date(startDateParam));
          endDate = endOfDay(new Date(endDateParam));
        } else {
          startDate = startOfDay(now);
          endDate = endOfDay(now);
        }
        break;
      default:
        startDate = startOfDay(now);
        endDate = endOfDay(now);
    }

    const records = await AttendanceRecord.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    const totalRecords = records.length;
    const completedRecords = records.filter(r => r.punchOutTime).length;
    const lateArrivals = records.filter(r => r.punchInLateReason).length;
    const earlyLeaves = records.filter(r => r.punchOutEarlyReason).length;
    
    const totalHours = records.reduce((sum, r) => {
      if (r.punchOutTime) {
        const hours = (new Date(r.punchOutTime) - new Date(r.punchInTime)) / (1000 * 60 * 60);
        return sum + hours;
      }
      return sum;
    }, 0);

    const daysToShow = period === 'today' ? 7 : period === 'week' ? 7 : period === 'month' ? 30 : 
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const chartStartDate = subDays(endDate, daysToShow - 1);
    const chartDays = eachDayOfInterval({ start: chartStartDate, end: endDate });

    const dailyData = await Promise.all(
      chartDays.map(async (day) => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        const dayRecords = await AttendanceRecord.countDocuments({
          date: { $gte: dayStart, $lte: dayEnd }
        });
        const dayCompleted = await AttendanceRecord.countDocuments({
          date: { $gte: dayStart, $lte: dayEnd },
          punchOutTime: { $exists: true }
        });
        return {
          date: format(day, 'MMM d'),
          fullDate: format(day, 'yyyy-MM-dd'),
          count: dayRecords,
          completed: dayCompleted
        };
      })
    );

    const userActivity = {};
    records.forEach(record => {
      const userId = record.userId?._id?.toString() || 'unknown';
      const userName = record.userId?.name || 'Unknown';
      if (!userActivity[userId]) {
        userActivity[userId] = {
          name: userName,
          totalDays: 0,
          totalHours: 0,
          lateCount: 0,
          earlyCount: 0
        };
      }
      userActivity[userId].totalDays++;
      if (record.punchOutTime) {
        const hours = (new Date(record.punchOutTime) - new Date(record.punchInTime)) / (1000 * 60 * 60);
        userActivity[userId].totalHours += hours;
      }
      if (record.punchInLateReason) userActivity[userId].lateCount++;
      if (record.punchOutEarlyReason) userActivity[userId].earlyCount++;
    });

    const userActivityArray = Object.values(userActivity)
      .sort((a, b) => b.totalDays - a.totalDays);

    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }));

    records.forEach(record => {
      if (record.punchInTime) {
        const hour = new Date(record.punchInTime).getHours();
        hourlyDistribution[hour].count++;
      }
    });

    const weeklyData = [];
    const weekStart = startOfWeek(endDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const count = await AttendanceRecord.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd }
      });
      weeklyData.push({
        day: format(day, 'EEE'),
        count
      });
    }

    const statusDistribution = {
      completed: completedRecords,
      inProgress: totalRecords - completedRecords,
      late: lateArrivals,
      early: earlyLeaves
    };

    const uniqueUsers = new Set(records.map(r => r.userId?._id?.toString()).filter(Boolean)).size;

    return NextResponse.json({
      success: true,
      period,
      dateRange: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
      },
      stats: {
        totalRecords,
        completedRecords,
        lateArrivals,
        earlyLeaves,
        totalHours: totalHours.toFixed(2),
        averageHours: completedRecords > 0 ? (totalHours / completedRecords).toFixed(2) : 0,
        uniqueUsers,
        completionRate: totalRecords > 0 ? ((completedRecords / totalRecords) * 100).toFixed(1) : 0
      },
      charts: {
        dailyAttendance: dailyData,
        weeklyAttendance: weeklyData,
        hourlyDistribution,
        userActivity: userActivityArray,
        statusDistribution
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
