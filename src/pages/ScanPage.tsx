
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Search, Utensils, Flower, PawPrint } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate, useLocation } from "react-router-dom";
import FoodScanTab from "@/components/FoodScanTab";
import PlantScanTab from "@/components/PlantScanTab";
import AnimalScanTab from "@/components/AnimalScanTab";

const ScanPage = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [activeTab, setActiveTab] = useState("food");
  const navigate = useNavigate();
  const location = useLocation();

  // Get the tab from URL on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    }
  };

  const handleCameraClick = () => {
    // This opens the camera sheet for scanning
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL when tab changes
    navigate(`/scan?tab=${value}`);
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-lg font-medium text-[20px]">Scan Results</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <Search size={24} color="white" />
        </div>
      </header>

      {/* Scan Tabs - Redesigned to match forum page style */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 px-2 flex flex-col items-center ${
            activeTab === "food" 
              ? "text-wayscanner-blue border-b-2 border-wayscanner-blue" 
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("food")}
        >
          <Utensils 
            size={22} 
            className={activeTab === "food" ? "text-wayscanner-blue mb-1" : "text-gray-500 mb-1"} 
          />
          <span className="text-sm font-medium">Food</span>
        </button>
        
        <button
          className={`flex-1 py-3 px-2 flex flex-col items-center ${
            activeTab === "plants" 
              ? "text-wayscanner-green border-b-2 border-wayscanner-green" 
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("plants")}
        >
          <Flower 
            size={22} 
            className={activeTab === "plants" ? "text-wayscanner-green mb-1" : "text-gray-500 mb-1"} 
          />
          <span className="text-sm font-medium">Plants</span>
        </button>
        
        <button
          className={`flex-1 py-3 px-2 flex flex-col items-center ${
            activeTab === "animals" 
              ? "text-wayscanner-red border-b-2 border-wayscanner-red" 
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("animals")}
        >
          <PawPrint 
            size={22} 
            className={activeTab === "animals" ? "text-wayscanner-red mb-1" : "text-gray-500 mb-1"} 
          />
          <span className="text-sm font-medium">Animals</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "food" && <FoodScanTab />}
        {activeTab === "plants" && <PlantScanTab />}
        {activeTab === "animals" && <AnimalScanTab />}
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

export default ScanPage;
