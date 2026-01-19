import Holiday from '@/lib/db/models/Holiday';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import WeekendConfig from '@/lib/db/models/WeekendConfig';
import { startOfDay, endOfDay, getDay, isSameDay } from 'date-fns';

/**
 * Check if a date is a holiday
 */
export async function isHoliday(date) {
  const dateStart = startOfDay(date);
  const holidays = await Holiday.find({
    date: dateStart
  });
  return holidays.length > 0;
}

/**
 * Check if a date is a weekend based on configuration
 */
export async function isWeekend(date) {
  const config = await WeekendConfig.findById('config');
  const weekendDays = config?.weekendDays || [0, 6]; // Default: Sunday and Saturday
  const dayOfWeek = getDay(date);
  return weekendDays.includes(dayOfWeek);
}

/**
 * Check if user has an approved leave for a date
 */
export async function hasApprovedLeave(userId, date) {
  const dateStart = startOfDay(date);
  const dateEnd = endOfDay(date);
  
  const leave = await LeaveRequest.findOne({
    userId,
    status: 'approved',
    startDate: { $lte: dateEnd },
    endDate: { $gte: dateStart }
  });

  return leave;
}

/**
 * Check if user can punch in/out on a given date
 * Returns { canPunch: boolean, reason: string }
 */
export async function canPunchOnDate(userId, date) {
  // Check if it's a holiday
  if (await isHoliday(date)) {
    const holidays = await Holiday.find({ date: startOfDay(date) });
    return {
      canPunch: false,
      reason: `Cannot punch in/out on holiday: ${holidays[0]?.name || 'Holiday'}`
    };
  }

  // Check if it's a weekend
  if (await isWeekend(date)) {
    return {
      canPunch: false,
      reason: 'Cannot punch in/out on weekends'
    };
  }

  // Check if user has approved leave
  const leave = await hasApprovedLeave(userId, date);
  if (leave) {
    if (leave.type === 'full-day') {
      return {
        canPunch: false,
        reason: 'You have an approved full-day leave for this date'
      };
    }
    // For half-day leaves, allow punching but inform user
    return {
      canPunch: true,
      reason: `You have an approved half-day leave (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`,
      isHalfDayLeave: true,
      halfDayType: leave.halfDayType
    };
  }

  return {
    canPunch: true,
    reason: null
  };
}
