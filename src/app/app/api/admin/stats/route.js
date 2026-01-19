import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import AllowedIP from '@/lib/db/models/AllowedIP';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import { requireAdmin } from '@/lib/auth/middleware';
import { startOfDay } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const today = startOfDay(new Date());

    const [totalUsers, activeIPs, todayAttendance, totalRecords] = await Promise.all([
      User.countDocuments({ isActive: true }),
      AllowedIP.countDocuments({ isActive: true }),
      AttendanceRecord.countDocuments({ date: today }),
      AttendanceRecord.countDocuments()
    ]);

    return NextResponse.json({
      success: true,
      totalUsers,
      activeIPs,
      todayAttendance,
      totalRecords
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
