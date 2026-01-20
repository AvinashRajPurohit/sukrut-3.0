import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAuth } from '@/lib/auth/middleware';
import { markNotificationAsRead } from '@/lib/utils/notifications';
import Notification from '@/lib/db/models/Notification';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuth();

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let notificationId;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      notificationId = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Verify the notification belongs to the user
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId?.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only mark your own notifications as read' },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    if (action === 'markRead') {
      const success = await markNotificationAsRead(notificationId);
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
    console.error('Update user notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
