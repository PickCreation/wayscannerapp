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

// Recipe related functions
export const saveRecipe = async (recipeData: any) => {
  try {
    if (!recipeData || !recipeData.id) {
      console.error('Invalid recipe data provided', recipeData);
      return null;
    }
    
    const recipeId = recipeData.id;
    console.log('Saving recipe:', recipeId, recipeData);
    
    // Store recipe in localStorage for offline access
    const savedRecipes = localStorage.getItem('recipes');
    let recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
    
    const existingRecipeIndex = recipes.findIndex((r: any) => r.id === recipeId);
    if (existingRecipeIndex >= 0) {
      recipes[existingRecipeIndex] = recipeData;
    } else {
      recipes.push(recipeData);
    }
    
    localStorage.setItem('recipes', JSON.stringify(recipes));
    console.log('Recipe saved to localStorage');
    
    // If we're offline, just keep it in localStorage
    if (!navigator.onLine) {
      console.log('Offline mode, recipe only saved to localStorage');
      return recipeData;
    }
    
    const user = auth.currentUser;
    
    // If user is not authenticated, just keep it in localStorage
    if (!user) {
      console.log('No authenticated user, recipe only saved to localStorage');
      return recipeData;
    }
    
    // If user is authenticated, save to Firestore
    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await setDoc(recipeRef, {
        ...recipeData,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      
      console.log('Recipe saved to Firebase');
      return recipeData;
    } catch (firestoreError) {
      console.error('Firestore save error:', firestoreError);
      // Still return the recipe data since we saved to localStorage
      return recipeData;
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
    return null;
  }
};

export const getRecipe = async (recipeId: string) => {
  try {
    if (!recipeId) {
      console.error('Invalid recipeId provided');
      return null;
    }
    
    console.log('Getting recipe:', recipeId);
    
    // First check localStorage
    const savedRecipes = localStorage.getItem('recipes');
    const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
    const localRecipe = recipes.find((r: any) => r.id === recipeId);
    
    // If we're offline, return the local recipe
    if (!navigator.onLine) {
      console.log('Offline mode, returning local recipe:', localRecipe);
      return localRecipe || null;
    }
    
    // Try to get from Firestore
    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      const recipeDoc = await getDoc(recipeRef);
      
      if (recipeDoc.exists()) {
        const recipe = recipeDoc.data();
        console.log('Firebase recipe found:', recipe);
        
        // Update local storage with the latest data
        const updatedRecipes = recipes.map((r: any) => 
          r.id === recipeId ? { ...recipe, id: recipeId } : r
        );
        
        if (!updatedRecipes.some((r: any) => r.id === recipeId)) {
          updatedRecipes.push({ ...recipe, id: recipeId });
        }
        
        localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        
        return { ...recipe, id: recipeId };
      } else {
        console.log('Recipe not found in Firebase, checking local');
        
        // If not in Firestore but we have a local version, return that
        if (localRecipe) {
          console.log('Returning local recipe:', localRecipe);
          
          // Try to save the local recipe to Firebase
          try {
            await setDoc(recipeRef, {
              ...localRecipe,
              updatedAt: serverTimestamp(),
              createdAt: serverTimestamp()
            });
            console.log('Local recipe saved to Firebase');
          } catch (saveError) {
            console.error('Error saving local recipe to Firebase:', saveError);
          }
        }
        
        return localRecipe || null;
      }
    } catch (firestoreError) {
      console.error('Firestore get error:', firestoreError);
      
      // If Firestore fails, return local recipe if available
      if (localRecipe) {
        console.log('Firestore error, returning local recipe:', localRecipe);
        return localRecipe;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error getting recipe:', error);
    
    // If we have a local version, return that on error
    const savedRecipes = localStorage.getItem('recipes');
    const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
    const localRecipe = recipes.find((r: any) => r.id === recipeId);
    
    return localRecipe || null;
  }
};

export const getAllRecipes = async () => {
  try {
    console.log('Getting all recipes');
    
    // First check localStorage
    const savedRecipes = localStorage.getItem('recipes');
    const localRecipes = savedRecipes ? JSON.parse(savedRecipes) : [];
    
    // If we're offline, return local recipes
    if (!navigator.onLine) {
      console.log('Offline mode, returning local recipes:', localRecipes.length);
      return localRecipes;
    }
    
    // Try to get from Firestore
    try {
      const recipesRef = collection(db, 'recipes');
      const recipesSnapshot = await getDocs(recipesRef);
      
      const recipes: any[] = [];
      recipesSnapshot.forEach((doc) => {
        recipes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Firebase recipes found:', recipes.length);
      
      // If we got recipes from Firebase, update localStorage
      if (recipes.length > 0) {
        // Merge with local recipes that might not be in Firebase yet
        const mergedRecipes = [...recipes];
        
        // Add any local recipes that aren't in the Firebase results
        localRecipes.forEach((localRecipe: any) => {
          if (!mergedRecipes.some((r) => r.id === localRecipe.id)) {
            mergedRecipes.push(localRecipe);
          }
        });
        
        localStorage.setItem('recipes', JSON.stringify(mergedRecipes));
        return mergedRecipes;
      }
      
      // If no Firebase recipes, return local recipes
      return localRecipes;
    } catch (firestoreError) {
      console.error('Firestore getAll error:', firestoreError);
      return localRecipes;
    }
  } catch (error) {
    console.error('Error getting all recipes:', error);
    
    // Return local recipes on error
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  }
};

export const saveRecipeComment = async (recipeId: string, commentData: any) => {
  try {
    if (!recipeId || !commentData) {
      console.error('Invalid recipeId or commentData');
      return null;
    }
    
    console.log('Saving recipe comment:', recipeId, commentData);
    
    // Store comment in localStorage for offline access
    const savedComments = localStorage.getItem(`comments-${recipeId}`);
    let comments = savedComments ? JSON.parse(savedComments) : [];
    comments.push(commentData);
    localStorage.setItem(`comments-${recipeId}`, JSON.stringify(comments));
    
    // If we're offline, just keep it in localStorage
    if (!navigator.onLine) {
      console.log('Offline mode, comment only saved to localStorage');
      return commentData;
    }
    
    const user = auth.currentUser;
    
    // If user is not authenticated, just keep it in localStorage
    if (!user) {
      console.log('No authenticated user, comment only saved to localStorage');
      return commentData;
    }
    
    // If user is authenticated, save to Firestore
    try {
      const commentsRef = collection(db, 'recipes', recipeId, 'comments');
      
      const commentDoc = await addDoc(commentsRef, {
        ...commentData,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      // Update recipe document to increment comments count
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        comments: Timestamp.now()
      });
      
      console.log('Comment saved to Firebase');
      
      return {
        ...commentData,
        id: commentDoc.id
      };
    } catch (firestoreError) {
      console.error('Firestore comment save error:', firestoreError);
      // Still return the comment data since we saved to localStorage
      return commentData;
    }
  } catch (error) {
    console.error('Error saving recipe comment:', error);
    throw error;
  }
};

export const getRecipeComments = async (recipeId: string) => {
  try {
    if (!recipeId) {
      console.error('Invalid recipeId provided');
      return [];
    }
    
    console.log('Getting recipe comments:', recipeId);
    
    // First check localStorage
    const savedComments = localStorage.getItem(`comments-${recipeId}`);
    const localComments = savedComments ? JSON.parse(savedComments) : [];
    
    // If we're offline, return local comments
    if (!navigator.onLine) {
      console.log('Offline mode, returning local comments:', localComments.length);
      return localComments;
    }
    
    // Try to get from Firestore
    try {
      const commentsRef = collection(db, 'recipes', recipeId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const commentsSnapshot = await getDocs(q);
      
      const comments: any[] = [];
      commentsSnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          ...data,
          date: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : 'Just now'
        });
      });
      
      console.log('Firebase comments found:', comments.length);
      
      // Merge with local comments
      const mergedComments = [...comments];
      
      // Add any local comments that aren't in the Firebase results
      localComments.forEach((localComment: any) => {
        const firebaseComment = comments.find((c) => 
          c.id === localComment.id || 
          (c.text === localComment.text && c.author === localComment.author)
        );
        
        if (!firebaseComment) {
          mergedComments.push(localComment);
        }
      });
      
      // Update localStorage with the latest data
      localStorage.setItem(`comments-${recipeId}`, JSON.stringify(mergedComments));
      
      return mergedComments;
    } catch (firestoreError) {
      console.error('Firestore comments get error:', firestoreError);
      return localComments;
    }
  } catch (error) {
    console.error('Error getting recipe comments:', error);
    
    // Return local comments on error
    const savedComments = localStorage.getItem(`comments-${recipeId}`);
    return savedComments ? JSON.parse(savedComments) : [];
  }
};
