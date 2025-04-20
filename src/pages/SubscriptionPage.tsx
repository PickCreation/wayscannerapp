
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Apple, Flower, Dog, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [restoringPurchase, setRestoringPurchase] = useState(false);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handlePlanSelection = (plan: string) => {
    // If the plan is already selected, deselect it
    if (selectedPlan === plan) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan(plan);
    }
  };

  const handleGetStarted = () => {
    if (!selectedPlan) {
      toast({
        title: "Select a Plan",
        description: "Please select a subscription plan to continue.",
        variant: "destructive"
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubscription = () => {
    setShowConfirmDialog(false);
    toast({
      title: "Subscription Activated",
      description: `Your ${selectedPlan} plan has been activated successfully!`,
    });
    navigate("/profile");
  };

  const handleRestorePurchase = () => {
    setRestoringPurchase(true);
    
    // Simulate purchase restoration
    setTimeout(() => {
      setRestoringPurchase(false);
      toast({
        title: "Purchase Restored",
        description: "Your previous subscription has been restored successfully.",
      });
    }, 2000);
    
    // In a real app, you would use platform-specific code:
    // For iOS: StoreKit APIs
    // For Android: Google Play Billing Library
    // This would typically be handled through Capacitor plugins or similar
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 text-white">
      <header className="relative p-4 flex items-center justify-end">
        <div className="w-10"></div>
      </header>

      <div className="absolute top-3 right-3">
        <button onClick={handleBackClick} className="p-2 text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pt-6 pb-8 overflow-auto">
        <div 
          className="bg-black/20 text-white px-4 py-1 rounded-full text-sm mb-6 cursor-pointer"
          onClick={handleRestorePurchase}
        >
          {restoringPurchase ? "Restoring..." : "Restore Purchase"}
        </div>

        <h1 className="text-3xl font-bold mb-2">Go Premium</h1>
        <h2 className="text-lg mb-1">Scan Smarter</h2>
        <p className="mb-5 text-center text-white/90 text-sm">Learn more!</p>

        <p className="text-center mb-6 max-w-xs text-sm">
          Scan food, plants, and animals with no limits, engage in community forum, 
          shop and sell in marketplace, and earn store coupons every 5 scans.
        </p>

        <div className="flex justify-center space-x-6 mb-6">
          <Apple className="w-7 h-7" />
          <Flower className="w-7 h-7" />
          <Dog className="w-7 h-7" />
        </div>

        {/* Weekly Plan */}
        <div 
          className={`w-full bg-green-700 p-4 rounded-lg mb-4 relative ${selectedPlan === 'Weekly' ? 'ring-2 ring-white' : ''}`}
          onClick={() => handlePlanSelection('Weekly')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">Weekly Plan</h3>
              <p className="text-xl font-bold mb-1">$5.99 / 7 days</p>
              <p className="text-yellow-300 text-xs mb-2">
                Scan food endlessly, community forum, and earn store coupons every 5 scans.
              </p>
              <p className="text-xs">Great for short-term or casual use.</p>
            </div>
            <div className="min-w-6 min-h-6 w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center bg-black/10">
              {selectedPlan === 'Weekly' && <Check className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Monthly Plan */}
        <div 
          className={`w-full bg-white text-blue-900 p-4 rounded-lg mb-4 relative ${selectedPlan === 'Monthly' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handlePlanSelection('Monthly')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">Monthly</h3>
              <p className="text-xl font-bold mb-1">$15.99 / monthly</p>
              <p className="text-blue-600 text-xs mb-2">
                All weekly features included, offering better value for regular users.
              </p>
              <p className="text-xs text-gray-700">Perfect for ongoing learners and explorers.</p>
            </div>
            <div className="min-w-6 min-h-6 w-6 h-6 border-2 border-blue-900 rounded-sm flex items-center justify-center bg-black/5">
              {selectedPlan === 'Monthly' && <Check className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Annual Plan */}
        <div 
          className={`w-full bg-purple-800 p-4 rounded-lg mb-4 relative ${selectedPlan === 'Annual' ? 'ring-2 ring-white' : ''}`}
          onClick={() => handlePlanSelection('Annual')}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="bg-black/20 rounded-full p-1">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Annual Plan</h3>
                <p className="text-xl font-bold mb-1">$170.99 / year</p>
                <p className="text-xs mb-2">
                  Get unlimited access to all premium features.
                </p>
                <p className="text-base font-bold">Save $100 annually!</p>
              </div>
            </div>
            <div className="min-w-6 min-h-6 w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center bg-black/10">
              {selectedPlan === 'Annual' && <Check className="w-4 h-4" />}
            </div>
          </div>
        </div>

        <p className="text-center mb-6 text-sm">Cancel anytime</p>

        <Button 
          onClick={handleGetStarted}
          className="w-full bg-[#034AFF] hover:bg-blue-700 text-white text-lg font-semibold py-6"
          style={{ backgroundColor: "#034AFF" }}
        >
          Get Started
        </Button>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Confirm Subscription</DialogTitle>
          <DialogDescription>
            You're about to subscribe to the {selectedPlan} plan. This is a demo and no actual charges will be made.
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmSubscription}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
