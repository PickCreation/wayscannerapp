
import React, { useState } from "react";
import { ChevronLeft, Share2, Heart, Bookmark, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

// Dummy plant data
const plants = [
  {
    id: 1,
    name: "Ti Leaf Plant",
    scientificName: "Cordyline fruticosa",
    description: "The Ti Leaf plant, also known as Cordyline fruticosa, is a beautiful tropical plant with colorful foliage. Native to Southeast Asia and the Pacific Islands, it's popular for its vibrant leaves that range from green to red, pink, and purple. It's relatively easy to care for and makes a striking addition to any indoor plant collection.",
    careLevel: "Moderate",
    waterNeeds: "Keep soil consistently moist but not soggy. Water when the top inch of soil feels dry.",
    lightNeeds: "Bright, indirect light. Can tolerate some direct morning sun.",
    toxicity: "Mildly toxic to pets if ingested in large quantities.",
    growthRate: "Moderate",
    images: [
      "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
      "https://images.unsplash.com/photo-1597055181449-b9efc7a907a1?q=80&w=600",
      "https://images.unsplash.com/photo-1598880940967-54a875ebff73?q=80&w=600",
    ],
    pros: [
      "Beautiful, colorful foliage",
      "Relatively easy to care for",
      "Can grow quite tall indoors (3-4 feet)",
      "Adds tropical vibe to spaces"
    ],
    cons: [
      "Needs consistent humidity",
      "Can be sensitive to fluoride in tap water",
      "Leaf tips may brown with improper care",
      "Mildly toxic to pets"
    ],
    tips: [
      "Use filtered water if possible",
      "Mist leaves regularly to maintain humidity",
      "Protect from cold drafts",
      "Rotate occasionally for even growth"
    ]
  }
];

const PlantDetailPage = () => {
  const navigate = useNavigate();
  const { plantId } = useParams();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeItem, setActiveItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("home");
  
  const plant = plants.find(p => p.id === Number(plantId));
  
  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Plant not found</p>
      </div>
    );
  }
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from Bookmarks" : "Added to Bookmarks",
      description: isBookmarked ? `${plant.name} removed from your bookmarks` : `${plant.name} added to your bookmarks`,
    });
  };
  
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorited ? `${plant.name} removed from your favorites` : `${plant.name} added to your favorites`,
    });
  };
  
  const handleSchedule = () => {
    toast({
      title: "Watering Reminder Set",
      description: `You'll be reminded to water your ${plant.name} on schedule`,
    });
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveItem(item);
    switch (item) {
      case "home":
        navigate("/");
        break;
      case "forum":
        navigate("/forum");
        break;
      case "recipes":
        navigate("/recipes");
        break;
      case "shop":
        navigate("/marketplace");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  const handleCameraClick = () => {
    navigate("/scan-camera");
  };
  
  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">Plant Details</h1>
        <div className="flex">
          <button className="p-2" onClick={handleBookmark}>
            <Bookmark 
              size={24} 
              color="white" 
              fill={isBookmarked ? "white" : "none"} 
            />
          </button>
          <button className="p-2" onClick={() => {}}>
            <Share2 size={24} color="white" />
          </button>
        </div>
      </header>
      
      <div className="w-full h-64 relative">
        <img 
          src={plant.images[0]} 
          alt={plant.name} 
          className="w-full h-full object-cover rounded-lg px-5 pt-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-70"></div>
      </div>
      
      <div className="px-4 pb-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mt-4">{plant.name}</h2>
        <p className="text-gray-600 italic">{plant.scientificName}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            {plant.careLevel} Care
          </Badge>
          <Badge 
            variant="outline" 
            className={
              plant.toxicity.includes("toxic") 
                ? "bg-red-50 text-red-700 hover:bg-red-100" 
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }
          >
            {plant.toxicity.includes("toxic") ? "Toxic to Pets" : "Safe for Pets"}
          </Badge>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button 
            onClick={handleFavorite}
            variant="outline" 
            className="flex-1 gap-2"
          >
            <Heart fill={isFavorited ? "red" : "none"} className={isFavorited ? "text-red-500" : ""} />
            <span>{isFavorited ? "Favorited" : "Favorite"}</span>
          </Button>
          <Button 
            onClick={handleSchedule}
            variant="outline" 
            className="flex-1 gap-2"
          >
            <Calendar />
            <span>Set Reminder</span>
          </Button>
        </div>
        
        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="care">Care Guide</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="mt-4">
            <p className="text-gray-700">{plant.description}</p>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Pros</h3>
              <ul className="list-disc pl-5 space-y-1">
                {plant.pros.map((pro, index) => (
                  <li key={index} className="text-gray-700">{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Cons</h3>
              <ul className="list-disc pl-5 space-y-1">
                {plant.cons.map((con, index) => (
                  <li key={index} className="text-gray-700">{con}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="care" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Light</h3>
                <p className="text-gray-700">{plant.lightNeeds}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">Water</h3>
                <p className="text-gray-700">{plant.waterNeeds}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">Growth Rate</h3>
                <p className="text-gray-700">{plant.growthRate}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tips" className="mt-4">
            <ul className="list-disc pl-5 space-y-2">
              {plant.tips.map((tip, index) => (
                <li key={index} className="text-gray-700">{tip}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-2">Gallery</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {plant.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${plant.name} - view ${index + 1}`} 
                className="h-24 w-24 object-cover rounded-md flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation 
        activeItem={activeItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default PlantDetailPage;
