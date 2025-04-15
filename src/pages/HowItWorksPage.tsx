
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchHowItWorksContent } from "@/api/mockApi";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState<{
    title: string;
    sections: {
      heading: string;
      text: string;
      icon?: string;
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("home");
  const [showCameraSheet, setShowCameraSheet] = useState(false);

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
      return;
    }
    if (item === "forum") {
      navigate("/forum");
      return;
    }
    if (item === "recipes") {
      navigate("/recipes");
      return;
    }
    if (item === "shop") {
      navigate("/marketplace");
      return;
    }
    if (item === "profile") {
      navigate("/profile");
      return;
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchHowItWorksContent();
        setContent(data as any);
      } catch (error) {
        console.error("Error fetching how it works content:", error);
        toast({
          title: "Error loading content",
          description: "Please try again later",
          variant: "destructive"
        });
        setContent({
          title: "How WayScanner Works",
          sections: [
            {
              heading: "Scan Anything",
              text: "Point your camera at food, plants, or animals to get instant information and identification."
            },
            {
              heading: "Learn & Explore",
              text: "Discover nutritional facts, plant care tips, animal species information, and more."
            },
            {
              heading: "Shop Consciously",
              text: "Browse recommended sustainable products related to your scans in our marketplace."
            },
            {
              heading: "Share & Connect",
              text: "Join our community to share discoveries and learn from other explorers."
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [toast]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      <div className="flex items-center justify-between mb-6 px-4 pt-4">
        <h1 className="text-2xl font-bold">{content?.title || "How It Works"}</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X size={24} />
        </Button>
      </div>

      <div className="space-y-6 px-4">
        {content?.sections.map((section, index) => (
          <Card key={index} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
            <p className="text-gray-700">{section.text}</p>
          </Card>
        ))}
      </div>

      <CameraSheet 
        open={showCameraSheet} 
        onOpenChange={setShowCameraSheet} 
      />

      <BottomNavigation 
        activeItem={activeNavItem} 
        onItemClick={handleNavItemClick} 
        onCameraClick={handleCameraClick} 
      />
    </div>
  );
};

export default HowItWorksPage;
