import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, AlertCircle } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const NotificationBell = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const notifications = useSelector(state => state.notifications.notifications);
  
  // Count PSA-related notifications
  const psaNotificationCount = notifications.filter(
    n => !n.read && (n.type === 'psa_monitoring' || n.type === 'psa_entry')
  ).length;

  return (
    <>
      <div className="relative flex items-center">
        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
          title="Notifications"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* PSA Alert Indicator */}
        {psaNotificationCount > 0 && (
          <div className="ml-2 flex items-center">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="ml-1 text-xs font-medium text-orange-700">
              {psaNotificationCount} PSA
            </span>
          </div>
        )}
      </div>

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
};

export default NotificationBell;
