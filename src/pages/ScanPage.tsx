import React, { useState, useEffect } from "react";
import { ChevronLeft, Search, Utensils, Flower, PawPrint } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate, useLocation } from "react-router-dom";
import FoodScanTab from "@/components/FoodScanTab";
import PlantScanTab from "@/components/PlantScanTab";
import AnimalScanTab from "@/components/AnimalScanTab";
import CameraSheet from "@/components/CameraSheet";
import EditPreferencesSheet from "@/components/EditPreferencesSheet";
import HowWeScoreSheet from "@/components/HowWeScoreSheet";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

const ScanPage = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [activeTab, setActiveTab] = useState("food");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [howWeScoreOpen, setHowWeScoreOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useFirebaseAuth();

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
    setCameraSheetOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/scan?tab=${value}`);
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-medium">Scan Results</h1>
      </header>

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

      <div className="p-4">
        {activeTab === "food" && (
          <FoodScanTab 
            onEditPreferences={() => setEditPreferencesOpen(true)}
            onHowWeScore={() => setHowWeScoreOpen(true)} 
          />
        )}
        {activeTab === "plants" && <PlantScanTab />}
        {activeTab === "animals" && <AnimalScanTab />}
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />

      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
      
      <EditPreferencesSheet 
        open={editPreferencesOpen} 
        onOpenChange={setEditPreferencesOpen} 
        onSave={() => {}} 
      />
      
      <HowWeScoreSheet 
        open={howWeScoreOpen} 
        onOpenChange={setHowWeScoreOpen} 
      />
    </div>
  );
};

export default ScanPage;
