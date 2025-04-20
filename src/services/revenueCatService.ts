
import Purchases, { PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { REVENUECAT_API_KEY } from '@/config/constants';

// Initialize RevenueCat
export const initializeRevenueCat = async () => {
  try {
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      // Optional: configure with user ID if user is logged in
      // appUserID: "user-id-from-your-system"
    });
    console.log('RevenueCat initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    return false;
  }
};

// Get current subscription status
export const getSubscriptionStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return hasActiveSubscription(customerInfo);
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return false;
  }
};

// Check if user is within 7-day free trial
export const isInFreeTrial = async (): Promise<boolean> => {
  try {
    // Get user creation date from your auth system
    const userCreationDate = getUserCreationDate();
    if (!userCreationDate) return false;
    
    const now = new Date();
    const trialEndDate = new Date(userCreationDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    
    return now < trialEndDate;
  } catch (error) {
    console.error('Failed to check free trial status:', error);
    return false;
  }
};

// Get available packages
export const getAvailablePackages = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('Failed to get available packages:', error);
    return [];
  }
};

// Purchase a package
export const purchasePackage = async (packageToPurchase: PurchasesPackage): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ 
      package: packageToPurchase 
    });
    return hasActiveSubscription(customerInfo);
  } catch (error) {
    console.error('Failed to purchase package:', error);
    return false;
  }
};

// Restore purchases
export const restorePurchases = async (): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return hasActiveSubscription(customerInfo);
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    return false;
  }
};

// Helper function to check if user has active subscription
const hasActiveSubscription = (customerInfo: CustomerInfo): boolean => {
  // This depends on your entitlement identifier in RevenueCat
  return customerInfo.entitlements.active['premium_access'] !== undefined;
};

// Helper function to get user creation date
const getUserCreationDate = (): Date | null => {
  // In a real app, get this from your auth system
  // For now, we'll use localStorage as a simple example
  const userDataStr = localStorage.getItem('userData');
  if (userDataStr) {
    const userData = JSON.parse(userDataStr);
    if (userData.createdAt) {
      return new Date(userData.createdAt);
    }
  }
  return null;
};

// Set user ID (call this after login)
export const setRevenueCatUserId = async (userId: string) => {
  try {
    await Purchases.logIn({ appUserID: userId });
    console.log('RevenueCat user ID set successfully');
    return true;
  } catch (error) {
    console.error('Failed to set RevenueCat user ID:', error);
    return false;
  }
};
