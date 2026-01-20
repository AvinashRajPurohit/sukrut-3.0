import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceConfig from '@/lib/db/models/AttendanceConfig';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    await connectDB();
    await requireAuth();

    let config = await AttendanceConfig.findById('config');
    if (!config) {
      config = await AttendanceConfig.create({ _id: 'config' });
    }

    return NextResponse.json({
      success: true,
      config: {
        startTime: config.startTime,
        endTime: config.endTime,
        lateThresholdMinutes: config.lateThresholdMinutes,
        earlyLeaveThresholdMinutes: config.earlyLeaveThresholdMinutes,
        requireReasonOnLate: config.requireReasonOnLate,
        requireReasonOnEarly: config.requireReasonOnEarly
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
