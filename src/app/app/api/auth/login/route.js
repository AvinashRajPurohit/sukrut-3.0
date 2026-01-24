import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import RefreshToken from '@/lib/db/models/RefreshToken';
import { hashPassword, comparePassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken, REFRESH_TOKEN_EXPIRY, expirationToSeconds, getExpirationDate } from '@/lib/auth/tokens';
import { getClientIP } from '@/lib/utils/ip-validation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Get client IP (for logging purposes only - login doesn't require IP validation)
    const clientIP = getClientIP(request);

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Get client info
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Calculate expiry date from REFRESH_TOKEN_EXPIRY
    const expiresAt = getExpirationDate(REFRESH_TOKEN_EXPIRY);

    // Store refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
      ipAddress: clientIP,
      userAgent
    });

    // Set HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Set access token cookie (uses ACCESS_TOKEN_EXPIRY from .env)
    const accessTokenMaxAge = expirationToSeconds(process.env.ACCESS_TOKEN_EXPIRY || '15m');
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge
    });

    // Set refresh token cookie (uses REFRESH_TOKEN_EXPIRY from .env)
    const refreshTokenMaxAge = expirationToSeconds(REFRESH_TOKEN_EXPIRY);
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
