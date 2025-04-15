import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image: string;
  rating: number;
  reviews: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductComment {
  id: string;
  productId: string;
  text: string;
  rating?: number;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
}

// Get all products
export const getAllProducts = async () => {
  try {
    console.log('Getting all products');
    
    // First check localStorage
    const savedProducts = localStorage.getItem('products');
    const localProducts = savedProducts ? JSON.parse(savedProducts) : [];
    
    // If we're offline, return local products
    if (!navigator.onLine) {
      console.log('Offline mode, returning local products:', localProducts.length);
      return localProducts;
    }
    
    // Try to get from Firestore
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const productsSnapshot = await getDocs(q);
      
      const products: Product[] = [];
      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          title: data.title || '',
          price: data.price || 0,
          category: data.category || '',
          description: data.description || '',
          image: data.image || '/placeholder.svg',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          stock: data.stock || 0,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      });
      
      console.log('Firebase products found:', products.length);
      
      // If we got products from Firebase, update localStorage
      if (products.length > 0) {
        localStorage.setItem('products', JSON.stringify(products));
      }
      
      // Merge with local products that might not yet be in Firebase
      const mergedProducts = [...products];
      
      localProducts.forEach((localProduct: Product) => {
        if (!products.some(p => p.id === localProduct.id)) {
          mergedProducts.push(localProduct);
        }
      });
      
      return mergedProducts;
    } catch (firestoreError) {
      console.error('Firestore getAll error:', firestoreError);
      return localProducts;
    }
  } catch (error) {
    console.error('Error getting all products:', error);
    
    // Return local products on error
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  }
};

// Get product by id
export const getProduct = async (productId: string) => {
  try {
    if (!productId) {
      console.error('Invalid productId provided');
      return null;
    }
    
    console.log('Getting product:', productId);
    
    // First check localStorage
    const savedProducts = localStorage.getItem('products');
    const products = savedProducts ? JSON.parse(savedProducts) : [];
    const localProduct = products.find((r: any) => r.id === productId);
    
    // If we're offline, return the local product
    if (!navigator.onLine) {
      console.log('Offline mode, returning local product:', localProduct);
      return localProduct || null;
    }
    
    // Try to get from Firestore
    try {
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        const data = productDoc.data();
        const product: Product = {
          id: productDoc.id,
          title: data.title || '',
          price: data.price || 0,
          category: data.category || '',
          description: data.description || '',
          image: data.image || '/placeholder.svg',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          stock: data.stock || 0,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
        
        console.log('Firebase product found:', product);
        
        // Update local storage with the latest data
        const updatedProducts = products.map((p: Product) => 
          p.id === productId ? product : p
        );
        
        if (!updatedProducts.some((p: Product) => p.id === productId)) {
          updatedProducts.push(product);
        }
        
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        return product;
      } else {
        console.log('Product not found in Firebase, checking local');
        
        // If not in Firestore but we have a local version, return that
        if (localProduct) {
          console.log('Returning local product:', localProduct);
          
          // Try to save the local product to Firebase if it's valid
          if (localProduct.title && typeof localProduct.price === 'number') {
            try {
              await addDoc(collection(db, 'products'), {
                ...localProduct,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp()
              });
              console.log('Local product saved to Firebase');
            } catch (saveError) {
              console.error('Error saving local product to Firebase:', saveError);
            }
          }
        }
        
        return localProduct || null;
      }
    } catch (firestoreError) {
      console.error('Firestore get error:', firestoreError);
      
      // If Firestore fails, return local product if available
      if (localProduct) {
        console.log('Firestore error, returning local product:', localProduct);
        return localProduct;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    
    // If we have a local version, return that on error
    const savedProducts = localStorage.getItem('products');
    const products = savedProducts ? JSON.parse(savedProducts) : [];
    const localProduct = products.find((p: any) => p.id === productId);
    
    return localProduct || null;
  }
};

// Save product
export const saveProduct = async (productData: Partial<Product>) => {
  try {
    if (!productData) {
      console.error('Invalid product data provided');
      return null;
    }
    
    const productId = productData.id || `temp-${Date.now()}`;
    console.log('Saving product:', productId, productData);
    
    // Store product in localStorage for offline access
    const savedProducts = localStorage.getItem('products');
    let products = savedProducts ? JSON.parse(savedProducts) : [];
    
    const existingProductIndex = products.findIndex((p: Product) => p.id === productId);
    const updatedProduct = {
      ...productData,
      id: productId,
      updatedAt: new Date()
    };
    
    if (existingProductIndex >= 0) {
      products[existingProductIndex] = {
        ...products[existingProductIndex],
        ...updatedProduct
      };
    } else {
      products.push({
        ...updatedProduct,
        createdAt: new Date()
      });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Product saved to localStorage');
    
    // If we're offline, just keep it in localStorage
    if (!navigator.onLine) {
      console.log('Offline mode, product only saved to localStorage');
      return updatedProduct;
    }
    
    // Try to save to Firestore
    try {
      let firestoreProductId = productId;
      
      // Check if it's a temp ID that needs to be properly saved to Firestore
      if (productId.startsWith('temp-')) {
        const productsRef = collection(db, 'products');
        const docRef = await addDoc(productsRef, {
          ...productData,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        });
        firestoreProductId = docRef.id;
        
        // Update localStorage with the proper ID
        products = products.map((p: Product) => 
          p.id === productId ? { ...p, id: firestoreProductId } : p
        );
        localStorage.setItem('products', JSON.stringify(products));
      } else {
        // It's an existing product, update it
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
          ...productData,
          updatedAt: serverTimestamp()
        });
      }
      
      console.log('Product saved to Firebase with ID:', firestoreProductId);
      return { ...updatedProduct, id: firestoreProductId };
    } catch (firestoreError) {
      console.error('Firestore save error:', firestoreError);
      // Still return the product data since we saved to localStorage
      return updatedProduct;
    }
  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
};

// Get product reviews/comments
export const getProductComments = async (productId: string) => {
  try {
    if (!productId) {
      console.error('Invalid productId provided');
      return [];
    }
    
    console.log('Getting product comments:', productId);
    
    // First check localStorage
    const savedComments = localStorage.getItem(`product-comments-${productId}`);
    const localComments = savedComments ? JSON.parse(savedComments) : [];
    
    // If we're offline, return local comments
    if (!navigator.onLine) {
      console.log('Offline mode, returning local comments:', localComments.length);
      return localComments;
    }
    
    // Try to get from Firestore
    try {
      const commentsRef = collection(db, 'products', productId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const commentsSnapshot = await getDocs(q);
      
      const comments: ProductComment[] = [];
      commentsSnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          productId,
          text: data.text || '',
          rating: data.rating,
          author: {
            name: data.author?.name || 'Anonymous',
            avatar: data.author?.avatar
          },
          date: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : 'Just now'
        });
      });
      
      console.log('Firebase comments found:', comments.length);
      
      // Update localStorage with the latest data
      localStorage.setItem(`product-comments-${productId}`, JSON.stringify(comments));
      
      return comments;
    } catch (firestoreError) {
      console.error('Firestore comments get error:', firestoreError);
      return localComments;
    }
  } catch (error) {
    console.error('Error getting product comments:', error);
    
    // Return local comments on error
    const savedComments = localStorage.getItem(`product-comments-${productId}`);
    return savedComments ? JSON.parse(savedComments) : [];
  }
};

