
import React from "react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Utensils, Flower, PawPrint, Pencil, ShoppingCart } from "lucide-react";

interface CameraSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CameraSheet: React.FC<CameraSheetProps> = ({ open, onOpenChange }) => {
  return (
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
          <h3 className="text-xl text-gray-600 mb-4">Scan</h3>
          <div className="flex justify-between">
            <ScanOption icon={<Utensils className="h-8 w-8 text-[#B04B7D]" />} label="Food" color="bg-pink-100" />
            <ScanOption icon={<Flower className="h-8 w-8 text-[#34A67F]" />} label="Plant" color="bg-green-100" />
            <ScanOption icon={<PawPrint className="h-8 w-8 text-[#E67E22]" />} label="Animal" color="bg-orange-100" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl text-gray-600 mb-4">Other Actions</h3>
          <Button className="w-full h-14 bg-black hover:bg-gray-800 justify-center px-6 py-4 text-lg rounded-xl" variant="default">
            <Pencil className="mr-4 h-6 w-6" />
            Create Post
          </Button>
          <Button className="w-full h-14 bg-[#1E88E5] hover:bg-[#1976D2] justify-center px-6 py-4 text-lg rounded-xl" variant="default">
            <ShoppingCart className="mr-4 h-6 w-6" />
            Sell Something
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

interface ScanOptionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const ScanOption: React.FC<ScanOptionProps> = ({ icon, label, color }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`${color} rounded-full w-20 h-20 flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <span className="text-lg font-medium" style={{ color: label === "Food" ? "#B04B7D" : label === "Plant" ? "#34A67F" : "#E67E22" }}>
        {label}
      </span>
    </div>
  );
};

export default CameraSheet;
