import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, Edit, Lock, Store, Bookmark, Heart, 
  ShoppingCart, Truck, Ticket, Globe, HelpCircle, Info, 
  Shield, LogOut, FileText, ChevronRight, User,
  CreditCard, MapPin, Package, MessageSquare, Crown,
  LogIn
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/hooks/use-auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleBackButton = () => {
      navigate("/");
      return true;
    };

    if (isMobile) {
      document.addEventListener('backbutton', handleBackButton);
    }

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
    if (!isAuthenticated && ['Bookmarks', 'Favorites', 'Cart', 'Orders', 'Purchases', 'Addresses', 
                             'Payment Methods', 'Edit Profile'].includes(item)) {
      setShowLoginDialog(true);
      return;
    }
    
    if (item === "Bookmarks") {
      navigate("/bookmarks");
      return;
    }
    
    if (item === "Favorites") {
      navigate("/favorites");
      return;
    }
    
    if (item === "Cart") {
      navigate("/cart");
      return;
    }
    
    if (item === "Orders") {
      navigate("/orders");
      return;
    }

    if (item === "Purchases") {
      navigate("/purchases");
      return;
    }

    if (item === "Addresses") {
      navigate("/addresses");
      return;
    }

    if (item === "Payment Methods") {
      navigate("/payment-methods");
      return;
    }
    
    if (item === "Edit Profile") {
      navigate("/edit-profile");
      return;
    }
    
    if (item === "Change Password") {
      navigate("/change-password");
      return;
    }
    
    if (item === "Language") {
      navigate("/language-settings");
      return;
    }
    
    if (item === "Help") {
      navigate("/help-center");
      return;
    }
    
    if (item === "About") {
      navigate("/about");
      return;
    }
    
    if (item === "Privacy") {
      navigate("/privacy-policy");
      return;
    }
    
    if (item === "Terms") {
      navigate("/terms-of-use");
      return;
    }

    if (item === "Submit Ticket") {
      navigate("/submit-ticket");
      return;
    }

    toast({
      title: "Coming Soon",
      description: `The ${item} feature is under development.`,
    });
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    } else if (item === "profile") {
      navigate("/profile");
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleUpgradeClick = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    navigate("/subscription");
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col items-center pb-3">
          <Avatar className="w-16 h-16 border-4 border-white mb-1">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white text-gray-400">
              <User size={30} />
            </AvatarFallback>
          </Avatar>
          {isAuthenticated ? (
            <>
              <h2 className="text-base font-bold mb-0">{user?.name || "User"}</h2>
              <p className="mb-1">{user?.email || "user@example.com"}</p>
            </>
          ) : (
            <div className="text-center mt-2">
              <Button 
                variant="outline" 
                className="bg-white text-wayscanner-blue hover:bg-blue-50 border-none" 
                onClick={handleLoginClick}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Button>
              <p className="text-sm mt-2 opacity-80">Login to access all features</p>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated ? (
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
      ) : (
        <div className="py-4 px-4 bg-gray-50 border-b">
          <p className="text-center text-gray-600">
            Create an account to access all features and track your activities
          </p>
        </div>
      )}

      {/* Upgrade Button */}
      <div className="px-4 my-3">
        <button 
          onClick={handleUpgradeClick}
          className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white py-3 px-4 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <Crown className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Upgrade Now!</h3>
              <p className="text-sm">Unlock full benefits with Pro!</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

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
          icon={<Package className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Purchases" 
          description="View your purchase history"
          onClick={() => handleMenuItemClick("Purchases")}
        />
        
        <ProfileMenuItem 
          icon={<Ticket className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Coupons" 
          description="Discount coupons and offers"
          onClick={() => handleMenuItemClick("Coupons")}
        />
      </div>

      <div className="px-4 pb-2">
        <h3 className="text-base font-semibold mb-3">Payment & Shipping</h3>
        
        <ProfileMenuItem 
          icon={<MapPin className="h-5 w-5 text-wayscanner-blue" />} 
          title="My Addresses" 
          description="Manage your shipping addresses"
          onClick={() => handleMenuItemClick("Addresses")}
        />
        
        <ProfileMenuItem 
          icon={<CreditCard className="h-5 w-5 text-wayscanner-blue" />} 
          title="Payment Methods" 
          description="Manage your payment options"
          onClick={() => handleMenuItemClick("Payment Methods")}
        />
      </div>

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
          icon={<MessageSquare className="h-5 w-5 text-wayscanner-blue" />} 
          title="Submit Ticket" 
          description="Contact our support team directly"
          onClick={() => handleMenuItemClick("Submit Ticket")}
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

      <div className="px-4 pb-28 mt-4 flex flex-col">
        {isAuthenticated ? (
          <>
            <Button 
              className="bg-wayscanner-blue hover:bg-blue-700 w-full py-6 rounded-lg flex items-center justify-center gap-2 mb-4"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base font-semibold">Log Out</span>
            </Button>
            
            <button 
              className="text-red-500 text-center font-semibold text-base mt-2 pb-2"
              onClick={() => handleMenuItemClick("Delete Account")}
            >
              Delete Account
            </button>
          </>
        ) : (
          <Button 
            className="bg-wayscanner-blue hover:bg-blue-700 w-full py-6 rounded-lg flex items-center justify-center gap-2 mb-4"
            onClick={handleLoginClick}
          >
            <LogIn className="h-5 w-5" />
            <span className="text-base font-semibold">Login / Sign Up</span>
          </Button>
        )}
      </div>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem="profile"
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
      type="button"
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
