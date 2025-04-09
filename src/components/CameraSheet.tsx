
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Utensils, Flower, PawPrint, Pencil, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import LoginDialog from "@/components/LoginDialog";

interface CameraSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfilePhotoSelect?: (file: File) => void;
  isProfilePhoto?: boolean;
}

const CameraSheet: React.FC<CameraSheetProps> = ({ 
  open, 
  onOpenChange, 
  onProfilePhotoSelect,
  isProfilePhoto = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    onOpenChange(false);
    navigate("/forum");
    // This will trigger CreatePostSheet directly when forum page loads
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openCreatePost'));
    }, 100);
  };

  const handleSellSomething = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    onOpenChange(false);
    navigate("/add-listing");
  };

  const handleScanOption = (type: string) => {
    onOpenChange(false);
    
    if (type === "Animal") {
      navigate("/scan-camera", { state: { scanType: "animal" } });
      return;
    }
    
    if (type === "Food") {
      navigate("/food-scan-camera");
      return;
    }
    
    const tabMap: Record<string, string> = {
      "Food": "food",
      "Plant": "plants",
      "Animal": "animals"
    };
    
    navigate(`/scan?tab=${tabMap[type] || "food"}`);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="p-6 pt-0 max-h-[90vh]">
          <div className="absolute right-4 top-4">
            <DrawerClose className="rounded-full p-2 hover:bg-gray-100">
              <X className="h-6 w-6 text-gray-500" />
            </DrawerClose>
          </div>
          
          <div className="text-center mb-8 mt-6">
            <h2 className="text-xl font-semibold">What would you like to do?</h2>
          </div>
          
          <div className="mb-8">
            <h3 className="text-base text-gray-600 mb-4">Scan</h3>
            <div className="flex justify-between">
              <ScanOption 
                icon={<Utensils className="h-6 w-6 text-[#B04B7D]" />} 
                label="Food" 
                color="bg-pink-100" 
                onClick={() => handleScanOption("Food")}
              />
              <ScanOption 
                icon={<Flower className="h-6 w-6 text-[#34A67F]" />} 
                label="Plant" 
                color="bg-green-100" 
                onClick={() => handleScanOption("Plant")}
              />
              <ScanOption 
                icon={<PawPrint className="h-6 w-6 text-[#E67E22]" />} 
                label="Animal" 
                color="bg-orange-100" 
                onClick={() => handleScanOption("Animal")}
              />
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h3 className="text-base text-gray-600 mb-4">Other Actions</h3>
            <Button 
              className="w-full h-14 bg-black hover:bg-gray-800 justify-center px-6 py-4 text-lg rounded-xl" 
              variant="default"
              onClick={handleCreatePost}
            >
              <Pencil className="mr-4 h-6 w-6" />
              Create Post
            </Button>
            <Button 
              className="w-full h-14 bg-[#1E88E5] hover:bg-[#1976D2] justify-center px-6 py-4 text-lg rounded-xl" 
              variant="default"
              onClick={handleSellSomething}
            >
              <ShoppingCart className="mr-4 h-6 w-6" />
              Sell Something
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </>
  );
};

interface ScanOptionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
}

const ScanOption: React.FC<ScanOptionProps> = ({ icon, label, color, onClick }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      <div className={`${color} rounded-full w-16 h-16 flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <span className="text-base font-medium" style={{ color: label === "Food" ? "#B04B7D" : label === "Plant" ? "#34A67F" : "#E67E22" }}>
        {label}
      </span>
    </div>
  );
};

export default CameraSheet;
