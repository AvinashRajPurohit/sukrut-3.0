import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// Access token: configurable from .env (default: 15 minutes)
// Format: '15m', '1h', '30m', etc.
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';

// Refresh token: configurable from .env (default: 24 hours)
// Format: '24h', '1d', '7d', etc.
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
 */
export function getExpirationDate(expiration) {
  const seconds = expirationToSeconds(expiration);
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return date;
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
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
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
  expirationToSeconds,
  getExpirationDate
};