// Add product comment/review
export const addProductComment = async (productId: string, commentData: Partial<ProductComment>) => {
  try {
    if (!productId || !commentData || !commentData.text) {
      console.error('Invalid productId or comment data');
      return null;
    }
    
    const comment: ProductComment = {
      id: `temp-${Date.now()}`,
      productId,
      text: commentData.text,
      rating: commentData.rating,
      author: commentData.author || { name: 'Anonymous' },
      date: 'Just now'
    };
    
    console.log('Adding product comment:', productId, comment);
    
    // Store in localStorage for offline access
    const savedComments = localStorage.getItem(`product-comments-${productId}`);
    let comments = savedComments ? JSON.parse(savedComments) : [];
    comments.unshift(comment);
    localStorage.setItem(`product-comments-${productId}`, JSON.stringify(comments));
    
    // If we're offline, just keep it in localStorage
    if (!navigator.onLine) {
      console.log('Offline mode, comment only saved to localStorage');
      return comment;
    }
    
    // Try to save to Firestore
    try {
      const commentsRef = collection(db, 'products', productId, 'comments');
      const docRef = await addDoc(commentsRef, {
        text: comment.text,
        rating: comment.rating,
        author: comment.author,
        createdAt: serverTimestamp()
      });
      
      // Update the product's review count and rating
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists() && comment.rating) {
        const productData = productDoc.data();
        const currentReviews = productData.reviews || 0;
        const currentRating = productData.rating || 0;
        
        // Calculate new average rating
        const newRating = (currentRating * currentReviews + comment.rating) / (currentReviews + 1);
        
        await updateDoc(productRef, {
          reviews: currentReviews + 1,
          rating: newRating,
          updatedAt: serverTimestamp()
        });
        
        // Update local storage product data as well
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          const updatedProducts = products.map((p: Product) => {
            if (p.id === productId) {
              return {
                ...p,
                reviews: (p.reviews || 0) + 1,
                rating: newRating
              };
            }
            return p;
          });
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        }
      }
      
      // Update localStorage comments with the real ID
      const finalComment = { ...comment, id: docRef.id };
      comments = comments.map((c: ProductComment) => 
        c.id === comment.id ? finalComment : c
      );
      localStorage.setItem(`product-comments-${productId}`, JSON.stringify(comments));
      
      console.log('Comment saved to Firebase with ID:', docRef.id);
      return finalComment;
    } catch (firestoreError) {
      console.error('Firestore comment save error:', firestoreError);
      // Still return the comment since we saved to localStorage
      return comment;
    }
  } catch (error) {
    console.error('Error adding product comment:', error);
    return null;
  }
};

// Helper function to format timestamps
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
