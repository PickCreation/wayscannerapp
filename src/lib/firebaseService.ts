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
  serverTimestamp,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

// Bookmarks
export const addBookmark = async (item: any, type: 'food' | 'forum' | 'recipe' | 'plants' | 'animals') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      let items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        items = items.map((post: any) => 
          post.id === item.id ? { ...post, bookmarked: true } : post
        );
      } else if (!items.some((bookmark: any) => bookmark.id === item.id)) {
        items.push({
          ...item,
          type,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      localStorage.setItem(key, JSON.stringify(items));
      return true;
    }
    
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
    const q = query(bookmarkRef, 
      where('itemId', '==', item.id), 
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      await addDoc(bookmarkRef, {
        itemId: item.id,
        type,
        data: item,
        createdAt: serverTimestamp()
      });
    }
    
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
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      let items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        items = items.map((post: any) => 
          post.id === itemId ? { ...post, bookmarked: false } : post
        );
      } else {
        items = items.filter((item: any) => !(item.id === itemId && item.type === type));
      }
      
      localStorage.setItem(key, JSON.stringify(items));
      return true;
    }
    
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
    const q = query(bookmarkRef, 
      where('itemId', '==', itemId), 
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', document.id));
    });
    
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
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      let items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        return items.filter((post: any) => post.bookmarked);
      } else if (type === 'recipe') {
        return items;
      } else {
        return items.filter((item: any) => item.type === type);
      }
    }
    
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
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

export const isBookmarked = async (itemId: string, type: 'food' | 'forum' | 'recipe' | 'plants' | 'animals') => {
  try {
    const user = auth.currentUser;
    if (!user) {
      const key = type === 'forum' ? 'forumPosts' : 
                 type === 'recipe' ? 'bookmarkedRecipes' : 'bookmarkedScans';
      
      const savedItems = localStorage.getItem(key);
      const items = savedItems ? JSON.parse(savedItems) : [];
      
      if (type === 'forum') {
        const post = items.find((post: any) => post.id === itemId);
        return post ? post.bookmarked : false;
      } else {
        return items.some((item: any) => item.id === itemId && item.type === type);
      }
    }
    
    const bookmarkRef = collection(db, 'users', user.uid, 'bookmarks');
    
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

export const getAllPosts = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      const savedPosts = localStorage.getItem('forumPosts');
      return savedPosts ? JSON.parse(savedPosts) : [];
    }
    
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts: any[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      
      let authorData = { name: 'Unknown User', avatar: '/placeholder.svg' };
      try {
        const authorRef = doc(db, 'users', postData.authorId);
        const authorDoc = await getDoc(authorRef);
        if (authorDoc.exists()) {
          const userData = authorDoc.data();
          authorData = {
            name: userData.name || 'User',
            avatar: userData.photoURL || '/placeholder.svg'
          };
        }
      } catch (error) {
        console.error('Error fetching author data:', error);
      }
      
      let liked = false;
      try {
        const userLikesRef = doc(db, 'posts', docSnapshot.id, 'userLikes', user.uid);
        const userLikesDoc = await getDoc(userLikesRef);
        liked = userLikesDoc.exists();
      } catch (error) {
        console.error('Error checking if post is liked:', error);
      }
      
      let bookmarked = false;
      try {
        const userBookmarksRef = doc(db, 'posts', docSnapshot.id, 'userBookmarks', user.uid);
        const userBookmarksDoc = await getDoc(userBookmarksRef);
        bookmarked = userBookmarksDoc.exists();
      } catch (error) {
        console.error('Error checking if post is bookmarked:', error);
      }
      
      posts.push({
        id: docSnapshot.id,
        author: authorData,
        timeAgo: formatTimeAgo(postData.createdAt?.toDate() || new Date()),
        category: postData.category || 'General',
        content: postData.content || '',
        imageUrl: postData.imageUrl || null,
        likes: postData.likes || 0,
        comments: postData.comments || 0,
        liked,
        bookmarked
      });
    }
    
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    
    const savedPosts = localStorage.getItem('forumPosts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  }
};

export const getMyPosts = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return [];
    }
    
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts: any[] = [];
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    const authorData = {
      name: userData.name || 'You',
      avatar: userData.photoURL || '/placeholder.svg'
    };
    
    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      
      let liked = false;
      try {
        const userLikesRef = doc(db, 'posts', docSnapshot.id, 'userLikes', user.uid);
        const userLikesDoc = await getDoc(userLikesRef);
        liked = userLikesDoc.exists();
      } catch (error) {
        console.error('Error checking if post is liked:', error);
      }
      
      let bookmarked = false;
      try {
        const userBookmarksRef = doc(db, 'posts', docSnapshot.id, 'userBookmarks', user.uid);
        const userBookmarksDoc = await getDoc(userBookmarksRef);
        bookmarked = userBookmarksDoc.exists();
      } catch (error) {
        console.error('Error checking if post is bookmarked:', error);
      }
      
      posts.push({
        id: docSnapshot.id,
        author: authorData,
        timeAgo: formatTimeAgo(postData.createdAt?.toDate() || new Date()),
        category: postData.category || 'General',
        content: postData.content || '',
        imageUrl: postData.imageUrl || null,
        likes: postData.likes || 0,
        comments: postData.comments || 0,
        liked,
        bookmarked
      });
    }
    
    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    return [];
  }
};

