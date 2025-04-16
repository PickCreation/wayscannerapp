
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
      
      // Active coupon - valid for next month
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      
      // Expired coupon - matches the image sample (May 31, 2023)
      const pastDate = new Date("2023-05-31");
      
      // Another expired date from last month
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      
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
          validUntil: lastMonthDate
        },
        {
          code: "WELCOME10",
          discount: "10% OFF",
          description: "New User Discount",
          store: "Wayscanner",
          validUntil: futureDate
        },
        // Add the exact coupon from the image
        {
          code: "SPRING15",
          discount: "20% OFF",
          description: "Summer Sale Discount",
          store: "Amazon",
          validUntil: pastDate
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
      // Check if we need to add the specific coupon from the image
      const hasSampleExpiredCoupon = coupons.some(
        coupon => 
          coupon.store === "Amazon" && 
          coupon.discount === "20% OFF" && 
          coupon.description === "Summer Sale Discount" &&
          coupon.code === "SPRING15"
      );
      
      if (!hasSampleExpiredCoupon) {
        console.log("Adding sample expired coupon from the image");
        try {
          const pastDate = new Date("2023-05-31");
          await addCoupon({
            code: "SPRING15",
            discount: "20% OFF",
            description: "Summer Sale Discount",
            store: "Amazon",
            validUntil: pastDate
          });
          console.log("Added sample expired coupon");
        } catch (err) {
          console.error("Failed to add sample expired coupon:", err);
        }
      } else {
        console.log("Sample expired coupon already exists");
      }
      
      console.log(`Found ${coupons.length} existing coupons, skipping full seed`);
    }
  } catch (error) {
    console.error("Error in seedCoupons function:", error);
  }
};
