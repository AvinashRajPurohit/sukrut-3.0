import { cookies } from 'next/headers';
import { verifyAccessToken } from './tokens';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';

/**
 * Get authenticated user from access token
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded || decoded.type !== 'access') {
      return null;
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      designation: user.designation || null,
      role: user.role
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }
  return user;
}