export const createPost = async (content: string, category: string, imageFile: File | null) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to create a post');
    }
    
    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, `post-images/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    const postRef = collection(db, 'posts');
    const newPost = {
      authorId: user.uid,
      content,
      category,
      imageUrl,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(postRef, newPost);
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    return {
      id: docRef.id,
      author: {
        name: userData.name || 'You',
        avatar: userData.photoURL || '/placeholder.svg',
      },
      timeAgo: 'Just now',
      category,
      content,
      imageUrl,
      likes: 0,
      comments: 0,
      bookmarked: false,
      liked: false,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to delete a post');
    }
    
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data();
    
    if (postData.authorId !== user.uid) {
      throw new Error('You can only delete your own posts');
    }
    
    const likesRef = collection(db, 'posts', postId, 'userLikes');
    const likesSnapshot = await getDocs(likesRef);
    likesSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    const bookmarksRef = collection(db, 'posts', postId, 'userBookmarks');
    const bookmarksSnapshot = await getDocs(bookmarksRef);
    bookmarksSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const commentsSnapshot = await getDocs(commentsRef);
    commentsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    await deleteDoc(postRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const likePost = async (postId: string, isLiked: boolean) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to like a post');
    }
    
    const postRef = doc(db, 'posts', postId);
    const userLikesRef = doc(db, 'posts', postId, 'userLikes', user.uid);
    
    if (isLiked) {
      await deleteDoc(userLikesRef);
      
      await updateDoc(postRef, {
        likes: Timestamp.now()
      });
    } else {
      await setDoc(userLikesRef, {
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      await updateDoc(postRef, {
        likes: Timestamp.now()
      });
    }
    
    const postDoc = await getDoc(postRef);
    const userLikesCollection = collection(db, 'posts', postId, 'userLikes');
    const likesQuery = query(userLikesCollection);
    const likesSnapshot = await getDocs(likesQuery);
    
    return {
      liked: !isLiked,
      likes: likesSnapshot.size
    };
  } catch (error) {
    console.error('Error updating like status:', error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return [];
    }
    
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const comments: any[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const commentData = docSnapshot.data();
      
      let authorData = { name: 'Unknown User', avatar: '/placeholder.svg' };
      try {
        const authorRef = doc(db, 'users', commentData.authorId);
        const authorDoc = await getDoc(authorRef);
        if (authorDoc.exists()) {
          const userData = authorDoc.data();
          authorData = {
            name: userData.name || 'User',
            avatar: userData.photoURL || '/placeholder.svg'
          };
        }
      } catch (error) {
        console.error('Error fetching comment author data:', error);
      }
      
      comments.push({
        id: docSnapshot.id,
        author: authorData,
        timeAgo: formatTimeAgo(commentData.createdAt?.toDate() || new Date()),
        content: commentData.content || '',
      });
    }
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

export const addComment = async (postId: string, content: string) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to comment');
    }
    
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const newComment = {
      authorId: user.uid,
      content,
      createdAt: serverTimestamp()
    };
    
    const commentDoc = await addDoc(commentsRef, newComment);
    
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      await updateDoc(postRef, {
        comments: Timestamp.now()
      });
    }
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    return {
      id: commentDoc.id,
      author: {
        name: userData.name || 'You',
        avatar: userData.photoURL || '/placeholder.svg',
      },
      timeAgo: 'Just now',
      content,
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};
