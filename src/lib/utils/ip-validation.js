import connectDB from '@/lib/db/connection';
import AllowedIP from '@/lib/db/models/AllowedIP';

/**
 * Extract client IP from request headers
 * Handles proxies, load balancers, and direct connections
 * Works with Next.js App Router Request API
 */
export function getClientIP(request) {
  // Next.js App Router uses Web API Request object
  // Headers are accessed via request.headers.get()
  
  // Check for forwarded IP (from proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ip = forwarded.split(',')[0].trim();
    // Handle IPv6 wrapped in brackets
    return ip.replace(/^\[|\]$/g, '');
  }

  // Check for real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim().replace(/^\[|\]$/g, '');
  }

  // Check for CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP.trim().replace(/^\[|\]$/g, '');
  }

  // For development/localhost, return localhost IPs
  // This allows local development without IP restrictions
  const host = request.headers.get('host');
  if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
    return '127.0.0.1';
  }

  // Last resort - return unknown (will need to be handled)
  return 'unknown';
}

/**
 * Check if IP is in the allowed IPs list
 */
export async function isIPAllowed(ip) {
  try {
    await connectDB();
    
    const allowedIP = await AllowedIP.findOne({
      ipAddress: ip,
      isActive: true
    });

    return !!allowedIP;
  } catch (error) {
    console.error('Error checking IP:', error);
    return false;
  }
}

/**
 * Validate IP for authentication
 * Returns { valid: boolean, message?: string, ip?: string }
 */
export async function validateIP(request) {
  const clientIP = getClientIP(request);
  
  // Check if there are any IPs configured
  await connectDB();
  const ipCount = await AllowedIP.countDocuments({ isActive: true });
  
  // If no IPs configured yet, allow all IPs for initial setup
  // This allows admin to login and configure IPs
  if (ipCount === 0) {
    return {
      valid: true,
      ip: clientIP || 'unknown',
      message: 'Initial setup: IP restrictions not configured yet'
    };
  }
  
  if (clientIP === 'unknown') {
    // Log for debugging
    console.warn('Unable to determine IP. Headers:', {
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-real-ip': request.headers.get('x-real-ip'),
      'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
      'host': request.headers.get('host')
    });
    
    return {
      valid: false,
      message: 'Unable to determine your IP address. Please contact administrator.'
    };
  }

  const isAllowed = await isIPAllowed(clientIP);
  
  if (!isAllowed) {
    return {
      valid: false,
      message: `Access denied. Your IP (${clientIP}) is not in the allowed list. Please contact administrator.`
    };
  }

  return {
    valid: true,
    ip: clientIP
  };
}
