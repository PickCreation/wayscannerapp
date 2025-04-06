
import React, { useState } from "react";
import ScannerCard from "@/components/ScannerCard";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { Bell, User, Utensils, Leaf, PawPrint, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    // Don't show toast for home when already on home page
    if (item === "home") {
      return;
    }
    
    // Redirect to Forum page
    if (item === "forum") {
      navigate("/forum");
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: `The ${item} feature is under development.`,
    });
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleScannerClick = (type: string) => {
    toast({
      title: `${type} Scanner Selected`,
      description: `The ${type.toLowerCase()} scanner is under development.`,
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <div className="w-6"></div> {/* Empty div for spacing */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" 
            alt="WayScanner Logo" 
            className="h-8" 
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2">
            <Bell size={24} fill="white" strokeWidth={1.5} />
          </button>
          <button className="p-2" onClick={handleProfileClick}>
            <User size={24} fill="white" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Greeting */}
      <div className="px-4 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Hello Explorer! 👋</h2>
          <p className="text-gray-600 mt-1">What would you like to discover today?</p>
        </div>
      </div>

      {/* Scanner Options */}
      <div className="px-4 mb-8 flex flex-col h-[calc(100vh-380px)] justify-center mt-2">
        <h3 className="text-base font-medium mb-4">Start Exploring</h3>
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

      {/* Camera Sheet */}
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default Index;
