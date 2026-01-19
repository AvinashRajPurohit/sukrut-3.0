import { startOfDay, endOfDay, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import Holiday from '@/lib/db/models/Holiday';
import WeekendConfig from '@/lib/db/models/WeekendConfig';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import LeaveConfig from '@/lib/db/models/LeaveConfig';

/**
 * Count working days excluding weekends and holidays
 */
export async function countWorkingDays(startDate, endDate) {
  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));
  
  // Get weekend configuration
  const weekendConfig = await WeekendConfig.findById('weekendConfig');
  const weekendDays = weekendConfig ? weekendConfig.weekendDays : [0, 6];
  
  // Get all holidays in the date range
  const holidays = await Holiday.find({
    $or: [
      { date: { $gte: start, $lte: end } },
      { isRecurring: true }
    ]
  });
  
  // Get all days in the range
  const days = eachDayOfInterval({ start, end });
  
  let workingDays = 0;
  
  for (const day of days) {
    const dayOfWeek = getDay(day);
    
    // Skip weekends
    if (weekendDays.includes(dayOfWeek)) {
      continue;
    }
    
    // Check if it's a holiday
    const isHoliday = holidays.some(holiday => {
      if (holiday.isRecurring) {
        // Check if recurring holiday matches this day
        const holidayDate = new Date(holiday.date);
        return holidayDate.getMonth() === day.getMonth() && 
               holidayDate.getDate() === day.getDate();
      }
      return isSameDay(new Date(holiday.date), day);
    });
    
    if (!isHoliday) {
      workingDays++;
    }
  }
  
  return workingDays;
}

/**
 * Get used leave count for a user based on leave type and period
 */
export async function getUsedLeaveCount(userId, leaveType, period, periodStart, periodEnd) {
  // Find leaves that overlap with the period
  const approvedLeaves = await LeaveRequest.find({
    userId,
    leaveType,
    status: 'approved',
    $or: [
      // Leave starts within period
      { startDate: { $gte: periodStart, $lte: periodEnd } },
      // Leave ends within period
      { endDate: { $gte: periodStart, $lte: periodEnd } },
      // Leave spans the entire period
      { startDate: { $lte: periodStart }, endDate: { $gte: periodEnd } }
    ]
  });
  
  let totalDays = 0;
  
  for (const leave of approvedLeaves) {
    // Calculate the overlap between leave period and tracking period
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    
    // Get the actual date range to count (overlap)
    const overlapStart = leaveStart > periodStart ? leaveStart : periodStart;
    const overlapEnd = leaveEnd < periodEnd ? leaveEnd : periodEnd;
    
    if (leave.type === 'full-day') {
      const days = await countWorkingDays(overlapStart, overlapEnd);
      totalDays += days;
    } else {
      // Half day counts as 0.5
      totalDays += 0.5;
    }
  }
  
  return totalDays;
}

/**
 * Check if user can apply for leave based on configured limits
 */
export async function canApplyLeave(userId, leaveType, startDate, endDate, type) {
  // Get leave configuration
  let config = await LeaveConfig.findById('leaveConfig');
  if (!config) {
    config = await LeaveConfig.create({ _id: 'leaveConfig' });
  }
  
  // Map leave type to config property
  const leaveTypeMap = {
    'sick-leave': 'sickLeave',
    'paid-leave': 'paidLeave',
    'unpaid-leave': 'unpaidLeave',
    'work-from-home': 'workFromHome'
  };
  
  const configKey = leaveTypeMap[leaveType];
  if (!configKey) {
    return { 
      canApply: false, 
      reason: `Invalid leave type: ${leaveType}` 
    };
  }
  
  // Unpaid leaves have no limit - always allow
  if (leaveType === 'unpaid-leave') {
    const requestedDays = type === 'full-day' 
      ? await countWorkingDays(startDate, endDate) 
      : 0.5;
    
    return {
      canApply: true,
      availableDays: null, // No limit
      requestedDays: requestedDays
    };
  }
  
  const leaveTypeConfig = config[configKey];
  if (!leaveTypeConfig || leaveTypeConfig.limit === 0) {
    return { 
      canApply: false, 
      reason: `${leaveType.replace('-', ' ')} is not configured or has no limit set` 
    };
  }
  
  // Determine period start and end
  const now = new Date();
  let periodStart, periodEnd;
  
  if (leaveTypeConfig.period === 'yearly') {
    periodStart = new Date(now.getFullYear(), 0, 1);
    periodEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  } else {
    // Monthly
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }
  
  // Get used leave count
  const usedCount = await getUsedLeaveCount(userId, leaveType, leaveTypeConfig.period, periodStart, periodEnd);
  
  // Calculate requested days
  let requestedDays = 0;
  if (type === 'full-day') {
    requestedDays = await countWorkingDays(startDate, endDate);
  } else {
    requestedDays = 0.5; // Half day
  }
  
  // Check if user has enough leave balance
  const availableDays = leaveTypeConfig.limit - usedCount;
  
  if (requestedDays > availableDays) {
    return {
      canApply: false,
      reason: `Insufficient ${leaveType.replace('-', ' ')} balance. Available: ${availableDays.toFixed(1)} days, Requested: ${requestedDays.toFixed(1)} days`
    };
  }
  
  return {
    canApply: true,
    availableDays: availableDays,
    requestedDays: requestedDays
  };
}
