import React, { useState, useEffect } from "react";
import ScannerCard from "@/components/ScannerCard";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { Bell, User, Utensils, Leaf, PawPrint, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    
    if (tab) {
      navigate(`/scan?tab=${tab}`);
    }
  }, [location, navigate]);

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      return;
    }
    
    if (item === "forum") {
      navigate("/forum");
      return;
    }
    
    if (item === "recipes") {
      navigate("/recipes");
      return;
    }
    
    if (item === "shop") {
      navigate("/marketplace");
      return;
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleScannerClick = (type: string) => {
    const tabMap: Record<string, string> = {
      "Food": "food",
      "Plant": "plants",
      "Animal": "animals"
    };
    
    if (type === "Marketplace") {
      navigate("/marketplace");
      return;
    }
    
    navigate(`/scan?tab=${tabMap[type] || "food"}`);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <img 
          src="/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" 
          alt="WayScanner Logo" 
          className="h-10" 
        />
        <div className="flex items-center space-x-3">
          <button className="p-2">
            <Bell size={24} fill="white" strokeWidth={1.5} />
          </button>
          <button className="p-2" onClick={handleProfileClick}>
            <User size={24} fill="white" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="px-4 py-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hello Explorer! 👋</h2>
          <p className="text-gray-600 mt-2 text-base">What would you like to discover today?</p>
        </div>
      </div>

      <div className="px-4 mb-8 flex flex-col justify-center mt-4">
        <h3 className="text-lg font-medium mb-4">Start Exploring</h3>
        <div className="grid grid-cols-2 gap-4">
          <ScannerCard
            title="Food Scan"
            description="Get nutritional info"
            color="red"
            icon={<Utensils size={24} color="white" />}
            onClick={() => handleScannerClick("Food")}
          />
          <ScannerCard
            title="Plant Scan"
            description="Identify plants"
            color="green"
            icon={<Leaf size={24} color="white" />}
            onClick={() => handleScannerClick("Plant")}
          />
          <ScannerCard
            title="Animal Scan"
            description="Learn about animals"
            color="yellow"
            icon={<PawPrint size={24} color="white" />}
            onClick={() => handleScannerClick("Animal")}
          />
          <ScannerCard
            title="Marketplace"
            description="Buy and sell products"
            color="purple"
            icon={<ShoppingBag size={24} color="white" />}
            onClick={() => handleScannerClick("Marketplace")}
          />
        </div>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default Index;
