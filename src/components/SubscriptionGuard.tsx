
import React from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import LoginDialog from '@/components/LoginDialog';

interface SubscriptionGuardProps {
  feature: 'scan' | 'listing' | 'forum';
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ feature, children }) => {
  const { hasAccessToFeature, isInFreeTrial } = useSubscription();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  const handleUpgradeClick = () => {
    navigate('/subscription');
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg text-center h-full">
        <h3 className="text-xl font-bold mb-2">Login Required</h3>
        <p className="text-gray-600 mb-4">
          Sign in to access this feature and start your 7-day free trial.
        </p>
        <Button onClick={handleLoginClick} className="bg-wayscanner-blue">
          Login / Sign Up
        </Button>
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </div>
    );
  }

  if (!hasAccessToFeature(feature)) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg text-center h-full">
        <h3 className="text-xl font-bold mb-2">Subscription Required</h3>
        <p className="text-gray-600 mb-4">
          This feature requires a subscription to access.
          {isInFreeTrial && " Your free trial has ended."}
        </p>
        <Button onClick={handleUpgradeClick} className="bg-wayscanner-blue">
          Upgrade Now
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
