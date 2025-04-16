
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, DocumentData } from 'firebase/firestore';

// Define the coupon interface
export interface Coupon {
  id?: string;
  merchant: string;
  discount: string;
  description: string;
  code: string;
  validUntil: Date;
  createdAt?: Date;
  isActive?: boolean;
}

// Collection reference
const COUPONS_COLLECTION = 'coupons';

// Add a new coupon to Firestore
export const addCoupon = async (coupon: Omit<Coupon, 'id' | 'isActive' | 'createdAt'>): Promise<string> => {
  try {
    console.log('Adding coupon to Firebase:', coupon);
    
    const docRef = await addDoc(collection(db, COUPONS_COLLECTION), {
      ...coupon,
      validUntil: Timestamp.fromDate(coupon.validUntil),
      createdAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding coupon to Firebase:', error);
    throw error;
  }
};

// Get all coupons from Firestore
export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const couponsRef = collection(db, COUPONS_COLLECTION);
    const querySnapshot = await getDocs(couponsRef);
    
    const now = new Date();
    const coupons: Coupon[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const validUntil = data.validUntil.toDate();
      const isActive = validUntil > now;
      
      coupons.push({
        id: doc.id,
        merchant: data.merchant,
        discount: data.discount,
        description: data.description,
        code: data.code,
        validUntil: validUntil,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        isActive
      });
    });
    
    console.log(`Fetched ${coupons.length} coupons from Firebase`);
    return coupons;
  } catch (error) {
    console.error('Error fetching coupons from Firebase:', error);
    
    // Fallback to mock data if Firebase fails
    return getMockCoupons();
  }
};

// Get active coupons from Firestore
export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    const coupons = await getCoupons();
    return coupons.filter(coupon => coupon.isActive);
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return getMockCoupons().filter(coupon => coupon.isActive);
  }
};

// Get expired coupons from Firestore
export const getExpiredCoupons = async (): Promise<Coupon[]> => {
  try {
    const coupons = await getCoupons();
    return coupons.filter(coupon => !coupon.isActive);
  } catch (error) {
    console.error('Error fetching expired coupons:', error);
    return getMockCoupons().filter(coupon => !coupon.isActive);
  }
};

// API endpoint to get coupons (for external website)
export const getCouponsApi = async (req: any, res: any) => {
  try {
    const coupons = await getCoupons();
    return { coupons };
  } catch (error) {
    console.error('Error in coupons API:', error);
    return { error: 'Failed to fetch coupons' };
  }
};

// Mock data for testing or fallback
const getMockCoupons = (): Coupon[] => {
  const now = new Date();
  const pastDate = new Date(2023, 4, 31); // May 31, 2023
  const futureDate = new Date(now.getFullYear(), now.getMonth() + 2, 1); // Two months from now
  
  return [
    {
      id: '1',
      merchant: 'Amazon',
      discount: '20% OFF',
      description: 'Summer Sale Discount',
      code: 'SUMMER20',
      validUntil: futureDate,
      createdAt: new Date(2023, 5, 1),
      isActive: true
    },
    {
      id: '2',
      merchant: 'Amazon',
      discount: '20% OFF',
      description: 'Summer Sale Discount',
      code: 'SPRING15',
      validUntil: pastDate,
      createdAt: new Date(2023, 2, 1),
      isActive: false
    },
    {
      id: '3',
      merchant: 'Walmart',
      discount: '15% OFF',
      description: 'Back to School',
      code: 'SCHOOL15',
      validUntil: futureDate,
      createdAt: new Date(2023, 7, 1),
      isActive: true
    },
    {
      id: '4',
      merchant: 'Target',
      discount: '10% OFF',
      description: 'Home Essentials',
      code: 'HOME10',
      validUntil: pastDate,
      createdAt: new Date(2023, 1, 1),
      isActive: false
    }
  ];
};

// Function to seed initial coupons data if needed
export const seedCoupons = async (): Promise<void> => {
  try {
    // Check if coupons already exist
    const couponsRef = collection(db, COUPONS_COLLECTION);
    const querySnapshot = await getDocs(couponsRef);
    
    if (querySnapshot.empty) {
      console.log('Seeding initial coupons data...');
      const mockCoupons = getMockCoupons();
      
      // Add each mock coupon to Firestore
      const addPromises = mockCoupons.map(coupon => {
        const { id, isActive, ...couponData } = coupon;
        return addCoupon(couponData);
      });
      
      await Promise.all(addPromises);
      console.log('Successfully seeded coupons data');
    } else {
      console.log('Coupons collection already has data, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding coupons:', error);
  }
};
