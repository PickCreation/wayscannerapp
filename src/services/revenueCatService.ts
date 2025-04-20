
// This is a mock implementation of RevenueCat for web development
// In a real app, you would integrate with actual RevenueCat SDKs on native platforms

import { SUBSCRIPTION_PRODUCT_IDS } from '@/config/constants';

// Types to simulate RevenueCat SDK
export interface CustomerInfo {
  entitlements: {
    active: Record<string, unknown>;
  };
}

export interface PurchasesPackage {
  identifier: string;
  offeringIdentifier: string;
  product: {
    price: number;
    priceString: string;
    title: string;
    description: string;
  };
}

// Mock RevenueCat singleton
const Purchases = {
  async configure({ apiKey }: { apiKey: string }): Promise<void> {
    console.log('Mock RevenueCat configured with API key:', apiKey);
    // Store that RevenueCat was initialized
    localStorage.setItem('revenueCatInitialized', 'true');
  },

  async getCustomerInfo(): Promise<CustomerInfo> {
    // Check if user has a stored subscription
    const hasSubscription = localStorage.getItem('revenueCatSubscription') === 'active';
    return {
      entitlements: {
        active: hasSubscription ? { 'premium_access': {} } : {}
      }
    };
  },

  async getOfferings(): Promise<{ current: { availablePackages: PurchasesPackage[] } | null }> {
    // Create mock packages based on your product IDs
    const packages: PurchasesPackage[] = [
      {
        identifier: SUBSCRIPTION_PRODUCT_IDS.WEEKLY,
        offeringIdentifier: 'default',
        product: {
          price: 5.99,
          priceString: '$5.99',
          title: 'Weekly Subscription',
          description: 'Access premium features for one week'
        }
      },
      {
        identifier: SUBSCRIPTION_PRODUCT_IDS.MONTHLY,
        offeringIdentifier: 'default',
        product: {
          price: 15.99,
          priceString: '$15.99',
          title: 'Monthly Subscription',
          description: 'Access premium features for one month'
        }
      },
      {
        identifier: SUBSCRIPTION_PRODUCT_IDS.ANNUAL,
        offeringIdentifier: 'default',
        product: {
          price: 170.99,
          priceString: '$170.99',
          title: 'Annual Subscription',
          description: 'Access premium features for one year'
        }
      }
    ];

    return {
      current: {
        availablePackages: packages
      }
    };
  },

  async purchasePackage({ package: pkg }: { package: PurchasesPackage }): Promise<{ customerInfo: CustomerInfo }> {
    // In a real app, this would trigger the platform's payment flow
    console.log(`Purchasing package: ${pkg.identifier}`);
    
    // Simulate successful purchase
    localStorage.setItem('revenueCatSubscription', 'active');
    localStorage.setItem('revenueCatSubscriptionType', pkg.identifier);
    localStorage.setItem('revenueCatSubscriptionDate', new Date().toISOString());
    
    return {
      customerInfo: {
        entitlements: {
          active: { 'premium_access': {} }
        }
      }
    };
  },

  async restorePurchases(): Promise<{ customerInfo: CustomerInfo }> {
    console.log('Restoring purchases...');
    // Just return current state in this mock
    const hasSubscription = localStorage.getItem('revenueCatSubscription') === 'active';
    
    return {
      customerInfo: {
        entitlements: {
          active: hasSubscription ? { 'premium_access': {} } : {}
        }
      }
    };
  },

  async logIn({ appUserID }: { appUserID: string }): Promise<void> {
    console.log('Setting RevenueCat user ID:', appUserID);
    localStorage.setItem('revenueCatUserId', appUserID);
  }
};

// Initialize RevenueCat
export const initializeRevenueCat = async (): Promise<boolean> => {
  try {
    await Purchases.configure({
      apiKey: 'mock-api-key-for-web'
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
export const setRevenueCatUserId = async (userId: string): Promise<boolean> => {
  try {
    await Purchases.logIn({ appUserID: userId });
    console.log('RevenueCat user ID set successfully');
    return true;
  } catch (error) {
    console.error('Failed to set RevenueCat user ID:', error);
    return false;
  }
};
