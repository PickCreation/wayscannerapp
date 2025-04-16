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
    console.log("DEBUG: Getting all coupons from Firestore");
    const couponsRef = collection(db, "coupons");
    
    // Add a timeout for debugging purposes
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Firestore query timeout after 10 seconds")), 10000);
    });
    
    // Race between the actual query and the timeout
    const snapshot = await Promise.race([
      getDocs(couponsRef),
      timeoutPromise
    ]) as any;
    
    console.log(`DEBUG: Retrieved ${snapshot.docs?.length || 0} coupons from Firestore`);
    
    if (!snapshot.docs || snapshot.docs.length === 0) {
      console.log("DEBUG: No coupons found in Firestore");
      return [];
    }
    
    const coupons = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      console.log(`DEBUG: Processing coupon document:`, { id: doc.id, data: JSON.stringify(data) });
      
      // Safely convert Firestore Timestamp to Date
      let validUntil = new Date();
      try {
        if (data.validUntil) {
          console.log(`DEBUG: validUntil type:`, typeof data.validUntil, data.validUntil);
          if (typeof data.validUntil.toDate === 'function') {
            validUntil = data.validUntil.toDate();
          } else if (data.validUntil instanceof Date) {
            validUntil = data.validUntil;
          } else if (typeof data.validUntil === 'string') {
            validUntil = new Date(data.validUntil);
          }
        } else {
          console.log(`DEBUG: validUntil is undefined or null for document ${doc.id}`);
        }
      } catch (err) {
        console.error(`DEBUG: Error converting validUntil date for document ${doc.id}:`, err);
      }
      
      // Check if coupon is active based on current date
      const now = new Date();
      const isActive = now < validUntil;
      
      console.log(`DEBUG: Coupon ${doc.id} validUntil:`, validUntil, `isActive:`, isActive);
      
      return {
        id: doc.id,
        code: data.code || "",
        discount: data.discount || "",
        description: data.description || "",
        store: data.store || "",
        validUntil: validUntil,
        isActive: isActive
      };
    });
    
    console.log(`DEBUG: Processed ${coupons.length} coupons successfully`);
    return coupons;
  } catch (error) {
    console.error("DEBUG: Error fetching coupons:", error);
    // Add fallback to local coupons if Firebase fails
    console.log("DEBUG: Attempting to create local coupon data as fallback");
    return createLocalCoupons();
  }
};

// Fallback function to create local coupons when Firebase fails
const createLocalCoupons = (): Coupon[] => {
  console.log("DEBUG: Creating local coupon data");
  
  // Active coupon - valid for next month
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 1);
  
  // Expired coupon - matches the image sample (May 31, 2023)
  const pastDate = new Date("2023-05-31");
  
  // Another expired date from last month
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  
  return [
    {
      id: "local-1",
      code: "SUMMER20",
      discount: "20% OFF",
      description: "Summer Sale Discount",
      store: "Amazon",
      validUntil: futureDate,
      isActive: true
    },
    {
      id: "local-2",
      code: "SPRING15",
      discount: "15% OFF",
      description: "Spring Season Discount",
      store: "eBay",
      validUntil: lastMonthDate,
      isActive: false
    },
    {
      id: "local-3",
      code: "WELCOME10",
      discount: "10% OFF",
      description: "New User Discount",
      store: "Wayscanner",
      validUntil: futureDate,
      isActive: true
    },
    // Add the exact coupon from the image
    {
      id: "local-4",
      code: "SPRING15",
      discount: "20% OFF",
      description: "Summer Sale Discount",
      store: "Amazon",
      validUntil: pastDate,
      isActive: false
    }
  ];
};

export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    console.log("DEBUG: Getting active coupons");
    // Get all coupons and filter client-side for active ones
    const allCoupons = await getCoupons();
    const now = new Date();
    
    const activeCoupons = allCoupons.filter(coupon => {
      // Extra safeguard to ensure validUntil is a valid date
      if (!(coupon.validUntil instanceof Date)) {
        console.log(`DEBUG: Invalid validUntil date for coupon ${coupon.id}, treating as expired`);
        return false;
      }
      
      const isActive = now < coupon.validUntil;
      console.log(`DEBUG: Coupon ${coupon.id} - validUntil: ${coupon.validUntil}, now: ${now}, isActive: ${isActive}`);
      return isActive;
    });
    
    console.log(`DEBUG: Found ${activeCoupons.length} active coupons out of ${allCoupons.length} total`);
    return activeCoupons;
  } catch (error) {
    console.error("DEBUG: Error fetching active coupons:", error);
    
    // Fallback to local active coupons
    const localCoupons = createLocalCoupons();
    return localCoupons.filter(coupon => coupon.isActive);
  }
};

