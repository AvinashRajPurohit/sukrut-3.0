import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveRequest from '@/lib/db/models/LeaveRequest';
import { requireAdmin } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    await connectDB();
    const admin = await requireAdmin();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (year) {
      const startDate = new Date(parseInt(year), month ? parseInt(month) - 1 : 0, 1);
      const endDate = new Date(parseInt(year), month ? parseInt(month) : 11, 31, 23, 59, 59);
      query.startDate = { $lte: endDate };
      query.endDate = { $gte: startDate };
    }

    const leaves = await LeaveRequest.find(query)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

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
