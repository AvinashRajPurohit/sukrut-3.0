import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { requireAdmin } from '@/lib/auth/middleware';
import { getUnreadNotificationCount, getAdminNotifications } from '@/lib/utils/notifications';

/**
 * Server-Sent Events endpoint for real-time notifications
 */
export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Send initial connection message
        const send = (data) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Send initial notification count
        let lastCount = await getUnreadNotificationCount();
        send({ type: 'count', count: lastCount });

        // Poll for new notifications every 2 seconds
        let lastCheck = Date.now();
        const pollInterval = setInterval(async () => {
          try {
            const currentCount = await getUnreadNotificationCount();
            const newNotifications = await getAdminNotifications(5, true);
            
            // Check if there are new notifications since last check
            const newNotificationsSinceLastCheck = newNotifications.filter(
              n => new Date(n.createdAt).getTime() > lastCheck
            );

            if (newNotificationsSinceLastCheck.length > 0) {
              send({
                type: 'new',
                notifications: newNotificationsSinceLastCheck,
                count: currentCount
              });
              lastCount = currentCount;
            } else if (currentCount !== lastCount) {
              // Count changed, send update
              send({ type: 'count', count: currentCount });
              lastCount = currentCount;
            }

            lastCheck = Date.now();
          } catch (error) {
            console.error('Error polling notifications:', error);
          }
        }, 2000); // Poll every 2 seconds

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
        'X-Accel-Buffering': 'no' // Disable buffering for nginx
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('SSE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
