import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAuth } from '@/lib/auth/middleware';
import { validateIPForPunch, getClientIP, normalizeIP } from '@/lib/utils/ip-validation';

/**
 * Check if user's current IP is allowed for punch in/out
 * This endpoint allows the frontend to check IP status before attempting punch operations
 */
export async function GET(request) {
  try {
    await connectDB();
    await requireAuth();

    // Validate IP for punch operations
    const ipValidation = await validateIPForPunch(request);
    const detectedIP = getClientIP(request);
    const normalizedIP = normalizeIP(detectedIP);

    return NextResponse.json(
      {
        success: true,
        isAllowed: ipValidation.valid,
        currentIP: normalizedIP || detectedIP,
        detectedIP: detectedIP,
        normalizedIP: normalizedIP,
        message: ipValidation.valid
          ? 'Your IP address is allowed for punch in/out operations'
          : ipValidation.message
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Check IP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
