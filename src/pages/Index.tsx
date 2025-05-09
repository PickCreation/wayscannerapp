import React, { useState, useEffect } from "react";
import ScannerCard from "@/components/ScannerCard";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import SplashScreen from "@/components/SplashScreen";
import { BellIcon, UserIcon, Utensils, Leaf, PawPrint, ShoppingBag, BookOpen, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import NotificationsPopover from "@/components/NotificationsPopover";

const Index = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("home");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      navigate(`/scan?tab=${tab}`);
    }

    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
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
    setShowCameraSheet(true);
  };

  const handleScannerClick = (type: string) => {
    const tabMap: Record<string, string> = {
      "Food": "food",
      "Plant": "plants",
      "Animal": "animals",
      "Blog": "blogs"
    };
    if (type === "Marketplace") {
      navigate("/marketplace");
      return;
    }
    if (type === "Blog") {
      navigate("/blogs");
      return;
    }
    navigate(`/scan?tab=${tabMap[type] || "food"}`);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setActiveNavItem("profile");
  };

  const handleHowItWorksClick = () => {
    navigate("/how-it-works");
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <AnimatePresence>
        {showSplash && <SplashScreen onClose={handleCloseSplash} />}
      </AnimatePresence>

      <header className="text-white py-4 px-4 flex justify-between items-center bg-white">
        <img alt="WayScanner Logo" className="h-10" src="/lovable-uploads/0d65399a-0d61-4303-b110-a67005ca7e27.png" />
        <div className="flex items-center space-x-3">
          <NotificationsPopover />
          <button className="p-2" onClick={handleProfileClick}>
            {isAuthenticated && user ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <UserIcon size={24} color="#034AFF" strokeWidth={2.5} fill="#034AFF" />
            )}
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
          <ScannerCard title="Food Scan" description="Get nutritional info" color="red" icon={<Utensils size={24} color="white" />} onClick={() => handleScannerClick("Food")} />
          <ScannerCard title="Plant Scan" description="Identify plants" color="green" icon={<Leaf size={24} color="white" />} onClick={() => handleScannerClick("Plant")} />
          <ScannerCard title="Animal Scan" description="Learn about animals" color="yellow" icon={<PawPrint size={24} color="white" />} onClick={() => handleScannerClick("Animal")} />
          <ScannerCard title="Marketplace" description="Buy and sell products" color="purple" icon={<ShoppingBag size={24} color="white" />} onClick={() => handleScannerClick("Marketplace")} />
          <ScannerCard title="Blog & Articles" description="Browse related blog articles" color="blue" icon={<BookOpen size={24} color="white" />} onClick={() => handleScannerClick("Blog")} />
        </div>
      </div>

      <div className="px-4 mb-16 flex justify-center">
        <button 
          onClick={handleHowItWorksClick}
          className="flex items-center text-blue-600 font-medium"
        >
          <HelpCircle size={18} className="mr-1" />
          How it Works?
        </button>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation activeItem={activeNavItem} onItemClick={handleNavItemClick} onCameraClick={handleCameraClick} />
    </div>
  );
};

export default Index;
