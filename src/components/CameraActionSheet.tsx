
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Pen, ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CameraActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanClick: (type: "food" | "plant" | "animal") => void;
}

const CameraActionSheet = ({ open, onOpenChange, onScanClick }: CameraActionSheetProps) => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    const createPostEvent = new Event('openCreatePost');
    window.dispatchEvent(createPostEvent);
    onOpenChange(false);
  };

  const handleSellSomething = () => {
    navigate("/add-listing");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80%] p-0 overflow-hidden rounded-t-xl">
        <SheetHeader className="px-4 pt-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-bold">
              What would you like to do?
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="rounded-full h-8 w-8"
            >
              <X size={18} />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full px-4 py-6">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Scan</h3>
          
          <div className="flex justify-between mb-8">
            <button 
              className="flex flex-col items-center" 
              onClick={() => onScanClick("food")}
            >
              <div className="bg-pink-100 rounded-full w-24 h-24 flex items-center justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 15L4 13M12 9L10 7M18 15L16 13M12 15L10 13M8 9L6 7" stroke="#D33A8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-medium text-pink-600">Food</span>
            </button>
            
            <button 
              className="flex flex-col items-center" 
              onClick={() => onScanClick("plant")}
            >
              <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C12 8.4 8.4 12 4 12M12 4C12 8.4 15.6 12 20 12M12 4V20" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-medium text-green-600">Plant</span>
            </button>
            
            <button 
              className="flex flex-col items-center" 
              onClick={() => onScanClick("animal")}
            >
              <div className="bg-orange-50 rounded-full w-24 h-24 flex items-center justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 8L8 9M16 8L18 9M9 15C9 16.6569 10.3431 18 12 18C13.6569 18 15 16.6569 15 15" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="19" cy="8" r="2" stroke="#F39C12" strokeWidth="1.5"/>
                  <circle cx="5" cy="8" r="2" stroke="#F39C12" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="text-lg font-medium text-orange-500">Animal</span>
            </button>
          </div>
          
          <h3 className="text-xl font-medium text-gray-600 mb-4">Other Actions</h3>
          
          <Button 
            className="w-full bg-black text-white py-6 flex items-center justify-center mb-4 rounded-xl"
            onClick={handleCreatePost}
          >
            <Pen className="mr-3 h-5 w-5" />
            <span className="text-lg">Create Post</span>
          </Button>
          
          <Button 
            className="w-full bg-blue-500 text-white py-6 flex items-center justify-center rounded-xl"
            onClick={handleSellSomething}
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            <span className="text-lg">Sell Something</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CameraActionSheet;
