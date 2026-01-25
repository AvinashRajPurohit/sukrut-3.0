import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/connection';
import RefreshToken from '@/lib/db/models/RefreshToken';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, REFRESH_TOKEN_EXPIRY, ACCESS_TOKEN_EXPIRY, expirationToSeconds, getExpirationDate } from '@/lib/auth/tokens';
import { getClientIP } from '@/lib/utils/ip-validation';

export async function POST(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh') {
      // Invalid token, clear cookies
      const response = NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Check if token exists in database
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId
    });

    if (!storedToken) {
      // Token not found or revoked, clear cookies
      const response = NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Check if token is expired (should be handled by TTL, but double check)
    if (new Date() > storedToken.expiresAt) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      const response = NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Token rotation: Generate new tokens
    const tokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Get client info
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Calculate expiry date from REFRESH_TOKEN_EXPIRY (token rotation)
    const expiresAt = getExpirationDate(REFRESH_TOKEN_EXPIRY);

    // Delete old refresh token and create new one (token rotation)
    await RefreshToken.deleteOne({ _id: storedToken._id });
    await RefreshToken.create({
      userId: decoded.userId,
      token: newRefreshToken,
      expiresAt,
      ipAddress: clientIP,
      userAgent
    });

    // Set new tokens in cookies
    const response = NextResponse.json({
      success: true
    });

    // Set access token cookie (uses ACCESS_TOKEN_EXPIRY from .env)
    const accessTokenMaxAge = expirationToSeconds(ACCESS_TOKEN_EXPIRY);
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge
    });

    // Set refresh token cookie (uses REFRESH_TOKEN_EXPIRY from .env)
    const refreshTokenMaxAge = expirationToSeconds(REFRESH_TOKEN_EXPIRY);
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
