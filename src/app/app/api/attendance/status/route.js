import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import { requireAuth } from '@/lib/auth/middleware';
import { startOfDay } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();

    const user = await requireAuth();
    const today = startOfDay(new Date());

    const record = await AttendanceRecord.findOne({
      userId: user.id,
      date: today
    });

    if (!record) {
      return NextResponse.json({
        success: true,
        status: 'not_punched_in',
        canPunchIn: true,
        canPunchOut: false
      });
    }

    if (!record.punchOutTime) {
      return NextResponse.json({
        success: true,
        status: 'punched_in',
        canPunchIn: false,
        canPunchOut: true,
        punchInTime: record.punchInTime,
        punchInLateReason: record.punchInLateReason
      });
    }

    return NextResponse.json({
      success: true,
      status: 'completed',
      canPunchIn: false,
      canPunchOut: false,
      punchInTime: record.punchInTime,
      punchOutTime: record.punchOutTime,
      punchInLateReason: record.punchInLateReason,
      punchOutEarlyReason: record.punchOutEarlyReason
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
