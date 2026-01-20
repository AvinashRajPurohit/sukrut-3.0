import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';
import { canApplyLeave } from '@/lib/utils/leave-validation';
import { createAdminNotification } from '@/lib/utils/notifications';
import { z } from 'zod';
import { startOfDay, endOfDay, format } from 'date-fns';

const leaveRequestSchema = z.object({
  leaveType: z.enum(['sick-leave', 'paid-leave', 'unpaid-leave', 'work-from-home']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  type: z.enum(['full-day', 'half-day']),
  halfDayType: z.enum(['first-half', 'second-half']).optional(),
  reason: z.string().min(10, 'Reason must be at least 10 characters')
}).refine((data) => {
  if (data.type === 'half-day' && !data.halfDayType) {
    return false;
  }
  return true;
}, {
  message: 'Half day type is required for half-day leaves',
  path: ['halfDayType']
});

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const query = { userId: user.id };
    if (year) {
      const startDate = new Date(parseInt(year), month ? parseInt(month) - 1 : 0, 1);
      const endDate = new Date(parseInt(year), month ? parseInt(month) : 11, 31, 23, 59, 59);
      query.startDate = { $lte: endDate };
      query.endDate = { $gte: startDate };
    }

    const leaves = await LeaveRequest.find(query)
      .sort({ startDate: -1 })
      .populate('reviewedBy', 'name');

    return NextResponse.json({
      success: true,
      leaves
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get leaves error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAuth();

    const body = await request.json();
    const validated = leaveRequestSchema.parse(body);

    const startDate = startOfDay(new Date(validated.startDate));
    const endDate = endOfDay(new Date(validated.endDate));

    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Validate leave limits
    const leaveValidation = await canApplyLeave(
      user.id,
      validated.leaveType,
      startDate,
      endDate,
      validated.type
    );

    if (!leaveValidation.canApply) {
      return NextResponse.json(
        { error: leaveValidation.reason },
        { status: 400 }
      );
    }

    // Check for overlapping leave requests
    const overlapping = await LeaveRequest.findOne({
      userId: user.id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlapping) {
      return NextResponse.json(
        { error: 'You already have a leave request for this period' },
        { status: 400 }
      );
    }

    const leaveRequest = await LeaveRequest.create({
      ...validated,
      userId: user.id,
      startDate,
      endDate
    });

    // Create admin notification for new leave request
    const userDetails = await User.findById(user.id).select('name email');
    const leaveTypeLabels = {
      'sick-leave': 'Sick Leave',
      'paid-leave': 'Paid Leave',
      'unpaid-leave': 'Unpaid Leave',
      'work-from-home': 'Work From Home'
    };
    
    await createAdminNotification({
      type: 'leave_request',
      title: 'New Leave Request',
      message: `${userDetails?.name || 'User'} requested ${leaveTypeLabels[validated.leaveType] || validated.leaveType} from ${format(startDate, 'MMM d')} to ${format(endDate, 'MMM d, yyyy')}`,
      data: {
        leaveRequestId: leaveRequest._id.toString(),
        userId: user.id,
        userName: userDetails?.name,
        userEmail: userDetails?.email,
        leaveType: validated.leaveType,
        startDate,
        endDate,
        reason: validated.reason
      },
      priority: 'high'
    });

    return NextResponse.json({
      success: true,
      leaveRequest
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Create leave request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
