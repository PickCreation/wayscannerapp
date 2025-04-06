
import React, { useState } from "react";
import ScannerCard from "@/components/ScannerCard";
import BottomNavigation from "@/components/BottomNavigation";
import { Bell, User, Utensil, Leaf, PawPrint, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    toast({
      title: "Coming Soon",
      description: `The ${item} feature is under development.`,
    });
  };

  const handleCameraClick = () => {
    toast({
      title: "Camera Activated",
      description: "The camera feature is under development.",
    });
  };

  const handleScannerClick = (type: string) => {
    toast({
      title: `${type} Scanner Selected`,
      description: `The ${type.toLowerCase()} scanner is under development.`,
    });
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">WayScanner</h1>
        <button className="p-2">
          <Bell size={24} />
        </button>
      </header>

      {/* Greeting */}
      <div className="px-4 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Hello Explorer! 👋</h2>
          <p className="text-gray-600 mt-1">What would you like to discover today?</p>
        </div>
        <div className="bg-gray-100 rounded-full p-4">
          <User size={28} className="text-wayscanner-blue" />
        </div>
      </div>

      {/* Scanner Options */}
      <div className="px-4 mb-8">
        <h3 className="text-2xl font-bold mb-4">Start Exploring</h3>
        <div className="grid grid-cols-2 gap-4">
          <ScannerCard
            title="Food Scanner"
            description="Get nutritional info & health rating"
            color="red"
            icon={<Utensil size={24} color="white" />}
            onClick={() => handleScannerClick("Food")}
          />
          <ScannerCard
            title="Plant Scanner"
            description="Identify plants & care instructions"
            color="green"
            icon={<Leaf size={24} color="white" />}
            onClick={() => handleScannerClick("Plant")}
          />
          <ScannerCard
            title="Animal Scanner"
            description="Learn about animals & safety"
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

      {/* Recent Scans */}
      <div className="px-4">
        <h3 className="text-2xl font-bold mb-4">Recent Scans</h3>
        <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center">
          <p className="text-gray-500">No recent scans yet</p>
        </div>
      </div>

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
