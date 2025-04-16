
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import CouponCard from "@/components/CouponCard";
import { 
  Coupon, 
  getActiveCoupons, 
  getExpiredCoupons, 
  seedCoupons 
} from "@/lib/couponService";

const CouponsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [expiredCoupons, setExpiredCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        // First seed coupons if there are none
        await seedCoupons();
        
        // Then fetch active and expired coupons
        const active = await getActiveCoupons();
        const expired = await getExpiredCoupons();
        
        setActiveCoupons(active);
        setExpiredCoupons(expired);
      } catch (error) {
        console.error("Error fetching coupons:", error);
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
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wayscanner-blue"></div>
              </div>
            ) : activeCoupons.length > 0 ? (
              activeCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No active coupons available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="expired">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wayscanner-blue"></div>
              </div>
            ) : expiredCoupons.length > 0 ? (
              expiredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No expired coupons.</p>
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