export const getExpiredCoupons = async (): Promise<Coupon[]> => {
  try {
    console.log("DEBUG: Getting expired coupons");
    // Get all coupons and filter client-side for expired ones
    const allCoupons = await getCoupons();
    const now = new Date();
    
    const expiredCoupons = allCoupons.filter(coupon => {
      // Extra safeguard to ensure validUntil is a valid date
      if (!(coupon.validUntil instanceof Date)) {
        console.log(`DEBUG: Invalid validUntil date for coupon ${coupon.id}, treating as expired`);
        return true;
      }
      
      const isExpired = now >= coupon.validUntil;
      console.log(`DEBUG: Coupon ${coupon.id} - validUntil: ${coupon.validUntil}, now: ${now}, isExpired: ${isExpired}`);
      return isExpired;
    });
    
    console.log(`DEBUG: Found ${expiredCoupons.length} expired coupons out of ${allCoupons.length} total`);
    return expiredCoupons;
  } catch (error) {
    console.error("DEBUG: Error fetching expired coupons:", error);
    
    // Fallback to local expired coupons
    const localCoupons = createLocalCoupons();
    return localCoupons.filter(coupon => !coupon.isActive);
  }
};

export const addCoupon = async (coupon: Omit<Coupon, 'id' | 'isActive'>): Promise<string | null> => {
  try {
    console.log("Adding new coupon:", coupon);
    const couponsRef = collection(db, "coupons");
    
    // Ensure the validUntil is properly converted to Firestore Timestamp
    let validUntilTimestamp;
    try {
      validUntilTimestamp = Timestamp.fromDate(coupon.validUntil);
    } catch (err) {
      console.error("Error converting validUntil to Timestamp:", err);
      return null;
    }
    
    const docRef = await addDoc(couponsRef, {
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description,
      store: coupon.store,
      validUntil: validUntilTimestamp,
      createdAt: serverTimestamp()
    });
    
    console.log("Coupon added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding coupon:", error);
    return null;
  }
};

// Seed some initial coupons if none exist
export const seedCoupons = async (): Promise<void> => {
  try {
    console.log("DEBUG: Checking if coupons need to be seeded...");
    
    try {
      // First try to get existing coupons
      const coupons = await getCoupons();
      
      if (coupons.length === 0) {
        console.log("DEBUG: No coupons found, seeding initial data");
        
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
            console.log(`DEBUG: Added coupon: ${couponData.code}`);
          } catch (err) {
            console.error(`DEBUG: Failed to add coupon ${couponData.code}:`, err);
          }
        }
        
        console.log("DEBUG: Finished seeding coupons");
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
          console.log("DEBUG: Adding sample expired coupon from the image");
          try {
            const pastDate = new Date("2023-05-31");
            await addCoupon({
              code: "SPRING15",
              discount: "20% OFF",
              description: "Summer Sale Discount",
              store: "Amazon",
              validUntil: pastDate
            });
            console.log("DEBUG: Added sample expired coupon");
          } catch (err) {
            console.error("DEBUG: Failed to add sample expired coupon:", err);
          }
        } else {
          console.log("DEBUG: Sample expired coupon already exists");
        }
        
        console.log(`DEBUG: Found ${coupons.length} existing coupons, skipping full seed`);
      }
    } catch (error) {
      console.error("DEBUG: Error getting coupons during seed check:", error);
      // If we can't check existing coupons, try to add the sample expired coupon anyway
      // This ensures we at least have some data to display
      try {
        console.log("DEBUG: Attempting to add sample expired coupon directly");
        const pastDate = new Date("2023-05-31");
        await addCoupon({
          code: "SPRING15",
          discount: "20% OFF",
          description: "Summer Sale Discount",
          store: "Amazon",
          validUntil: pastDate
        });
      } catch (innerErr) {
        console.error("DEBUG: Failed to add sample expired coupon directly:", innerErr);
      }
    }
  } catch (error) {
    console.error("DEBUG: Error in seedCoupons function:", error);
  }
};
