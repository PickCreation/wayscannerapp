import { Platform } from 'react-native';

// RevenueCat Configuration
export const REVENUECAT_API_KEY = 
  // On iOS
  Platform.OS === 'ios' 
    ? 'YOUR_IOS_REVENUECAT_API_KEY' 
    // On Android
    : 'YOUR_ANDROID_REVENUECAT_API_KEY';

// RevenueCat Product IDs
export const SUBSCRIPTION_PRODUCT_IDS = {
  WEEKLY: 'weekly_subscription',
  MONTHLY: 'monthly_subscription',
  ANNUAL: 'annual_subscription',
};

// Other app constants can be added here
