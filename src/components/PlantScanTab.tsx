
import React from "react";
import { ChevronRight, MoreVertical, Droplets, Sun, Flower } from "lucide-react";

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
    borderColor: "border-pink-100",
  },
  {
    id: "2",
    name: "Ti Leaf",
    scientificName: "Cordyline fruticosa",
    imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    borderColor: "border-blue-100",
  },
  {
    id: "3",
    name: "Pink Rosas",
    scientificName: "Cordyline fruticosa",
    imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    borderColor: "border-purple-100",
  },
  {
    id: "4",
    name: "Blue Roses",
    scientificName: "Cordyline fruticosa", 
    imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    borderColor: "border-green-100",
  },
];

const PlantScanTab = () => {
  return (
    <div className="space-y-4 mb-8">
      {plantItems.map((item) => (
        <div 
          key={item.id} 
          className={`rounded-2xl overflow-hidden border ${item.borderColor} shadow-sm flex`}
        >
          <div className="flex items-center p-4 w-full">
            <div className="w-24 h-24 rounded-lg overflow-hidden mr-4">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center">
                    {item.name}
                    <ChevronRight className="ml-1" size={20} />
                  </h3>
                  <p className="text-gray-600 font-medium mb-2">{item.scientificName}</p>
                </div>
                <MoreVertical className="text-gray-400" size={24} />
              </div>
              <div className="flex space-x-4 mt-2">
                <Droplets className="text-blue-500" size={24} />
                <Sun className="text-yellow-500" size={24} />
                <Flower className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantScanTab;
