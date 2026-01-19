import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional()
});

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const admin = await requireAdmin();

    const { id } = params;
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const updateData = {
      status: validated.status,
      reviewedBy: admin.userId,
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

    return NextResponse.json({
      success: true,
      leaveRequest
    });
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
    console.error('Review leave request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
