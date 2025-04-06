
import React from "react";
import { ChevronRight, Droplets, Sun, Flower } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlantItem {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  borderColor: string;
}

const plantItems: PlantItem[] = [
  {
    id: "1",
    name: "Ti Leaf",
    scientificName: "Cordyline fruticosa",
    imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    borderColor: "border-green-100",
  },
  {
    id: "2",
    name: "Monstera",
    scientificName: "Monstera deliciosa",
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    borderColor: "border-blue-100",
  },
  {
    id: "3",
    name: "Pink Roses",
    scientificName: "Rosa gallica",
    imageUrl: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
    borderColor: "border-purple-100",
  },
  {
    id: "4",
    name: "Blue Fern",
    scientificName: "Phlebodium aureum", 
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    borderColor: "border-green-100",
  },
];

const PlantScanTab = () => {
  const navigate = useNavigate();

  const getBorderColor = (type: string) => {
    if (type.includes("Ti Leaf")) return "border-green-200";
    if (type.includes("Monstera")) return "border-blue-200";
    if (type.includes("Pink")) return "border-purple-200";
    return "border-teal-200";
  };

  const handlePlantClick = (id: string) => {
    navigate(`/plant/${id}`);
  };

  return (
    <div className="space-y-3">
      {plantItems.map((item) => (
        <div 
          key={item.id} 
          className={`p-3 rounded-xl border shadow-sm bg-white flex items-center justify-between cursor-pointer ${getBorderColor(item.name)}`}
          onClick={() => handlePlantClick(item.id)}
        >
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <p className="text-md text-blue-500">{item.scientificName}</p>
            <div className="flex space-x-3 mt-2">
              <Droplets className="text-blue-500" size={18} />
              <Sun className="text-yellow-500" size={18} />
              <Flower className="text-green-500" size={18} />
            </div>
          </div>
          <ChevronRight className="text-gray-400 h-5 w-5" />
        </div>
      ))}
    </div>
  );
};

export default PlantScanTab;
