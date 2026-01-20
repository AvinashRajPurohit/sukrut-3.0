'use client';

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

/**
 * Hook to get time until daily logout
 * @returns {object} Object with timeUntilLogout and isPastLogoutTime
 */
export function useDailyLogout() {
  const [timeUntilLogout, setTimeUntilLogout] = useState(null);
  const [isPastLogoutTime, setIsPastLogoutTime] = useState(false);

  useEffect(() => {
    // Get logout time from API or use default
    const logoutTime = '12:00'; // Will be fetched from server or env
    
    const getUserTimezone = () => {
      if (typeof window !== 'undefined') {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      }
      return 'UTC';
    };

    const updateTime = () => {
      const tz = getUserTimezone();
      const [hours, minutes] = logoutTime.split(':').map(Number);
      const now = moment.tz(tz);
      const todayLogout = moment.tz(tz).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
      
      // If logout time has passed today, calculate for tomorrow
      let logoutMoment = todayLogout;
      const isPast = now.isAfter(todayLogout);
      if (isPast) {
        logoutMoment = todayLogout.add(1, 'day');
      }
      
      const diff = moment.duration(logoutMoment.diff(now));
      
      const timeInfo = {
        hours: Math.floor(diff.asHours()),
        minutes: diff.minutes(),
        seconds: diff.seconds(),
        totalSeconds: Math.floor(diff.asSeconds()),
        isPast
      };
      
      setTimeUntilLogout(timeInfo);
      setIsPastLogoutTime(isPast);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeUntilLogout = () => {
    if (!timeUntilLogout) return '--:--:--';
    
    if (timeUntilLogout.isPast) {
      return 'Session expired';
    }

    const hours = String(timeUntilLogout.hours).padStart(2, '0');
    const mins = String(timeUntilLogout.minutes).padStart(2, '0');
    const secs = String(timeUntilLogout.seconds).padStart(2, '0');
    
    return `${hours}:${mins}:${secs}`;
  };

  return {
    timeUntilLogout,
    isPastLogoutTime,
    formatTimeUntilLogout,
    hours: timeUntilLogout?.hours || 0,
    minutes: timeUntilLogout?.minutes || 0,
    seconds: timeUntilLogout?.seconds || 0
  };
}
