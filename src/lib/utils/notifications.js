import connectDB from '@/lib/db/connection';
import Notification from '@/lib/db/models/Notification';

/**
 * Create a notification for admin
 * @param {Object} options - Notification options
 * @param {string} options.type - Notification type
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {Object} options.data - Additional data
 * @param {string} options.priority - Priority level (low, medium, high, urgent)
 * @param {string} options.userId - User ID if notification is user-specific (optional)
 */
export async function createAdminNotification({
  type,
  title,
  message,
  data = {},
  priority = 'medium',
  userId = null
}) {
  try {
    await connectDB();
    
    const notification = await Notification.create({
      userId, // null for admin-only notifications
      type,
      title,
      message,
      data,
      priority,
      isRead: false
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Get unread notification count for admin
 */
export async function getUnreadNotificationCount() {
  try {
    await connectDB();
    const count = await Notification.countDocuments({
      userId: null,
      isRead: false
    });
    return count;
  } catch (error) {
    console.error('Error getting notification count:', error);
    return 0;
  }
}

/**
 * Get notifications for admin
 */
export async function getAdminNotifications(limit = 50, unreadOnly = false) {
  try {
    await connectDB();
    const query = { userId: null };
    if (unreadOnly) {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    await connectDB();
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
      readAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for admin
 */
export async function markAllNotificationsAsRead() {
  try {
    await connectDB();
    await Notification.updateMany(
      { userId: null, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

/**
 * Create a notification for a specific user
 * @param {Object} options - Notification options
 * @param {string} options.userId - User ID (required)
 * @param {string} options.type - Notification type
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {Object} options.data - Additional data
 * @param {string} options.priority - Priority level (low, medium, high, urgent)
 */
export async function createUserNotification({
  userId,
  type,
  title,
  message,
  data = {},
  priority = 'medium'
}) {
  try {
    await connectDB();
    
    if (!userId) {
      console.error('Error creating user notification: userId is required');
      return null;
    }
    
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      priority,
      isRead: false
    });

    return notification;
  } catch (error) {
    console.error('Error creating user notification:', error);
    return null;
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUserUnreadNotificationCount(userId) {
  try {
    await connectDB();
    if (!userId) {
      return 0;
    }
    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });
    return count;
  } catch (error) {
    console.error('Error getting user notification count:', error);
    return 0;
  }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId, limit = 50, unreadOnly = false) {
  try {
    await connectDB();
    if (!userId) {
      return [];
    }
    const query = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return [];
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllUserNotificationsAsRead(userId) {
  try {
    await connectDB();
    if (!userId) {
      return false;
    }
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return true;
  } catch (error) {
    console.error('Error marking all user notifications as read:', error);
    return false;
  }
}
