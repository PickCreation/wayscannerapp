
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
  return (
    <div className="space-y-3 mb-6">
      {plantItems.map((item) => (
        <div 
          key={item.id} 
          className={`rounded-xl overflow-hidden border ${item.borderColor} shadow-sm flex`}
        >
          <div className="flex items-center p-3 w-full">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold mb-0.5 flex items-center">
                    {item.name}
                    <ChevronRight className="ml-1" size={16} />
                  </h3>
                  <p className="text-gray-600 text-xs font-medium mb-1">{item.scientificName}</p>
                </div>
                <MoreVertical className="text-gray-400" size={20} />
              </div>
              <div className="flex space-x-3 mt-1">
                <Droplets className="text-blue-500" size={16} />
                <Sun className="text-yellow-500" size={16} />
                <Flower className="text-green-500" size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantScanTab;
