import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import AttendanceConfig from '@/lib/db/models/AttendanceConfig';
import { requireAuth } from '@/lib/auth/middleware';
import { validateIP, getClientIP } from '@/lib/utils/ip-validation';
import { isLatePunchIn } from '@/lib/utils/time-validation';
import { canPunchOnDate } from '@/lib/utils/attendance-validation';
import { startOfDay } from 'date-fns';

export async function POST(request) {
  try {
    await connectDB();

    const user = await requireAuth();

    // Validate IP
    const ipValidation = await validateIP(request);
    if (!ipValidation.valid) {
      return NextResponse.json(
        { error: ipValidation.message },
        { status: 403 }
      );
    }

    const clientIP = ipValidation.ip;
    const now = new Date();
    const today = startOfDay(now);

    // Check if user can punch in today (holidays, weekends, leaves)
    const punchValidation = await canPunchOnDate(user.id, today);
    if (!punchValidation.canPunch) {
      return NextResponse.json(
        { error: punchValidation.reason },
        { status: 400 }
      );
    }

    // Check if user already punched in today
    const existingRecord = await AttendanceRecord.findOne({
      userId: user.id,
      date: today,
      punchOutTime: null
    });

    if (existingRecord) {
      return NextResponse.json(
        { error: 'You have already punched in today' },
        { status: 400 }
      );
    }

    // Get attendance config
    let config = await AttendanceConfig.findById('config');
    if (!config) {
      // Create default config if it doesn't exist
      config = await AttendanceConfig.create({
        _id: 'config'
      });
    }

    // Get request body once
    const body = await request.json().catch(() => ({}));

    // Check if late
    const isLate = isLatePunchIn(now, config.startTime, config.lateThresholdMinutes);
    const requiresReason = isLate && config.requireReasonOnLate;

    // Get reason from request body if late
    let lateReason = null;
    if (requiresReason) {
      lateReason = body.reason;

      if (!lateReason || lateReason.trim().length < 10) {
        return NextResponse.json(
          { 
            error: 'Reason is required for late punch-in',
            requiresReason: true,
            minLength: 10
          },
          { status: 400 }
        );
      }
    }

    // Create attendance record
    const record = await AttendanceRecord.create({
      userId: user.id,
      punchInTime: now,
      punchInIP: clientIP,
      date: today,
      punchInLateReason: lateReason
    });

    return NextResponse.json({
      success: true,
      record: {
        id: record._id.toString(),
        punchInTime: record.punchInTime,
        isLate,
        lateReason: record.punchInLateReason
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Punch in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
