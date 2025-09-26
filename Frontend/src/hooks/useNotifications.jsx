// frontend/src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';

const useNotifications = () => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission);
      }
    }
  }, []);

  const showNotification = useCallback((title, options) => {
    if ('Notification' in window && permission === 'granted') {
      new Notification(title, options);
    }
  }, [permission]);

  const requestPermission = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  return { permission, showNotification, requestPermission };
};

export default useNotifications;