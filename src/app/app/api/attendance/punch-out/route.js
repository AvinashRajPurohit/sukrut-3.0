import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import AttendanceConfig from '@/lib/db/models/AttendanceConfig';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';
import { validateIPForPunch, getClientIP } from '@/lib/utils/ip-validation';
import { isEarlyPunchOut } from '@/lib/utils/time-validation';
import { canPunchOnDate } from '@/lib/utils/attendance-validation';
import { createAdminNotification } from '@/lib/utils/notifications';
import { startOfDay } from 'date-fns';
import { format } from 'date-fns';

export async function POST(request) {
  try {
    await connectDB();

    const user = await requireAuth();

    // Validate IP for punch in/out (strict - only configured IPs allowed)
    const ipValidation = await validateIPForPunch(request);
    if (!ipValidation.valid) {
      return NextResponse.json(
        { 
          error: ipValidation.message,
          requiresAllowedIP: true,
          currentIP: getClientIP(request)
        },
        { status: 403 }
      );
    }

    const clientIP = ipValidation.ip;
    const now = new Date();
    const today = startOfDay(now);

    // Get request body once (before any validation that might need it)
    const body = await request.json().catch(() => ({}));

    // Check if user can punch out today (holidays, weekends, leaves)
    const punchValidation = await canPunchOnDate(user.id, today);
    if (!punchValidation.canPunch) {
      return NextResponse.json(
        { error: punchValidation.reason },
        { status: 400 }
      );
    }

    // Find today's punch-in record
    const record = await AttendanceRecord.findOne({
      userId: user.id,
      date: today,
      punchOutTime: null
    });

    if (!record) {
      return NextResponse.json(
        { error: 'You have not punched in today' },
        { status: 400 }
      );
    }

    // Get attendance config
    const config = await AttendanceConfig.findById('config');
    if (!config) {
      return NextResponse.json(
        { error: 'Attendance configuration not found' },
        { status: 500 }
      );
    }

    // Check if early
    const isEarly = isEarlyPunchOut(now, config.endTime, config.earlyLeaveThresholdMinutes);
    const requiresReason = isEarly && config.requireReasonOnEarly;

    // Get reason from request body if early
    let earlyReason = null;
    if (requiresReason) {
      earlyReason = body.reason;

      if (!earlyReason || earlyReason.trim().length < 10) {
        return NextResponse.json(
          { 
            error: 'Reason is required for early punch-out',
            requiresReason: true,
            minLength: 10
          },
          { status: 400 }
        );
      }
    }

    // Update record
    record.punchOutTime = now;
    record.punchOutIP = clientIP;
    record.punchOutEarlyReason = earlyReason;
    await record.save();

    // Create admin notification
    const userDetails = await User.findById(user.id).select('name email');
    if (isEarly) {
      await createAdminNotification({
        type: 'early_departure',
        title: 'Early Departure',
        message: `${userDetails?.name || 'User'} punched out early at ${format(now, 'HH:mm')}${earlyReason ? ` - ${earlyReason}` : ''}`,
        data: {
          userId: user.id,
          userName: userDetails?.name,
          userEmail: userDetails?.email,
          punchOutTime: now,
          reason: earlyReason
        },
        priority: 'high'
      });
    } else {
      await createAdminNotification({
        type: 'punch_out',
        title: 'Punch Out',
        message: `${userDetails?.name || 'User'} punched out at ${format(now, 'HH:mm')}`,
        data: {
          userId: user.id,
          userName: userDetails?.name,
          userEmail: userDetails?.email,
          punchOutTime: now
        },
        priority: 'medium'
      });
    }

    return NextResponse.json({
      success: true,
      record: {
        id: record._id.toString(),
        punchInTime: record.punchInTime,
        punchOutTime: record.punchOutTime,
        isEarly,
        earlyReason: record.punchOutEarlyReason
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Punch out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
