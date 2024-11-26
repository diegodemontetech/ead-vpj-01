import React from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notificações</h3>
              <div className="space-y-4 max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma notificação
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <h4 className="font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};