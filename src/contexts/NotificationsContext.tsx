
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
  doc,
  addDoc,
  getDocs,
  deleteDoc
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
  addSampleNotifications: () => Promise<void>;
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
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        // Reset notifications when user logs out
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const notificationsRef = collection(db, 'users', user.uid, 'notifications');
      const q = query(
        notificationsRef,
        orderBy('createdAt', 'desc')
      );

      const notificationsUnsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NotificationType[];
        
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter(n => !n.read).length);
      });

      return notificationsUnsubscribe;
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

  const addSampleNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // First clear existing notifications
    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const existingNotifications = await getDocs(notificationsRef);
    
    const deletePromises = existingNotifications.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);

    // Add sample notifications
    const sampleNotifications = [
      {
        type: 'order',
        title: 'Order Confirmed',
        message: 'Your order #12345 has been confirmed and is being processed.',
        read: false,
        createdAt: Timestamp.now(),
        link: '/orders'
      },
      {
        type: 'shipping',
        title: 'Package Shipped',
        message: 'Your package has been shipped and is on its way to you.',
        read: false,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
        link: '/orders'
      },
      {
        type: 'message',
        title: 'New Message',
        message: 'You have received a new message from EcoStore.',
        read: false,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000)), // 6 hours ago
        link: '/profile/messages'
      },
      {
        type: 'like',
        title: 'Post Liked',
        message: 'Your post about sustainable gardening received 5 new likes.',
        read: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 day ago
        link: '/forum'
      },
      {
        type: 'comment',
        title: 'New Comment',
        message: 'GreenThumb commented on your plant identification post.',
        read: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
        link: '/forum'
      }
    ];

    const addPromises = sampleNotifications.map(notification => 
      addDoc(notificationsRef, notification)
    );

    await Promise.all(addPromises);
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addSampleNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
