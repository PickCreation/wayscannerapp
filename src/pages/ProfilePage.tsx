
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Settings,
  User,
  Heart,
  Map,
  CreditCard,
  Package,
  HelpCircle,
  Info,
  LogOut,
  MessageSquare,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Load profile image from localStorage if available
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      icon: <User size={20} />,
      title: "Edit Profile",
      onClick: () => navigate("/edit-profile"),
    },
    {
      icon: <Heart size={20} />,
      title: "Favorites",
      onClick: () => navigate("/favorites"),
    },
    {
      icon: <Map size={20} />,
      title: "Addresses",
      onClick: () => navigate("/addresses"),
    },
    {
      icon: <CreditCard size={20} />,
      title: "Payment Methods",
      onClick: () => navigate("/payment-methods"),
    },
    {
      icon: <Package size={20} />,
      title: "Orders",
      onClick: () => navigate("/orders"),
    },
    {
      icon: <Ticket size={20} />,
      title: "My Coupons",
      onClick: () => navigate("/coupons"),
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Messages",
      onClick: () => navigate("/profile/messages"),
    },
    {
      icon: <Settings size={20} />,
      title: "Language Settings",
      onClick: () => navigate("/language-settings"),
    },
    {
      icon: <HelpCircle size={20} />,
      title: "Help Center",
      onClick: () => navigate("/help-center"),
    },
    {
      icon: <Info size={20} />,
      title: "About",
      onClick: () => navigate("/about"),
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to WayScanner</h1>
            <p className="text-gray-500 mb-6">
              Please log in to access your profile
            </p>
            <Button
              onClick={() => setIsLoginDialogOpen(true)}
              className="w-full"
            >
              Log in
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Why Sign Up?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-600">
                  Save your favorite products and recipes
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-600">
                  Track your orders and purchases
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations
                </p>
              </li>
            </ul>
          </div>
        </div>

        <LoginDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
        />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="container max-w-md mx-auto px-4 py-8 mb-16">
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold mb-1">{user?.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100 mb-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center w-full py-3 px-4 hover:bg-gray-50 transition-colors"
            >
              <span className="w-8 text-gray-500">{item.icon}</span>
              <span className="flex-1 text-left">{item.title}</span>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Log out
        </Button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
