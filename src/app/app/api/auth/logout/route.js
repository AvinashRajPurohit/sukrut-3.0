import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/connection';
import RefreshToken from '@/lib/db/models/RefreshToken';
import { verifyRefreshToken } from '@/lib/auth/tokens';

export async function POST(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // If refresh token exists, delete it from database
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded && decoded.userId) {
        await RefreshToken.deleteMany({ userId: decoded.userId });
      }
    }

    // Clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookies even if there's an error
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
}
