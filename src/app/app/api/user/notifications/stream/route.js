import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAuth } from '@/lib/auth/middleware';
import { getUserNotifications, getUserUnreadNotificationCount } from '@/lib/utils/notifications';
import Notification from '@/lib/db/models/Notification';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Send initial data
        const initialNotifications = await getUserNotifications(user.id, 10, true);
        const initialUnreadCount = await getUserUnreadNotificationCount(user.id);
        send({
          type: 'initial',
          notifications: initialNotifications,
          unreadCount: initialUnreadCount
        });

        // Poll for new notifications every 5 seconds
        let lastCheck = new Date();
        const pollInterval = setInterval(async () => {
          try {
            const newNotifications = await Notification.find({
              userId: user.id,
              isRead: false,
              createdAt: { $gt: lastCheck }
            })
              .sort({ createdAt: -1 })
              .limit(10)
              .lean();

            if (newNotifications.length > 0) {
              const unreadCount = await getUserUnreadNotificationCount(user.id);
              send({
                type: 'new',
                notifications: newNotifications,
                unreadCount
              });
              lastCheck = new Date();
            }
          } catch (error) {
            console.error('Error polling notifications:', error);
          }
        }, 5000);

        // Cleanup on client disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(pollInterval);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Notification stream error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
