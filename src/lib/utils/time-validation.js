import { parse, format, isBefore, isAfter, addMinutes, subMinutes } from 'date-fns';

/**
 * Parse time string (HH:mm:ss) to Date object for today
 */
export function parseTimeToDate(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today;
}

/**
 * Check if current time is late (after start time + threshold)
 */
export function isLatePunchIn(currentTime, startTime, thresholdMinutes) {
  const startDateTime = parseTimeToDate(startTime);
  const thresholdDateTime = addMinutes(startDateTime, thresholdMinutes);
  return isAfter(currentTime, thresholdDateTime);
}

/**
 * Check if current time is early (before end time - threshold)
 */
export function isEarlyPunchOut(currentTime, endTime, thresholdMinutes) {
  const endDateTime = parseTimeToDate(endTime);
  const thresholdDateTime = subMinutes(endDateTime, thresholdMinutes);
  return isBefore(currentTime, thresholdDateTime);
}

/**
 * Format time for display
 */
export function formatTime(date) {
  return format(date, 'HH:mm:ss');
}

/**
 * Format date for display
 */
export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Calculate hours worked
 */
export function calculateHoursWorked(punchInTime, punchOutTime) {
  if (!punchOutTime) return null;
  
  const diffMs = punchOutTime.getTime() - punchInTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
}
