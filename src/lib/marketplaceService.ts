
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

// Define the Product interface
export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  createdAt?: Date;
  seller?: string;
  color?: string;
  condition?: string;
  weight?: string;
  brand?: string;
  country?: string;
  tags?: string[];
}

// Collection reference
const PRODUCTS_COLLECTION = 'products';

// Save product to Firestore
export const saveProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    console.log('Saving product to Firebase:', product);
    
    // Add timestamp
    const productWithTimestamp = {
      ...product,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productWithTimestamp);
    
    // Return the saved product with the generated ID
    const savedProduct: Product = {
      id: docRef.id,
      ...product,
      createdAt: new Date()
    };
    
    console.log('Product saved successfully with ID:', docRef.id);
    
    // Also save to localStorage as fallback
    saveProductToLocalStorage(savedProduct);
    
    return savedProduct;
  } catch (error) {
    console.error('Error saving product:', error);
    // Fallback to localStorage if Firebase fails
    const savedProduct = saveProductToLocalStorage({
      ...product,
      id: `local_${Date.now()}`,
      createdAt: new Date()
    });
    return savedProduct;
  }
};

// Get all products from Firestore
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching all products from Firebase');
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        title: data.title,
        price: data.price,
        category: data.category,
        description: data.description,
        image: data.image,
        images: data.images,
        rating: data.rating,
        reviews: data.reviews,
        stock: data.stock,
        seller: data.seller,
        color: data.color,
        condition: data.condition,
        weight: data.weight,
        brand: data.brand,
        country: data.country,
        tags: data.tags,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
      });
    });
    
    console.log(`Fetched ${products.length} products from Firebase`);
    
    // Save to localStorage as cache
    localStorage.setItem('products', JSON.stringify(products));
    
    return products;
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    return getProductsFromLocalStorage();
  }
};

// Get a single product from Firestore
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product with ID: ${productId} from Firebase`);
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        price: data.price,
        category: data.category,
        description: data.description,
        image: data.image,
        images: data.images,
        rating: data.rating,
        reviews: data.reviews,
        stock: data.stock,
        seller: data.seller,
        color: data.color,
        condition: data.condition,
        weight: data.weight,
        brand: data.brand,
        country: data.country,
        tags: data.tags,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
      };
    } else {
      console.log(`No product found with ID: ${productId}`);
      // Try from localStorage
      return getProductByIdFromLocalStorage(productId);
    }
  } catch (error) {
    console.error(`Error fetching product with ID: ${productId}:`, error);
    // Fallback to localStorage
    return getProductByIdFromLocalStorage(productId);
  }
};

// LocalStorage fallback methods
const saveProductToLocalStorage = (product: Product): Product => {
  const products = getProductsFromLocalStorage();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem('products', JSON.stringify(products));
  console.log('Product saved to localStorage:', product);
  return product;
};

const getProductsFromLocalStorage = (): Product[] => {
  const productsJson = localStorage.getItem('products');
  return productsJson ? JSON.parse(productsJson) : [];
};

const getProductByIdFromLocalStorage = (productId: string): Product | null => {
  const products = getProductsFromLocalStorage();
  return products.find(p => p.id === productId) || null;
};
