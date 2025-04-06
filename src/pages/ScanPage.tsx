
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
        <h1 className="text-xl font-semibold">Scan Results</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <Search size={24} color="white" />
        </div>
      </header>

      {/* Scan Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex justify-between border-b mb-4">
          <TabsTrigger 
            value="food" 
            className="flex flex-col items-center py-4 px-6 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <Utensils className="mb-1" size={24} />
            <span className="text-sm font-medium">Food</span>
          </TabsTrigger>
          <TabsTrigger 
            value="plants" 
            className="flex flex-col items-center py-4 px-6 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <Flower className="mb-1" size={24} />
            <span className="text-sm font-medium">Plants</span>
          </TabsTrigger>
          <TabsTrigger 
            value="animals" 
            className="flex flex-col items-center py-4 px-6 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <PawPrint className="mb-1" size={24} />
            <span className="text-sm font-medium">Animals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="food" className="px-4">
          <FoodScanTab />
        </TabsContent>
        <TabsContent value="plants" className="px-4">
          <PlantScanTab />
        </TabsContent>
        <TabsContent value="animals" className="px-4">
          <AnimalScanTab />
        </TabsContent>
      </Tabs>

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
