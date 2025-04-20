
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  initializeRevenueCat, 
  getSubscriptionStatus, 
  isInFreeTrial,
  setRevenueCatUserId
} from '@/services/revenueCatService';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isInFreeTrial: boolean;
  isLoading: boolean;
  hasAccessToFeature: (feature: 'scan' | 'listing' | 'forum') => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isInFreeTrial: false,
  isLoading: true,
  hasAccessToFeature: () => false,
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isFreeTrialActive, setIsFreeTrialActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const setupSubscription = async () => {
      setIsLoading(true);
      
      try {
        // Initialize RevenueCat
        await initializeRevenueCat();
        
        // If user is logged in, set the user ID in RevenueCat
        if (isAuthenticated && user) {
          await setRevenueCatUserId(user.id);
        }
        
        // Check subscription status
        const subscriptionActive = await getSubscriptionStatus();
        setIsSubscribed(subscriptionActive);
        
        // Check free trial status if not subscribed
        if (!subscriptionActive && isAuthenticated) {
          const trialActive = await isInFreeTrial();
          setIsFreeTrialActive(trialActive);
        } else {
          setIsFreeTrialActive(false);
        }
      } catch (error) {
        console.error('Error setting up subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupSubscription();
  }, [isAuthenticated, user]);

  const hasAccessToFeature = (feature: 'scan' | 'listing' | 'forum'): boolean => {
    // Logic to determine if user has access to specific features
    if (isSubscribed) return true; // Subscribers have access to all features
    
    if (isFreeTrialActive) {
      // During free trial, users can access all features
      return true;
    }
    
    // For non-subscribers outside of trial:
    if (feature === 'listing') {
      // Anyone can list products for free
      return true;
    }
    
    if (feature === 'forum') {
      // Anyone can post for free
      return true;
    }
    
    // For scan feature, require subscription or free trial
    return false;
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isSubscribed, 
        isInFreeTrial: isFreeTrialActive, 
        isLoading,
        hasAccessToFeature
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
