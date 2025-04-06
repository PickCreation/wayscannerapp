
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, AlertTriangle, Search } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import FoodScanTab from "@/components/FoodScanTab";
import PlantScanTab from "@/components/PlantScanTab";
import AnimalScanTab from "@/components/AnimalScanTab";

const ScanPage = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const navigate = useNavigate();

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

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Scan Results</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <Search size={24} color="white" />
        </div>
      </header>

      {/* Scan Tabs */}
      <Tabs defaultValue="food" className="w-full">
        <TabsList className="w-full flex justify-between border-b mb-4">
          <TabsTrigger 
            value="food" 
            className="flex flex-col items-center py-4 px-8 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <svg className="mb-1" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H4C3.44772 12 3 12.4477 3 13V20C3 20.5523 3.44772 21 4 21H6C6.55228 21 7 20.5523 7 20V13C7 12.4477 6.55228 12 6 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${document.querySelector('[data-state="active"][value="food"]') ? "#1E88E5" : "none"}`}/>
              <path d="M14 4H12C11.4477 4 11 4.44772 11 5V20C11 20.5523 11.4477 21 12 21H14C14.5523 21 15 20.5523 15 20V5C15 4.44772 14.5523 4 14 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${document.querySelector('[data-state="active"][value="food"]') ? "#1E88E5" : "none"}`}/>
              <path d="M20 8H18C17.4477 8 17 8.44772 17 9V20C17 20.5523 17.4477 21 18 21H20C20.5523 21 21 20.5523 21 20V9C21 8.44772 20.5523 8 20 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${document.querySelector('[data-state="active"][value="food"]') ? "#1E88E5" : "none"}`}/>
              <path d="M3 12L7 8M7 8L7 4C7 4 8.5 3 10 3C11.5 3 13 4 13 4V8L17 8M17 8L21 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Food</span>
          </TabsTrigger>
          <TabsTrigger 
            value="plants" 
            className="flex flex-col items-center py-4 px-8 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <svg className="mb-1" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V6L12 2L4 6V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${document.querySelector('[data-state="active"][value="plants"]') ? "#1E88E5" : "none"}`}/>
              <path d="M12 8C9.5 12 10.5 16 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8C14.5 12 13.5 16 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2C12 2 6 5 6 9C6 13 12 16 12 16C12 16 18 13 18 9C18 5 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Plants</span>
          </TabsTrigger>
          <TabsTrigger 
            value="animals" 
            className="flex flex-col items-center py-4 px-8 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            <svg className="mb-1" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 9L8 11V14L12 16L16 14V11L20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${document.querySelector('[data-state="active"][value="animals"]') ? "#1E88E5" : "none"}`}/>
              <path d="M12 16V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V11L12 13L8 11V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
