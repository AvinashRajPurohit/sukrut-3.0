import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveConfig from '@/lib/db/models/LeaveConfig';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import { requireAuth } from '@/lib/auth/middleware';
import { getUsedLeaveCount, countWorkingDays } from '@/lib/utils/leave-validation';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth();

    // Get leave configuration
    let config = await LeaveConfig.findById('leaveConfig');
    if (!config) {
      config = await LeaveConfig.create({ _id: 'leaveConfig' });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate balances for each leave type
    const balances = {};

    // Helper function to get period dates
    const getPeriodDates = (period) => {
      if (period === 'yearly') {
        return {
          start: startOfDay(new Date(currentYear, 0, 1)),
          end: endOfDay(new Date(currentYear, 11, 31))
        };
      } else {
        return {
          start: startOfDay(new Date(currentYear, currentMonth, 1)),
          end: endOfDay(new Date(currentYear, currentMonth + 1, 0))
        };
      }
    };

    // Sick Leave
    if (config.sickLeave && config.sickLeave.limit > 0) {
      const period = getPeriodDates(config.sickLeave.period);
      const used = await getUsedLeaveCount(user.id, 'sick-leave', config.sickLeave.period, period.start, period.end);
      balances.sickLeave = {
        limit: config.sickLeave.limit,
        used: used,
        remaining: Math.max(0, config.sickLeave.limit - used),
        period: config.sickLeave.period,
        periodLabel: config.sickLeave.period === 'yearly' 
          ? `${currentYear}` 
          : `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`
      };
    }

    // Paid Leave
    if (config.paidLeave && config.paidLeave.limit > 0) {
      const period = getPeriodDates(config.paidLeave.period);
      const used = await getUsedLeaveCount(user.id, 'paid-leave', config.paidLeave.period, period.start, period.end);
      balances.paidLeave = {
        limit: config.paidLeave.limit,
        used: used,
        remaining: Math.max(0, config.paidLeave.limit - used),
        period: config.paidLeave.period,
        periodLabel: config.paidLeave.period === 'yearly' 
          ? `${currentYear}` 
          : `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`
      };
    }

    // Work From Home
    if (config.workFromHome && config.workFromHome.limit > 0) {
      const period = getPeriodDates(config.workFromHome.period);
      const used = await getUsedLeaveCount(user.id, 'work-from-home', config.workFromHome.period, period.start, period.end);
      balances.workFromHome = {
        limit: config.workFromHome.limit,
        used: used,
        remaining: Math.max(0, config.workFromHome.limit - used),
        period: config.workFromHome.period,
        periodLabel: config.workFromHome.period === 'yearly' 
          ? `${currentYear}` 
          : `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`
      };
    }


    return NextResponse.json({
      success: true,
      balances
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get leave balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
