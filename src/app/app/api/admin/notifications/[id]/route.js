import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAdmin } from '@/lib/auth/middleware';
import { markNotificationAsRead } from '@/lib/utils/notifications';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

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
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const { action } = await request.json();

    if (action === 'markRead') {
      const success = await markNotificationAsRead(id);
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
        });
      }
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Update notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
