
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Info, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram,
  Star,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

const AboutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Share functionality is coming soon.",
    });
  };

  const handleRate = () => {
    toast({
      title: "Rate App",
      description: "Rating functionality is coming soon.",
    });
  };

  const handleSocialClick = (platform: string) => {
    toast({
      title: "Social Media",
      description: `${platform} link will be available soon.`,
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">About</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-24">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/3981fb88-0fa3-404e-8a77-3a58ae1e0347.png" 
            alt="WayScanner Logo" 
            className="h-24 mb-4" 
          />
          <h2 className="text-xl font-bold text-center">WayScanner</h2>
          <p className="text-sm text-gray-500 text-center">Version 1.0.0</p>
          
          <div className="flex space-x-3 mt-4">
            <Button 
              variant="outline" 
              className="flex items-center border-wayscanner-blue text-wayscanner-blue"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center border-wayscanner-blue text-wayscanner-blue"
              onClick={handleRate}
            >
              <Star className="h-4 w-4 mr-2" />
              Rate App
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-wayscanner-blue mt-1 mr-3" />
            <div>
              <h3 className="font-semibold mb-2">About WayScanner</h3>
              <p className="text-sm text-gray-600">
                WayScanner is your ultimate companion for a sustainable lifestyle. We help you make conscious choices by providing information about food, plants, animals, and eco-friendly products, all in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Our Mission</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our mission is to empower individuals to make eco-conscious decisions by providing them with the knowledge and tools to understand their impact on the environment. We believe that small changes in daily habits can make a big difference for our planet.
          </p>
          <p className="text-sm text-gray-600">
            Through our scanning technology, we help users identify food ingredients, plants, and animals, while also connecting them with a marketplace of sustainable products from ethical producers.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Connect With Us</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={() => handleSocialClick("Website")}
            >
              <Globe className="h-5 w-5 mr-2 text-wayscanner-blue" />
              Website
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={() => handleSocialClick("Facebook")}
            >
              <Facebook className="h-5 w-5 mr-2 text-wayscanner-blue" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={() => handleSocialClick("Twitter")}
            >
              <Twitter className="h-5 w-5 mr-2 text-wayscanner-blue" />
              Twitter
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={() => handleSocialClick("Instagram")}
            >
              <Instagram className="h-5 w-5 mr-2 text-wayscanner-blue" />
              Instagram
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6 mb-16">
          © 2025 WayScanner. All rights reserved.
        </p>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default AboutPage;
