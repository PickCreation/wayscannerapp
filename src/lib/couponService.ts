
import { db } from "./firebase";
import { collection, getDocs, query, where, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export interface Coupon {
  id?: string;
  code: string;
  discount: string;
  description: string;
  store: string;
  validUntil: Date;
  isActive: boolean;
}

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const couponsRef = collection(db, "coupons");
    const snapshot = await getDocs(couponsRef);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        discount: data.discount,
        description: data.description,
        store: data.store,
        validUntil: data.validUntil?.toDate() || new Date(),
        isActive: new Date() < (data.validUntil?.toDate() || new Date())
      };
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    // Instead of using the validUntil field in the query which might be causing issues,
    // let's get all coupons and filter them in the client
    const couponsRef = collection(db, "coupons");
    const snapshot = await getDocs(couponsRef);
    const now = new Date();
    
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const validUntil = data.validUntil?.toDate() || new Date();
        const isActive = now < validUntil;
        
        return {
          id: doc.id,
          code: data.code,
          discount: data.discount,
          description: data.description,
          store: data.store,
          validUntil: validUntil,
          isActive: isActive
        };
      })
      .filter(coupon => coupon.isActive);
  } catch (error) {
    console.error("Error fetching active coupons:", error);
    return [];
  }
};

export const getExpiredCoupons = async (): Promise<Coupon[]> => {
  try {
    // Same approach as getActiveCoupons, but filtering for expired ones
    const couponsRef = collection(db, "coupons");
    const snapshot = await getDocs(couponsRef);
    const now = new Date();
    
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const validUntil = data.validUntil?.toDate() || new Date();
        const isActive = now < validUntil;
        
        return {
          id: doc.id,
          code: data.code,
          discount: data.discount,
          description: data.description,
          store: data.store,
          validUntil: validUntil,
          isActive: isActive
        };
      })
      .filter(coupon => !coupon.isActive);
  } catch (error) {
    console.error("Error fetching expired coupons:", error);
    return [];
  }
};

export const addCoupon = async (coupon: Omit<Coupon, 'id' | 'isActive'>): Promise<string | null> => {
  try {
    const couponsRef = collection(db, "coupons");
    const docRef = await addDoc(couponsRef, {
      ...coupon,
      validUntil: Timestamp.fromDate(coupon.validUntil),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding coupon:", error);
    return null;
  }
};

// Seed some initial coupons if none exist
export const seedCoupons = async (): Promise<void> => {
  try {
    const coupons = await getCoupons();
    
    if (coupons.length === 0) {
      console.log("No coupons found, seeding initial data");
      
      const now = new Date();
      
      // Active coupon - valid for next month
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      
      // Expired coupon - expired last month
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      
      const initialCoupons = [
        {
          code: "SUMMER20",
          discount: "20% OFF",
          description: "Summer Sale Discount",
          store: "Amazon",
          validUntil: futureDate
        },
        {
          code: "SPRING15",
          discount: "15% OFF",
          description: "Spring Season Discount",
          store: "eBay",
          validUntil: pastDate
        },
        {
          code: "WELCOME10",
          discount: "10% OFF",
          description: "New User Discount",
          store: "Wayscanner",
          validUntil: futureDate
        }
      ];
      
      // Add coupons one by one with proper error handling
      for (const couponData of initialCoupons) {
        try {
          await addCoupon(couponData);
          console.log(`Added coupon: ${couponData.code}`);
        } catch (err) {
          console.error(`Failed to add coupon ${couponData.code}:`, err);
        }
      }
      
      console.log("Finished seeding coupons");
    } else {
      console.log(`Found ${coupons.length} existing coupons, skipping seed`);
    }
  } catch (error) {
    console.error("Error in seedCoupons function:", error);
  }
};
