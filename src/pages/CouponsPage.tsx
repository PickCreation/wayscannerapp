
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import CouponCard from "@/components/CouponCard";
import { Coupon, getActiveCoupons, getExpiredCoupons, seedCoupons } from "@/lib/couponService";
import { Skeleton } from "@/components/ui/skeleton";

const CouponsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [expiredCoupons, setExpiredCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("CouponsPage: Starting to fetch coupons...");
        
        // First seed coupons if there are none
        await seedCoupons();
        console.log("CouponsPage: Seed coupons complete");
        
        // Then fetch active and expired coupons
        const active = await getActiveCoupons();
        console.log(`CouponsPage: Fetched ${active.length} active coupons`);
        
        const expired = await getExpiredCoupons();
        console.log(`CouponsPage: Fetched ${expired.length} expired coupons`);
        
        setActiveCoupons(active);
        setExpiredCoupons(expired);
      } catch (error) {
        console.error("Error in fetchCoupons:", error);
        setError("Failed to load coupons. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load coupons. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [toast]);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    } else if (item === "profile") {
      navigate("/profile");
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="rounded-2xl p-5 my-3 relative overflow-hidden bg-gray-100">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-full mb-5" />
        <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between">
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    ));
  };

  // For debugging
  console.log("CouponsPage render state:", {
    isLoading,
    error,
    activeCouponsCount: activeCoupons.length,
    expiredCouponsCount: expiredCoupons.length
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold" style={{ 
            fontSize: '16px',
            marginLeft: isMobile ? '0' : 'auto',
            marginRight: isMobile ? '0' : 'auto'
          }}>My Coupons</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              renderSkeletons()
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Reload Page
                </button>
              </div>
            ) : activeCoupons.length > 0 ? (
              activeCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No active coupons available.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Try Again
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="expired">
            {isLoading ? (
              renderSkeletons()
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Reload Page
                </button>
              </div>
            ) : expiredCoupons.length > 0 ? (
              expiredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No expired coupons.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Try Again
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
      
      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default CouponsPage;
