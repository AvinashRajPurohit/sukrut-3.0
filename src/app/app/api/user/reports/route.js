import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceRecord from '@/lib/db/models/AttendanceRecord';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import { requireAuth } from '@/lib/auth/middleware';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();

    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Fetch all attendance records for summary calculation
    const attendanceQuery = { userId: user.id };
    if (startDateParam || endDateParam) {
      attendanceQuery.date = {};
      if (startDateParam) {
        attendanceQuery.date.$gte = startOfDay(new Date(startDateParam));
      }
      if (endDateParam) {
        attendanceQuery.date.$lte = endOfDay(new Date(endDateParam));
      }
    }

    const allAttendanceRecords = await AttendanceRecord.find(attendanceQuery).sort({ date: -1 });
    const attendanceRecords = allAttendanceRecords.slice(skip, skip + limit);

    // Fetch all leave requests for summary calculation
    const leaveQuery = { userId: user.id };
    if (startDateParam || endDateParam) {
      const startDate = startDateParam ? startOfDay(new Date(startDateParam)) : null;
      const endDate = endDateParam ? endOfDay(new Date(endDateParam)) : null;
      
      leaveQuery.$or = [];
      if (startDate && endDate) {
        leaveQuery.$or.push(
          { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        );
      } else if (startDate) {
        leaveQuery.$or.push({ endDate: { $gte: startDate } });
      } else if (endDate) {
        leaveQuery.$or.push({ startDate: { $lte: endDate } });
      }
    }

    const allLeaveRequests = await LeaveRequest.find(leaveQuery)
      .populate('reviewedBy', 'name')
      .sort({ startDate: -1 });
    const leaveRequests = allLeaveRequests.slice(skip, skip + limit);

    // Calculate total count for pagination
    const totalAttendance = allAttendanceRecords.length;
    const totalLeaves = allLeaveRequests.length;
    const hasMore = (skip + limit) < (totalAttendance + totalLeaves);

    return NextResponse.json({
      success: true,
      attendance: attendanceRecords,
      leaves: leaveRequests,
      allAttendance: allAttendanceRecords, // For summary calculation
      allLeaves: allLeaveRequests, // For summary calculation
      pagination: {
        page,
        limit,
        hasMore,
        total: totalAttendance + totalLeaves
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
