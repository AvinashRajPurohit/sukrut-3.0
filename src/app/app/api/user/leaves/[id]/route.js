import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import { requireAuth } from '@/lib/auth/middleware';
import { createAdminNotification, createUserNotification } from '@/lib/utils/notifications';
import { format } from 'date-fns';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuth();

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let leaveId;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      leaveId = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!leaveId) {
      return NextResponse.json(
        { error: 'Leave request ID is required' },
        { status: 400 }
      );
    }

    // Find the leave request and verify ownership
    const leaveRequest = await LeaveRequest.findById(leaveId)
      .populate('userId', 'name email');

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    // Verify the leave request belongs to the user
    if (leaveRequest.userId._id.toString() !== user.id && leaveRequest.userId.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only cancel your own leave requests' },
        { status: 403 }
      );
    }

    // Check if the leave request can be cancelled (only pending requests)
    if (leaveRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot cancel leave request. It has already been ${leaveRequest.status}.` },
        { status: 400 }
      );
    }

    // Update status to cancelled
    leaveRequest.status = 'cancelled';
    await leaveRequest.save();

    // Create admin notification for cancelled leave request
    const leaveTypeLabels = {
      'sick-leave': 'Sick Leave',
      'paid-leave': 'Paid Leave',
      'unpaid-leave': 'Unpaid Leave',
      'work-from-home': 'Work From Home'
    };

    const userId = leaveRequest.userId?._id?.toString() || leaveRequest.userId?.toString();

    // Admin notification
    await createAdminNotification({
      type: 'leave_cancelled',
      title: 'Leave Request Cancelled',
      message: `${leaveRequest.userId?.name || 'User'} cancelled their ${leaveTypeLabels[leaveRequest.leaveType] || leaveRequest.leaveType} request from ${format(new Date(leaveRequest.startDate), 'MMM d')} to ${format(new Date(leaveRequest.endDate), 'MMM d, yyyy')}`,
      data: {
        leaveRequestId: leaveRequest._id.toString(),
        userId: userId,
        userName: leaveRequest.userId?.name,
        userEmail: leaveRequest.userId?.email,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate
      },
      priority: 'medium'
    });

    // User notification (already cancelled, so just for record)
    if (userId) {
      await createUserNotification({
        userId: userId,
        type: 'leave_cancelled',
        title: 'Leave Request Cancelled',
        message: `You cancelled your ${leaveTypeLabels[leaveRequest.leaveType] || leaveRequest.leaveType} request from ${format(new Date(leaveRequest.startDate), 'MMM d')} to ${format(new Date(leaveRequest.endDate), 'MMM d, yyyy')}`,
        data: {
          leaveRequestId: leaveRequest._id.toString(),
          leaveType: leaveRequest.leaveType,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate
        },
        priority: 'low'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Leave request cancelled successfully',
      leaveRequest
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Cancel leave request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
