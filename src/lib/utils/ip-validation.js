import connectDB from '@/lib/db/connection';
import AllowedIP from '@/lib/db/models/AllowedIP';

/**
 * Normalize IP address - convert IPv6 localhost to IPv4 equivalent
 * This ensures consistent IP handling across IPv4 and IPv6
 */
export function normalizeIP(ip) {
  if (!ip) return ip;
  
  const trimmed = ip.trim().replace(/^\[|\]$/g, '');
  
  // Normalize IPv6 localhost to IPv4 equivalent
  if (trimmed === '::1' || trimmed === '::ffff:127.0.0.1' || trimmed === '0:0:0:0:0:0:0:1') {
    return '127.0.0.1';
  }
  
  return trimmed;
}

/**
 * Extract client IP from request headers
 * Handles proxies, load balancers, and direct connections
 * Works with Next.js App Router Request API
 * Prefers IPv4 over IPv6 when both are available
 */
export function getClientIP(request) {
  // Next.js App Router uses Web API Request object
  // Headers are accessed via request.headers.get()
  
  // Check for forwarded IP (from proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs
    const ips = forwarded.split(',').map(ip => normalizeIP(ip.trim()));
    
    // Prefer IPv4 over IPv6
    const ipv4 = ips.find(ip => {
      // Check if it's IPv4 (simple check: contains dots and no colons, or is IPv4-mapped IPv6)
      return ip && (ip.includes('.') && !ip.includes(':') || ip.startsWith('::ffff:'));
    });
    
    if (ipv4) {
      // Handle IPv4-mapped IPv6 addresses (::ffff:127.0.0.1 -> 127.0.0.1)
      if (ipv4.startsWith('::ffff:')) {
        return ipv4.replace('::ffff:', '');
      }
      return normalizeIP(ipv4);
    }
    
    // If no IPv4 found, use first IP (normalized)
    return normalizeIP(ips[0]);
  }

  // Check for real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return normalizeIP(realIP);
  }

  // Check for CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return normalizeIP(cfIP);
  }

  // Check for X-Client-IP header
  const clientIP = request.headers.get('x-client-ip');
  if (clientIP) {
    return normalizeIP(clientIP);
  }

  // For development/localhost, normalize to IPv4 localhost
  const host = request.headers.get('host');
  if (host && (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]'))) {
    return '127.0.0.1';
  }

  // Last resort - return unknown (will need to be handled)
  return 'unknown';
}

/**
 * Check if IP is in the allowed IPs list
 * Also checks for normalized versions (IPv6 localhost -> IPv4 localhost)
 */
export async function isIPAllowed(ip) {
  try {
    await connectDB();
    
    // Normalize the IP first
    const normalizedIP = normalizeIP(ip);
    
    // Check exact match
    let allowedIP = await AllowedIP.findOne({
      ipAddress: normalizedIP,
      isActive: true
    });

    if (allowedIP) {
      return true;
    }

    // Also check original IP in case it was stored differently
    if (normalizedIP !== ip) {
      allowedIP = await AllowedIP.findOne({
        ipAddress: ip,
        isActive: true
      });
      
      if (allowedIP) {
        return true;
      }
    }

    // Check for localhost variants (127.0.0.1, ::1, etc.)
    if (normalizedIP === '127.0.0.1' || ip === '::1' || ip === '0:0:0:0:0:0:0:1') {
      // Check if any localhost variant is allowed
      const localhostVariants = ['127.0.0.1', '::1', '0:0:0:0:0:0:0:1', '::ffff:127.0.0.1'];
      allowedIP = await AllowedIP.findOne({
        ipAddress: { $in: localhostVariants },
        isActive: true
      });
      
      if (allowedIP) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking IP:', error);
    return false;
  }
}

/**
 * Validate IP for authentication (login)
 * Returns { valid: boolean, message?: string, ip?: string }
 * Note: Login does NOT require IP validation - users can login from anywhere
 */
export async function validateIP(request) {
  const clientIP = getClientIP(request);
  
  // For login, we just return the IP without validation
  // This allows users to login from anywhere
  return {
    valid: true,
    ip: clientIP || 'unknown'
  };
}

/**
 * Validate IP for punch in/out operations
 * Returns { valid: boolean, message?: string, ip?: string }
 * This is stricter - only allows punch in/out from configured IPs
 */
export async function validateIPForPunch(request) {
  const clientIP = getClientIP(request);
  const normalizedIP = normalizeIP(clientIP);
  
  // Check if there are any IPs configured
  await connectDB();
  const ipCount = await AllowedIP.countDocuments({ isActive: true });
  
  // If no IPs configured yet, allow all IPs for initial setup
  // This allows admin to configure IPs before restricting punch in/out
  if (ipCount === 0) {
    return {
      valid: true,
      ip: normalizedIP || clientIP || 'unknown',
      message: 'Initial setup: IP restrictions not configured yet. Please configure allowed IPs in admin settings.'
    };
  }
  
  if (clientIP === 'unknown' || !normalizedIP) {
    // Log for debugging
    console.warn('Unable to determine IP for punch operation. Headers:', {
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-real-ip': request.headers.get('x-real-ip'),
      'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
      'x-client-ip': request.headers.get('x-client-ip'),
      'host': request.headers.get('host'),
      'detected-ip': clientIP,
      'normalized-ip': normalizedIP
    });
    
    return {
      valid: false,
      message: 'Unable to determine your IP address. Punch in/out requires a valid IP address. Please contact administrator if you believe this is an error.'
    };
  }

  // Check both normalized and original IP
  const isAllowed = await isIPAllowed(normalizedIP);
  
  if (!isAllowed) {
    // Get list of allowed IPs for better error message (optional, for debugging)
    const allowedIPs = await AllowedIP.find({ isActive: true }).select('ipAddress -_id').lean();
    const allowedIPList = allowedIPs.map(ip => ip.ipAddress).join(', ');
    
    console.log('IP validation failed:', {
      detectedIP: clientIP,
      normalizedIP: normalizedIP,
      allowedIPs: allowedIPList
    });
    
    return {
      valid: false,
      message: `Punch in/out is only allowed from configured IP addresses. Your current IP (${normalizedIP}${normalizedIP !== clientIP ? `, detected as ${clientIP}` : ''}) is not in the allowed list. Please contact your administrator to add your IP address, or use a device connected to an allowed network.`
    };
  }

  return {
    valid: true,
    ip: normalizedIP
  };
}
