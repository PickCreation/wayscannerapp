
import { db } from "./firebase";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";

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
        validUntil: data.validUntil?.toDate(),
        isActive: new Date() < data.validUntil?.toDate()
      };
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    const couponsRef = collection(db, "coupons");
    const q = query(couponsRef, where("validUntil", ">", new Date()));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        discount: data.discount,
        description: data.description,
        store: data.store,
        validUntil: data.validUntil?.toDate(),
        isActive: true
      };
    });
  } catch (error) {
    console.error("Error fetching active coupons:", error);
    return [];
  }
};

export const getExpiredCoupons = async (): Promise<Coupon[]> => {
  try {
    const couponsRef = collection(db, "coupons");
    const q = query(couponsRef, where("validUntil", "<=", new Date()));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        discount: data.discount,
        description: data.description,
        store: data.store,
        validUntil: data.validUntil?.toDate(),
        isActive: false
      };
    });
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
      const now = new Date();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      
      await addCoupon({
        code: "SUMMER20",
        discount: "20% OFF",
        description: "Summer Sale Discount",
        store: "Amazon",
        validUntil: futureDate
      });
      
      await addCoupon({
        code: "SPRING15",
        discount: "20% OFF",
        description: "Summer Sale Discount",
        store: "Amazon",
        validUntil: pastDate
      });

      await addCoupon({
        code: "WELCOME10",
        discount: "10% OFF",
        description: "New User Discount",
        store: "Wayscanner",
        validUntil: futureDate
      });
    }
  } catch (error) {
    console.error("Error seeding coupons:", error);
  }
};
