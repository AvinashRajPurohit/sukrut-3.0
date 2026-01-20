import jwt from 'jsonwebtoken';
import { getNextLogoutTime, hasPassedLogoutTime } from '@/lib/utils/timezone';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// Daily logout time: configurable from .env (default: 12:00 PM)
// Format: 'HH:mm' (e.g., '12:00', '14:30')
const DAILY_LOGOUT_TIME = process.env.DAILY_LOGOUT_TIME || '12:00';

// Access token: configurable from .env (default: 15 minutes)
// Format: '15m', '1h', '30m', etc.
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';

// Refresh token: configurable from .env (default: 24 hours)
// Format: '24h', '1d', '7d', etc.
// Note: Actual expiration will be capped at daily logout time
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '24h';

/**
 * Convert JWT expiration string to seconds for cookie maxAge
 * Supports formats: '15m', '1h', '24h', '1d', '7d', etc.
 */
export function expirationToSeconds(expiration) {
  const match = expiration.match(/^(\d+)([smhd])$/);
  if (!match) {
    // Default to 15 minutes if invalid format
    return 15 * 60;
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 15 * 60; // Default to 15 minutes
  }
}

/**
 * Get expiration date from expiration string
 * For refresh tokens, this will be capped at the daily logout time
 */
export function getExpirationDate(expiration, isRefreshToken = false) {
  const seconds = expirationToSeconds(expiration);
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  
  // For refresh tokens, ensure they expire at daily logout time, not later
  if (isRefreshToken) {
    const nextLogoutTime = getNextLogoutTime(DAILY_LOGOUT_TIME);
    // If calculated expiration is after logout time, cap it at logout time
    if (date > nextLogoutTime) {
      return nextLogoutTime;
    }
  }
  
  return date;
}

/**
 * Check if tokens should be invalidated due to daily logout time
 */
export function shouldLogoutDueToDailyTime() {
  return hasPassedLogoutTime(DAILY_LOGOUT_TIME);
}

/**
 * Get the next daily logout time
 */
export function getDailyLogoutTime() {
  return getNextLogoutTime(DAILY_LOGOUT_TIME);
}

export function generateAccessToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(payload) {
  // Calculate expiration: min of REFRESH_TOKEN_EXPIRY or time until daily logout
  const nextLogoutTime = getNextLogoutTime(DAILY_LOGOUT_TIME);
  const maxExpiry = expirationToSeconds(REFRESH_TOKEN_EXPIRY);
  const logoutTimeSeconds = Math.floor((nextLogoutTime.getTime() - Date.now()) / 1000);
  
  // Use the shorter of the two expiration times
  const expiresInSeconds = Math.min(maxExpiry, logoutTimeSeconds);
  
  // Convert back to JWT format (e.g., '15m', '1h')
  let expiresIn;
  if (expiresInSeconds < 60) {
    expiresIn = `${expiresInSeconds}s`;
  } else if (expiresInSeconds < 3600) {
    expiresIn = `${Math.floor(expiresInSeconds / 60)}m`;
  } else if (expiresInSeconds < 86400) {
    expiresIn = `${Math.floor(expiresInSeconds / 3600)}h`;
  } else {
    expiresIn = `${Math.floor(expiresInSeconds / 86400)}d`;
  }
  
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      type: 'refresh',
      dailyLogoutTime: DAILY_LOGOUT_TIME // Store logout time in token for validation
    },
    JWT_REFRESH_SECRET,
    { expiresIn }
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

export { 
  ACCESS_TOKEN_EXPIRY, 
  REFRESH_TOKEN_EXPIRY,
  DAILY_LOGOUT_TIME,
  expirationToSeconds,
  getExpirationDate,
  shouldLogoutDueToDailyTime,
  getDailyLogoutTime
};
