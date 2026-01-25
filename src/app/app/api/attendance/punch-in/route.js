import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import AttendanceConfig from '@/lib/db/models/AttendanceConfig';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';
import { validateIPForPunch, getClientIP } from '@/lib/utils/ip-validation';
import { verifyFaceDescriptor } from '@/lib/utils/face-verification';
import { isLatePunchIn } from '@/lib/utils/time-validation';
import { canPunchOnDate } from '@/lib/utils/attendance-validation';
import { createAdminNotification } from '@/lib/utils/notifications';
import { startOfDay } from 'date-fns';
import { format } from 'date-fns';

export async function POST(request) {
  try {
    await connectDB();

    const user = await requireAuth();
    const body = await request.json().catch(() => ({}));

    // Face verification: must have registered face and provide descriptor
    const userDoc = await User.findById(user.id).select('faceDescriptor').lean();
    if (!userDoc?.faceDescriptor || !Array.isArray(userDoc.faceDescriptor) || userDoc.faceDescriptor.length !== 128) {
      return NextResponse.json(
        { error: 'Face not registered. Please register your face first.', faceNotRegistered: true },
        { status: 400 }
      );
    }
    if (!body.faceDescriptor || !Array.isArray(body.faceDescriptor) || body.faceDescriptor.length !== 128) {
      return NextResponse.json(
        { error: 'Face verification required', requiresFaceVerification: true },
        { status: 400 }
      );
    }
    const faceCheck = verifyFaceDescriptor(userDoc.faceDescriptor, body.faceDescriptor);
    if (!faceCheck.ok) {
      return NextResponse.json({ error: 'Face verification failed' }, { status: 403 });
    }

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

    // Create admin notification
    const userDetails = await User.findById(user.id).select('name email');
    if (isLate) {
      await createAdminNotification({
        type: 'late_arrival',
        title: 'Late Arrival',
        message: `${userDetails?.name || 'User'} punched in late at ${format(now, 'HH:mm')}${lateReason ? ` - ${lateReason}` : ''}`,
        data: {
          userId: user.id,
          userName: userDetails?.name,
          userEmail: userDetails?.email,
          punchInTime: now,
          reason: lateReason
        },
        priority: 'high'
      });
    } else {
      await createAdminNotification({
        type: 'punch_in',
        title: 'Punch In',
        message: `${userDetails?.name || 'User'} punched in at ${format(now, 'HH:mm')}`,
        data: {
          userId: user.id,
          userName: userDetails?.name,
          userEmail: userDetails?.email,
          punchInTime: now
        },
        priority: 'medium'
      });
    }

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
