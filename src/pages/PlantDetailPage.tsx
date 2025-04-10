
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark, Sun, Droplet, Wind, CloudRain, Thermometer, Calendar, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { toast } from "sonner";

const plantData = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    commonName: "Swiss Cheese Plant",
    imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    category: "Indoor",
    origin: "Southern Mexico & Panama",
    mature_height: "2-3m",
    toxic: true,
    sun_exposure: "Indirect Light",
    water_needs: "Moderate",
    difficulty: "Easy",
    description: "The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, and other locations. It is a common houseplant in temperate zones, known for its unique leaf structure and aerial roots.",
  }
];

const PlantDetailPage = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const plant = plantData.find(item => item.id === plantId);
  
  if (!plant) {
    return <div>Plant not found</div>;
  }

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    }
  };

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
    toast(`${isBookmarked ? "Removed from" : "Added to"} bookmarks`);
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-xl font-semibold">Plant Details</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <button
            onClick={handleBookmarkClick}
            className="p-2"
          >
            <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-white' : ''}`} color="white" />
          </button>
        </div>
      </header>

      <div className="relative h-80 bg-gray-200">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-4 bg-white">
        <h2 className="text-2xl font-bold">{plant.name}</h2>
        <p className="text-gray-500 text-sm">{plant.commonName}</p>

        <div className="flex mt-4 space-x-2">
          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">{plant.category}</Badge>
          {plant.toxic && (
            <Badge variant="destructive">Toxic</Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Origin</p>
            <p className="font-medium">{plant.origin}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mature Height</p>
            <p className="font-medium">{plant.mature_height}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 mt-3 bg-white">
        <h3 className="text-lg font-bold mb-4">Plant Information</h3>
        <p className="text-gray-700">
          {plant.description}
        </p>
      </div>

      <div className="px-4 py-4 mt-3 bg-white">
        <h3 className="text-lg font-bold mb-4">Care Information</h3>

        <div className="mt-4 space-y-3">
          <div className="flex items-center px-3 py-2.5 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Sun className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Light</p>
              <p className="font-medium">{plant.sun_exposure}</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-teal-50 rounded-xl">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Droplet className="h-5 w-5 text-teal-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Water</p>
              <p className="font-medium">{plant.water_needs}</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Wind className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Difficulty</p>
              <p className="font-medium">{plant.difficulty}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center px-3 py-2.5 bg-cyan-50 rounded-xl">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-center">
              <span className="text-cyan-500 text-sm font-medium">SP</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Spring</p>
              <p className="font-medium">Water thoroughly when top inch of soil is dry</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-amber-50 rounded-xl">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-center">
              <span className="text-amber-500 text-sm font-medium">SU</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Summer</p>
              <p className="font-medium">Increase watering frequency and mist regularly</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-orange-50 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-center">
              <span className="text-orange-500 text-sm font-medium">FA</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Fall</p>
              <p className="font-medium">Reduce watering as growth slows down</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-center">
              <span className="text-indigo-500 text-sm font-medium">WI</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Winter</p>
              <p className="font-medium">Water sparingly, avoid cold drafts</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Fertilizing</p>
              <p className="font-medium">Monthly during growing season</p>
            </div>
          </div>

          <div className="flex items-center px-3 py-2.5 bg-rose-50 rounded-xl">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <CloudRain className="h-5 w-5 text-rose-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-500">Pruning</p>
              <p className="font-medium">Trim yellowing leaves when necessary</p>
            </div>
          </div>
        </div>

        {/* Plant Requirements Section */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Plant requirements</h3>
          
          <div className="space-y-4">
            <div className="flex items-center px-4 py-3 bg-[#1A1F2C] text-white rounded-lg">
              <div className="flex items-center justify-center">
                <span className="text-[#FFB27A] text-2xl mr-3">🪴</span>
              </div>
              <div className="flex-1">
                <p className="text-xl font-medium">Pot</p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="flex items-center px-4 py-3 bg-[#1A1F2C] text-white rounded-lg">
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-3">🌱</span>
              </div>
              <div className="flex-1">
                <p className="text-xl font-medium">Soil</p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="flex flex-col px-4 py-3 bg-[#1A1F2C] text-white rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">☀️</span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium">Lighting</p>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-[#0FC2B1] text-lg pl-10 mt-1">Part sun</p>
            </div>
            
            <div className="flex flex-col px-4 py-3 bg-[#1A1F2C] text-white rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">💧</span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium">Humidity</p>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-[#0FC2B1] text-lg pl-10 mt-1">High (>60%)</p>
            </div>
            
            <div className="flex flex-col px-4 py-3 bg-[#1A1F2C] text-white rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">🗺️</span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium">Hardiness zone</p>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-[#0FC2B1] text-lg pl-10 mt-1">10a - 11b</p>
            </div>
            
            <div className="flex flex-col px-4 py-3 bg-[#1A1F2C] text-white rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">🌡️</span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium">Temperature</p>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-[#0FC2B1] text-lg pl-10 mt-1">73°F - 95°F</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />

      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
    </div>
  );
};

export default PlantDetailPage;
