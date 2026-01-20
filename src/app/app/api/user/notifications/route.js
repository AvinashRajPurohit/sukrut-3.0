import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAuth } from '@/lib/auth/middleware';
import { getUserNotifications, markAllUserNotificationsAsRead, getUserUnreadNotificationCount } from '@/lib/utils/notifications';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await getUserNotifications(user.id, limit, unreadOnly);
    const unreadCount = await getUserUnreadNotificationCount(user.id);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get user notifications error:', error);
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

    const { action } = await request.json();

    if (action === 'markAllRead') {
      const success = await markAllUserNotificationsAsRead(user.id);
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'All notifications marked as read'
        });
      }
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
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
    console.error('Mark all user notifications as read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
