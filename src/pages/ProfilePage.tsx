
import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, Edit, Lock, Store, Bookmark, Heart, 
  ShoppingCart, Truck, Ticket, Globe, HelpCircle, Info, 
  Shield, LogOut, FileText, ChevronRight, User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");

  // Handle native back functionality
  useEffect(() => {
    // Function to handle hardware back button press
    const handleBackButton = () => {
      navigate("/");
      return true; // Prevent default behavior
    };

    // Only add listeners on mobile devices
    if (isMobile) {
      // For Android, add event listener for hardware back button
      document.addEventListener('backbutton', handleBackButton);
    }

    // Cleanup
    return () => {
      if (isMobile) {
        document.removeEventListener('backbutton', handleBackButton);
      }
    };
  }, [navigate, isMobile]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleMenuItemClick = (item: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${item} feature is under development.`,
    });
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else {
      toast({
        title: "Coming Soon",
        description: `The ${item} feature is under development.`,
      });
    }
  };

  const handleCameraClick = () => {
    toast({
      title: "Camera",
      description: "The camera feature is under development.",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold" style={{ 
            fontSize: '16px',
            marginLeft: isMobile ? '0' : 'auto',
            marginRight: isMobile ? '0' : 'auto'
          }}>My Profile</h1>
          <div className="w-10"></div> {/* Placeholder to maintain centering */}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center pb-3">
          <Avatar className="w-16 h-16 border-4 border-white mb-1">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white text-gray-400">
              <User size={30} />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-base font-bold mb-0">John Doe</h2>
          <p className="mb-1">johndoe@example.com</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around py-3">
        <div className="text-center">
          <p className="text-base font-bold text-wayscanner-blue">127</p>
          <p className="text-[13px] text-[#6E6E6E]">Followers</p>
        </div>
        <div className="text-center border-x border-gray-200 px-8">
          <p className="text-base font-bold text-wayscanner-blue">15</p>
          <p className="text-[13px] text-[#6E6E6E]">Sales</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-wayscanner-blue">32</p>
          <p className="text-[13px] text-[#6E6E6E]">Reviews</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold mb-3">Account Settings</h3>
        
        <ProfileMenuItem 
          icon={<Edit className="h-5 w-5 text-wayscanner-blue" />} 
          title="Edit Profile" 
          description="Update your personal information"
          onClick={() => handleMenuItemClick("Edit Profile")}
        />
        
        <ProfileMenuItem 
          icon={<Lock className="h-5 w-5 text-wayscanner-blue" />} 
          title="Change Password" 
          description="Update your password"
          onClick={() => handleMenuItemClick("Change Password")}
        />
        
        <ProfileMenuItem 
          icon={<Store className="h-5 w-5 text-wayscanner-blue" />} 
          title="Seller Dashboard" 
          description="Manage your store and products"
          onClick={() => handleMenuItemClick("Seller Dashboard")}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold mb-3">Content</h3>
        
        <ProfileMenuItem 
          icon={<Bookmark className="h-5 w-5 text-wayscanner-blue" />} 
          title="Bookmarks" 
          description="Your saved content"
          onClick={() => handleMenuItemClick("Bookmarks")}
        />
        
        <ProfileMenuItem 
          icon={<Heart className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Favorites" 
          description="Products you love"
          onClick={() => handleMenuItemClick("Favorites")}
        />
        
        <ProfileMenuItem 
          icon={<ShoppingCart className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Cart" 
          description="Items in your shopping cart"
          onClick={() => handleMenuItemClick("Cart")}
        />
        
        <ProfileMenuItem 
          icon={<Truck className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Orders" 
          description="Track your orders"
          onClick={() => handleMenuItemClick("Orders")}
        />
        
        <ProfileMenuItem 
          icon={<Ticket className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Coupons" 
          description="Discount coupons and offers"
          onClick={() => handleMenuItemClick("Coupons")}
        />
      </div>

      {/* Preferences & Support */}
      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold mb-3">Preferences & Support</h3>
        
        <ProfileMenuItem 
          icon={<Globe className="h-5 w-5 text-wayscanner-blue" />} 
          title="Language" 
          description="Change app language"
          onClick={() => handleMenuItemClick("Language")}
        />
        
        <ProfileMenuItem 
          icon={<HelpCircle className="h-5 w-5 text-wayscanner-blue" />} 
          title="Help Center" 
          description="Get support and assistance"
          onClick={() => handleMenuItemClick("Help")}
        />
        
        <ProfileMenuItem 
          icon={<Info className="h-5 w-5 text-wayscanner-blue" />} 
          title="About" 
          description="App information and version"
          onClick={() => handleMenuItemClick("About")}
        />
        
        <ProfileMenuItem 
          icon={<Shield className="h-5 w-5 text-wayscanner-blue" />} 
          title="Privacy Policy" 
          description="How we handle your data"
          onClick={() => handleMenuItemClick("Privacy")}
        />
        
        <ProfileMenuItem 
          icon={<FileText className="h-5 w-5 text-wayscanner-blue" />} 
          title="Terms of Use" 
          description="Terms and conditions"
          onClick={() => handleMenuItemClick("Terms")}
        />
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-10 mt-4 flex flex-col"> {/* Changed pb-40 to pb-10 to reduce padding */}
        <Button 
          className="bg-wayscanner-blue hover:bg-blue-700 w-full py-6 rounded-lg flex items-center justify-center gap-2 mb-4"
          onClick={() => handleMenuItemClick("Logout")}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-base font-semibold">Log Out</span>
        </Button>
        
        <button 
          className="text-red-500 text-center font-semibold text-base"
          onClick={() => handleMenuItemClick("Delete Account")}
        >
          Delete Account
        </button>
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

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ProfileMenuItem = ({ icon, title, description, onClick }: ProfileMenuItemProps) => {
  return (
    <button 
      className="flex items-center w-full py-3"
      onClick={onClick}
    >
      <div className="bg-blue-50 rounded-full p-3 mr-3">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="font-semibold text-base text-black">{title}</h4>
        <p className="text-[13px] text-[#6E6E6E]">{description}</p>
      </div>
      <div className="text-gray-400">
        <ChevronRight size={20} />
      </div>
    </button>
  );
};

export default ProfilePage;
