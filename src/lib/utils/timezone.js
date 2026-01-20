import moment from 'moment-timezone';

/**
 * Get user's timezone from browser or default to UTC
 */
export function getUserTimezone() {
  if (typeof window !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }
  return 'UTC';
}

/**
 * Convert UTC date to user's timezone for display
 * @param {Date|string} utcDate - Date in UTC
 * @param {string} format - Moment format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @param {string} timezone - User's timezone (default: auto-detect)
 * @returns {string} Formatted date in user's timezone
 */
export function formatToUserTimezone(utcDate, format = 'YYYY-MM-DD HH:mm:ss', timezone = null) {
  const tz = timezone || getUserTimezone();
  return moment.utc(utcDate).tz(tz).format(format);
}

/**
 * Convert user's local date to UTC for storage
 * @param {Date|string} localDate - Date in user's local timezone
 * @param {string} timezone - User's timezone (default: auto-detect)
 * @returns {Date} Date in UTC
 */
export function convertToUTC(localDate, timezone = null) {
  const tz = timezone || getUserTimezone();
  return moment.tz(localDate, tz).utc().toDate();
}

/**
 * Get current time in UTC
 * @returns {Date} Current date/time in UTC
 */
export function getCurrentUTC() {
  return moment.utc().toDate();
}

/**
 * Get current time in user's timezone
 * @param {string} timezone - User's timezone (default: auto-detect)
 * @returns {moment.Moment} Current moment in user's timezone
 */
export function getCurrentUserTime(timezone = null) {
  const tz = timezone || getUserTimezone();
  return moment.tz(tz);
}

/**
 * Check if current UTC time has passed the daily logout time
 * @param {string} logoutTime - Time in format 'HH:mm' (e.g., '12:00')
 * @param {string} timezone - Timezone to interpret logoutTime (default: UTC)
 * @returns {boolean} True if logout time has passed today
 */
export function hasPassedLogoutTime(logoutTime = '12:00', timezone = 'UTC') {
  const [hours, minutes] = logoutTime.split(':').map(Number);
  const now = moment.utc();
  const todayLogout = moment.utc().set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
  
  // If logout time hasn't passed today, check if it's tomorrow
  if (now.isAfter(todayLogout)) {
    return true;
  }
  
  return false;
}

/**
 * Get next logout time in UTC
 * @param {string} logoutTime - Time in format 'HH:mm' (e.g., '12:00')
 * @param {string} timezone - Timezone to interpret logoutTime (default: UTC)
 * @returns {Date} Next logout time in UTC
 */
export function getNextLogoutTime(logoutTime = '12:00', timezone = 'UTC') {
  const [hours, minutes] = logoutTime.split(':').map(Number);
  const now = moment.utc();
  const todayLogout = moment.utc().set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
  
  // If logout time has passed today, set for tomorrow
  if (now.isAfter(todayLogout)) {
    return todayLogout.add(1, 'day').toDate();
  }
  
  return todayLogout.toDate();
}

/**
 * Get time until logout in user's timezone
 * @param {string} logoutTime - Time in format 'HH:mm' (e.g., '12:00')
 * @param {string} timezone - User's timezone (default: auto-detect)
 * @returns {object} Object with hours, minutes, seconds until logout
 */
export function getTimeUntilLogout(logoutTime = '12:00', timezone = null) {
  const tz = timezone || getUserTimezone();
  const [hours, minutes] = logoutTime.split(':').map(Number);
  const now = moment.tz(tz);
  const todayLogout = moment.tz(tz).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
  
  // If logout time has passed today, calculate for tomorrow
  let logoutMoment = todayLogout;
  if (now.isAfter(todayLogout)) {
    logoutMoment = todayLogout.add(1, 'day');
  }
  
  const diff = moment.duration(logoutMoment.diff(now));
  
  return {
    hours: Math.floor(diff.asHours()),
    minutes: diff.minutes(),
    seconds: diff.seconds(),
    totalSeconds: Math.floor(diff.asSeconds()),
    isPast: now.isAfter(todayLogout)
  };
}

/**
 * Format date for display in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'MMM d, yyyy HH:mm')
 * @param {string} timezone - User's timezone (default: auto-detect)
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'MMM d, yyyy HH:mm', timezone = null) {
  const tz = timezone || getUserTimezone();
  return moment.utc(date).tz(tz).format(format);
}

/**
 * Format time for display in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'HH:mm:ss')
 * @param {string} timezone - User's timezone (default: auto-detect)
 * @returns {string} Formatted time string
 */
export function formatTime(date, format = 'HH:mm:ss', timezone = null) {
  const tz = timezone || getUserTimezone();
  return moment.utc(date).tz(tz).format(format);
}
