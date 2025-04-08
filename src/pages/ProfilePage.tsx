
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import LoginDialog from "@/components/LoginDialog";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleMenuItemClick = (item: string) => {
    if (!isAuthenticated && ['Bookmarks', 'Favorites', 'Cart', 'Orders', 'Purchases', 'Addresses', 
                           'Payment Methods', 'Edit Profile', 'Seller Dashboard', 'Messages',
                           'My Blog Posts', 'Saved Articles', 'Write New Post'].includes(item)) {
      setShowLoginDialog(true);
      return;
    }
    
    // Handle blog-related menu items
    if (item === "My Blog Posts") {
      navigate("/blog/my-posts");
      return;
    }
    
    if (item === "Saved Articles") {
      navigate("/blog/saved-articles");
      return;
    }
    
    if (item === "Write New Post") {
      navigate("/blog/write-post");
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

    if (item === "Seller Dashboard") {
      navigate("/seller-dashboard");
      return;
    }
    
    if (item === "Messages") {
      navigate("/profile/messages");
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: `The ${item} feature is under development.`,
    });
  };

  // Complete the component with UI elements
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {/* Account Management Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Edit Profile")}
            >
              Edit Profile
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Change Password")}
            >
              Change Password
            </div>
          </div>
        </div>
        
        {/* Blog and Articles Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Blog and Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("My Blog Posts")}
            >
              My Blog Posts
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Saved Articles")}
            >
              Saved Articles
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Write New Post")}
            >
              Write New Post
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Bookmarks")}
            >
              Bookmarks
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Favorites")}
            >
              Favorites
            </div>
          </div>
        </div>
        
        {/* Shopping Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Shopping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Cart")}
            >
              Cart
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Orders")}
            >
              Orders
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Purchases")}
            >
              Purchases
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Addresses")}
            >
              Addresses
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Payment Methods")}
            >
              Payment Methods
            </div>
          </div>
        </div>
        
        {/* Seller Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Seller Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Seller Dashboard")}
            >
              Seller Dashboard
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Messages")}
            >
              Messages
            </div>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Help")}
            >
              Help Center
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Submit Ticket")}
            >
              Submit Ticket
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("About")}
            >
              About Us
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Privacy")}
            >
              Privacy Policy
            </div>
            <div 
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleMenuItemClick("Terms")}
            >
              Terms of Use
            </div>
          </div>
        </div>
      </div>
      
      <LoginDialog 
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </div>
  );
};

export default ProfilePage;
