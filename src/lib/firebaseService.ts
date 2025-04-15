
import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Bookmarks
export const addBookmark = async (item: any, type: 'food' | 'forum' | 'recipe' | 'plants' | 'animals') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // Fallback to local storage if not authenticated
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      let items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        // Forum posts have a different structure
        items = items.map((post: any) => 
          post.id === item.id ? { ...post, bookmarked: true } : post
        );
      } else if (!items.some((bookmark: any) => bookmark.id === item.id)) {
        // For other types, add the item with type
        items.push({
          ...item,
          type,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      localStorage.setItem(key, JSON.stringify(items));
      return true;
    }
    
    // User is authenticated, save to Firestore
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
    // Check if bookmark already exists
    const q = query(bookmarkRef, 
      where('itemId', '==', item.id), 
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Add new bookmark
      await addDoc(bookmarkRef, {
        itemId: item.id,
        type,
        data: item,
        createdAt: serverTimestamp()
      });
    }
    
    // For forum posts, update the post to mark as bookmarked
    if (type === 'forum') {
      const postRef = doc(db, 'posts', item.id);
      const userBookmarksRef = doc(db, 'posts', item.id, 'userBookmarks', user.uid);
      await setDoc(userBookmarksRef, { bookmarked: true });
    }
    
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
};

export const removeBookmark = async (itemId: string, type: 'food' | 'forum' | 'recipe' | 'plants' | 'animals') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // Fallback to local storage if not authenticated
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      let items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        // Forum posts have a different structure
        items = items.map((post: any) => 
          post.id === itemId ? { ...post, bookmarked: false } : post
        );
      } else {
        // For other types, remove the item
        items = items.filter((item: any) => !(item.id === itemId && item.type === type));
      }
      
      localStorage.setItem(key, JSON.stringify(items));
      return true;
    }
    
    // User is authenticated, remove from Firestore
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
    // Find the bookmark to delete
    const q = query(bookmarkRef, 
      where('itemId', '==', itemId), 
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', document.id));
    });
    
    // For forum posts, update the post to mark as not bookmarked
    if (type === 'forum') {
      const userBookmarksRef = doc(db, 'posts', itemId, 'userBookmarks', user.uid);
      await deleteDoc(userBookmarksRef);
    }
    
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

export const getBookmarks = async (type: 'food' | 'forum' | 'recipe' | 'plants' | 'animals') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // Fallback to local storage if not authenticated
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      let items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        // Filter bookmarked forum posts
        return items.filter((post: any) => post.bookmarked);
      } else if (type === 'recipe') {
        // Return all bookmarked recipes
        return items;
      } else {
        // Filter scan bookmarks by type
        return items.filter((item: any) => item.type === type);
      }
    }
    
    // User is authenticated, get from Firestore
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
    // Query bookmarks by type
    const q = query(bookmarkRef, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    
    const bookmarks: any[] = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push({
        id: doc.id,
        ...doc.data().data,
        type
      });
    });
    
    return bookmarks;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

// Check if an item is bookmarked
export const isBookmarked = async (itemId: string, type: 'food' | 'forum' | 'recipe' | 'plants' | 'animals') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      // Fallback to local storage if not authenticated
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      const items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        // Check if the forum post is bookmarked
        const post = items.find((post: any) => post.id === itemId);
        return post ? post.bookmarked : false;
      } else {
        // Check if the item exists in bookmarks
        return items.some((item: any) => item.id === itemId && item.type === type);
      }
    }
    
    // User is authenticated, check in Firestore
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
    // Query bookmark by itemId and type
    const q = query(bookmarkRef, 
      where('itemId', '==', itemId), 
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};
