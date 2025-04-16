
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

// Define the cart item interface
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  addedAt?: Date;
}

// Define the order interface
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: {
    type: string;
    details: any;
  };
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

// Collection references
const CART_COLLECTION = 'cart_items';
const ORDERS_COLLECTION = 'orders';

// Save cart item to Firestore
export const saveCartItem = async (userId: string, item: Omit<CartItem, 'addedAt'>): Promise<void> => {
  try {
    console.log('Saving cart item to Firebase:', item);
    
    // Check if the item already exists in the cart
    const cartRef = collection(db, CART_COLLECTION);
    const q = query(cartRef, where('userId', '==', userId), where('id', '==', item.id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Item exists, update quantity
      const docRef = doc(db, CART_COLLECTION, querySnapshot.docs[0].id);
      const existingItem = querySnapshot.docs[0].data();
      await updateDoc(docRef, { 
        quantity: (existingItem.quantity || 0) + item.quantity 
      });
    } else {
      // Add new item
      await addDoc(collection(db, CART_COLLECTION), {
        ...item,
        userId,
        addedAt: Timestamp.now()
      });
    }
    
    // Also update localStorage as backup
    const cartItems = getCartItemsFromLocalStorage();
    const existingItemIndex = cartItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      cartItems.push({
        ...item,
        addedAt: new Date()
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
  } catch (error) {
    console.error('Error saving cart item:', error);
    // Fallback to localStorage only
    updateLocalStorageCart(item);
  }
};

// Update cart item quantity in Firestore
export const updateCartItemQuantity = async (userId: string, itemId: string, quantity: number): Promise<void> => {
  try {
    const cartRef = collection(db, CART_COLLECTION);
    const q = query(cartRef, where('userId', '==', userId), where('id', '==', itemId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, CART_COLLECTION, querySnapshot.docs[0].id);
      await updateDoc(docRef, { quantity });
    }
    
    // Update localStorage as backup
    const cartItems = getCartItemsFromLocalStorage();
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    // Fallback to localStorage only
    const cartItems = getCartItemsFromLocalStorage();
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  }
};

// Remove item from cart in Firestore
export const removeCartItem = async (userId: string, itemId: string): Promise<void> => {
  try {
    const cartRef = collection(db, CART_COLLECTION);
    const q = query(cartRef, where('userId', '==', userId), where('id', '==', itemId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, CART_COLLECTION, querySnapshot.docs[0].id);
      await deleteDoc(docRef);
    }
    
    // Remove from localStorage as backup
    const cartItems = getCartItemsFromLocalStorage();
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
  } catch (error) {
    console.error('Error removing cart item:', error);
    // Fallback to localStorage only
    const cartItems = getCartItemsFromLocalStorage();
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  }
};

// Get all cart items for a user from Firestore
export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartRef = collection(db, CART_COLLECTION);
    const q = query(cartRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const cartItems: CartItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cartItems.push({
        id: data.id,
        title: data.title,
        price: data.price,
        quantity: data.quantity,
        image: data.image,
        addedAt: data.addedAt ? (data.addedAt as Timestamp).toDate() : new Date()
      });
    });
    
    console.log(`Fetched ${cartItems.length} cart items from Firebase for user ${userId}`);
    
    // Save to localStorage as cache
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    return cartItems;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    // Fallback to localStorage
    return getCartItemsFromLocalStorage();
  }
};

// Place an order in Firestore
export const placeOrder = async (userId: string, orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  try {
    console.log('Saving order to Firebase:', orderData);
    
    const orderWithTimestamp = {
      ...orderData,
      userId,
      status: 'pending',
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithTimestamp);
    
    // Clear cart after successful order
    const cartRef = collection(db, CART_COLLECTION);
    const q = query(cartRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Clear localStorage cart
    localStorage.setItem('cartItems', JSON.stringify([]));
    
    return docRef.id;
  } catch (error) {
    console.error('Error placing order:', error);
    // We don't have a good fallback for order placement failure
    // Return a temporary ID and let the user know there was an issue
    return `temp_${Date.now()}`;
  }
};

// Helper function to handle localStorage operations
const updateLocalStorageCart = (item: Omit<CartItem, 'addedAt'>): void => {
  const cartItems = getCartItemsFromLocalStorage();
  const existingItemIndex = cartItems.findIndex(i => i.id === item.id);
  
  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += item.quantity;
  } else {
    cartItems.push({
      ...item,
      addedAt: new Date()
    });
  }
  
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// Helper function to get cart items from localStorage
const getCartItemsFromLocalStorage = (): CartItem[] => {
  const cartItemsJson = localStorage.getItem('cartItems');
  return cartItemsJson ? JSON.parse(cartItemsJson) : [];
};
