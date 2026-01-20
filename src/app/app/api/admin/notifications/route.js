import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAdmin } from '@/lib/auth/middleware';
import { getAdminNotifications, getUnreadNotificationCount, markAllNotificationsAsRead } from '@/lib/utils/notifications';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await getAdminNotifications(limit, unreadOnly);
    const unreadCount = await getUnreadNotificationCount();

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
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin();

    const { action } = await request.json();

    if (action === 'markAllRead') {
      await markAllNotificationsAsRead();
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
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
    console.error('Mark notifications read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
