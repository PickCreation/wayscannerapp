
import React from "react";
import { ChevronRight, AlertTriangle, PawPrint, Bird, Fish } from "lucide-react";

interface AnimalItem {
  id: string;
  name: string;
  scientificName: string;
  riskLevel: "High" | "Moderate" | "Low";
  imageUrl: string;
  borderColor: string;
}

const animalItems: AnimalItem[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
    borderColor: "border-red-100",
  },
  {
    id: "2",
    name: "Gray Wolf",
    scientificName: "Canis lupus",
    riskLevel: "Moderate",
    imageUrl: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
    borderColor: "border-yellow-100",
  },
  {
    id: "3",
    name: "Labrador Retriever",
    scientificName: "Canis lupus familiaris",
    riskLevel: "Low",
    imageUrl: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
    borderColor: "border-green-100",
  },
];

const AnimalScanTab = () => {
  const getRiskColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "bg-red-500";
    if (risk === "Moderate") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-3 mb-6">
      {animalItems.map((item) => (
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
              <h3 className="text-base font-bold mb-0.5">{item.name}</h3>
              <p className="text-blue-500 text-xs font-medium mb-1">{item.scientificName}</p>
              <div className={`${getRiskColor(item.riskLevel)} text-white px-3 py-1 rounded-full inline-flex items-center text-xs`}>
                <AlertTriangle className="mr-1" size={12} />
                <span>{item.riskLevel} Risk</span>
              </div>
            </div>
            <ChevronRight className="text-gray-400 ml-2" size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimalScanTab;
