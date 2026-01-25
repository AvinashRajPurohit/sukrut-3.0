import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import { requireAdmin } from '@/lib/auth/middleware';
import { createAdminNotification, createUserNotification } from '@/lib/utils/notifications';
import { z } from 'zod';
import { format } from 'date-fns';

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional()
});

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const admin = await requireAdmin();

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let id;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      id = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Leave request ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const updateData = {
      status: validated.status,
      reviewedBy: admin.id,
      reviewedAt: new Date()
    };

    if (validated.status === 'rejected' && validated.rejectionReason) {
      updateData.rejectionReason = validated.rejectionReason;
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name');

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    // Create admin notification for leave approval/rejection (for audit trail)
    const leaveTypeLabels = {
      'sick-leave': 'Sick Leave',
      'paid-leave': 'Paid Leave',
      'unpaid-leave': 'Unpaid Leave',
      'work-from-home': 'Work From Home'
    };

    const userId = leaveRequest.userId?._id?.toString() || leaveRequest.userId?.toString();

    if (validated.status === 'approved') {
      // Admin notification
      await createAdminNotification({
        type: 'leave_approved',
        title: 'Leave Approved',
        message: `${leaveRequest.userId?.name || 'User'}'s ${leaveTypeLabels[leaveRequest.leaveType] || leaveRequest.leaveType} request has been approved`,
        data: {
          leaveRequestId: leaveRequest._id.toString(),
          userId: userId,
          userName: leaveRequest.userId?.name,
          leaveType: leaveRequest.leaveType,
          reviewedBy: admin.id
        },
        priority: 'medium'
      });

      // User notification
      if (userId) {
        await createUserNotification({
          userId: userId,
          type: 'leave_approved',
          title: 'Leave Request Approved',
          message: `Your ${leaveTypeLabels[leaveRequest.leaveType] || leaveRequest.leaveType} request from ${format(new Date(leaveRequest.startDate), 'MMM d')} to ${format(new Date(leaveRequest.endDate), 'MMM d, yyyy')} has been approved`,
          data: {
            leaveRequestId: leaveRequest._id.toString(),
            leaveType: leaveRequest.leaveType,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            reviewedBy: admin.id
          },
          priority: 'high'
        });
      }
    } else if (validated.status === 'rejected') {
      // Admin notification
      await createAdminNotification({
        type: 'leave_rejected',
        title: 'Leave Rejected',
        message: `${leaveRequest.userId?.name || 'User'}'s ${leaveTypeLabels[leaveRequest.leaveType] || leaveRequest.leaveType} request has been rejected${validated.rejectionReason ? ` - ${validated.rejectionReason}` : ''}`,
        data: {
          leaveRequestId: leaveRequest._id.toString(),
          userId: userId,
          userName: leaveRequest.userId?.name,
          leaveType: leaveRequest.leaveType,
          rejectionReason: validated.rejectionReason,
          reviewedBy: admin.id
        },
        priority: 'medium'
      });

      // User notification
      if (userId) {
        await createUserNotification({
          userId: userId,
          type: 'leave_rejected',
          title: 'Leave Request Rejected',
          message: `Your ${leaveTypeLabels[leaveRequest.leaveType] || leaveRequest.leaveType} request from ${format(new Date(leaveRequest.startDate), 'MMM d')} to ${format(new Date(leaveRequest.endDate), 'MMM d, yyyy')} has been rejected${validated.rejectionReason ? ` - ${validated.rejectionReason}` : ''}`,
          data: {
            leaveRequestId: leaveRequest._id.toString(),
            leaveType: leaveRequest.leaveType,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            rejectionReason: validated.rejectionReason,
            reviewedBy: admin.id
          },
          priority: 'high'
        });
      }
    }

    return NextResponse.json({
      success: true,
      leaveRequest
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message ?? 'Validation failed' },
        { status: 400 }
      );
    }
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Review leave request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
