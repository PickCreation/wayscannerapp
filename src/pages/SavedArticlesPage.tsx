
import React, { useState } from "react";
import { ArrowLeft, User, Bell, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

const SavedArticlesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");

  const handleBackClick = () => {
    navigate("/profile");
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
    toast({
      title: "Camera",
      description: "The camera feature is under development.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <button className="p-2" onClick={handleBackClick} type="button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Saved Articles</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2" type="button">
              <Bell size={24} fill="white" strokeWidth={1.5} />
            </button>
            <button className="p-2" onClick={() => navigate("/profile")} type="button">
              <User size={24} fill="white" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg shadow">
          <BookOpen size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Saved Articles</h3>
          <p className="text-gray-500 text-center">
            You haven't saved any articles yet. Browse the blog and save articles that interest you.
          </p>
        </div>
      </div>

      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default SavedArticlesPage;
