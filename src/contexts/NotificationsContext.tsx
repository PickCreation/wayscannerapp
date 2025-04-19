
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  Timestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';

export type NotificationType = {
  id: string;
  type: 'order' | 'shipping' | 'message' | 'like' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  link?: string;
};

type NotificationsContextType = {
  notifications: NotificationType[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationType[];
      
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  };

  const markAllAsRead = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const promises = notifications
      .filter(n => !n.read)
      .map(n => {
        const notificationRef = doc(db, 'users', user.uid, 'notifications', n.id);
        return updateDoc(notificationRef, { read: true });
      });

    await Promise.all(promises);
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
