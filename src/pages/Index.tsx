
import React, { useState, useEffect } from "react";
import ScannerCard from "@/components/ScannerCard";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import CameraActionSheet from "@/components/CameraActionSheet";
import SplashScreen from "@/components/SplashScreen";
import { Bell, User, Utensils, Leaf, PawPrint, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("home");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [showCameraActionSheet, setShowCameraActionSheet] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    
    if (tab) {
      navigate(`/scan?tab=${tab}`);
    }
    
    // Check if we've shown the splash screen before in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      // Set session storage so we only show it once per session
      sessionStorage.setItem("hasSeenSplash", "true");
    }
  }, [location, navigate]);

  const handleCloseSplash = () => {
    setShowSplash(false);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
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
    
    if (item === "profile") {
      navigate("/profile");
      return;
    }
  };

  const handleCameraClick = () => {
    // Instead of opening camera sheet directly, show the options first
    setShowCameraActionSheet(true);
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

  const handleScanClick = (type: "food" | "plant" | "animal") => {
    const tabMap: Record<string, string> = {
      "food": "food",
      "plant": "plants",
      "animal": "animals"
    };
    
    navigate(`/scan?tab=${tabMap[type]}`);
    setShowCameraActionSheet(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setActiveNavItem("profile");
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <AnimatePresence>
        {showSplash && <SplashScreen onClose={handleCloseSplash} />}
      </AnimatePresence>

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
      <CameraActionSheet 
        open={showCameraActionSheet} 
        onOpenChange={setShowCameraActionSheet} 
        onScanClick={handleScanClick}
      />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default Index;
