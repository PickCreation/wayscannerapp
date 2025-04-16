
import { getCoupons, Coupon } from './couponService';

// Simple in-memory cache
let couponsCache: Coupon[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const getCouponsForApi = async (): Promise<{ coupons: Coupon[] } | { error: string }> => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (couponsCache && (now - lastCacheTime < CACHE_DURATION)) {
      return { coupons: couponsCache };
    }
    
    // If no valid cache, fetch fresh data
    const coupons = await getCoupons();
    
    // Update cache
    couponsCache = coupons;
    lastCacheTime = now;
    
    return { coupons };
  } catch (error) {
    console.error('Error in coupons API:', error);
    return { error: 'Failed to fetch coupons' };
  }
};

// For use with Express.js or similar
export const handleCouponsApiRequest = async (req: any, res: any) => {
  const result = await getCouponsForApi();
  
  if ('error' in result) {
    return res.status(500).json(result);
  }
  
  return res.status(200).json(result);
};

// Function to get active coupons only for API
export const getActiveCouponsForApi = async (): Promise<{ coupons: Coupon[] } | { error: string }> => {
  try {
    const result = await getCouponsForApi();
    
    if ('error' in result) {
      return result;
    }
    
    return {
      coupons: result.coupons.filter(coupon => coupon.isActive)
    };
  } catch (error) {
    console.error('Error in active coupons API:', error);
    return { error: 'Failed to fetch active coupons' };
  }
};

// Function to format coupons for external API
export const formatCouponsForExternalApi = (coupons: Coupon[]) => {
  return coupons.map(coupon => ({
    id: coupon.id,
    merchant: coupon.merchant,
    discount: coupon.discount,
    description: coupon.description,
    code: coupon.code,
    validUntil: coupon.validUntil.toISOString(),
    isActive: coupon.isActive
  }));
};
