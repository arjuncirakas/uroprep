import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const NotificationBell = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const unreadCount = useSelector(state => state.notifications.unreadCount);

  return (
    <>
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

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
};

export default NotificationBell;
