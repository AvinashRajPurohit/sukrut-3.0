'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { Bell, X, Check, CheckCheck, AlertCircle, Clock, UserPlus, UserMinus, Calendar, FileText, LogIn, LogOut, Server, AlertTriangle, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const notificationIcons = {
  punch_in: LogIn,
  punch_out: LogOut,
  late_arrival: AlertCircle,
  early_departure: Clock,
  leave_request: FileText,
  leave_approved: Check,
  leave_rejected: X,
  user_registered: UserPlus,
  user_deactivated: UserMinus,
  ip_added: Server,
  ip_removed: Server,
  holiday_added: Calendar,
  system_alert: AlertTriangle
};

const notificationColors = {
  punch_in: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
  punch_out: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20',
  late_arrival: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20',
  early_departure: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20',
  leave_request: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20',
  leave_approved: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
  leave_rejected: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
  user_registered: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
  user_deactivated: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20',
  ip_added: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20',
  ip_removed: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20',
  holiday_added: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/20',
  system_alert: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const unreadOnly = filter === 'unread';
      const res = await fetch(`/app/api/admin/notifications?limit=100&unreadOnly=${unreadOnly}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`/app/api/admin/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead' })
      });

      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/app/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' })
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const Icon = notificationIcons[type] || Bell;
    return Icon;
  };

  const getNotificationColor = (type) => {
    return notificationColors[type] || 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20';
  };

  const filteredNotifications = filter === 'read' 
    ? notifications.filter(n => n.isRead)
    : filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter:</span>
          <div className="flex items-center gap-2">
            {['all', 'unread', 'read'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${filter === filterOption
                    ? 'bg-[#E39A2E] text-white shadow-lg shadow-[#E39A2E]/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filterOption === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 text-center">
              {filter === 'unread' ? 'You\'re all caught up!' : 'Notifications will appear here when events occur.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              const isUnread = !notification.isRead;

              return (
                <div
                  key={notification._id}
                  onClick={() => {
                    // Mark as read when clicked (if not already read)
                    if (!notification.isRead) {
                      markAsRead(notification._id);
                    }
                  }}
                  className={`
                    p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer
                    ${isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-base font-semibold ${isUnread ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                              {notification.title}
                            </h3>
                            {isUnread && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                            <span>
                              {format(new Date(notification.createdAt), 'MMM d, yyyy')} at {format(new Date(notification.createdAt), 'h:mm a')}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            {notification.priority && (
                              <>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded ${
                                  notification.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                  notification.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                                  notification.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {notification.priority}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {isUnread && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0 cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
