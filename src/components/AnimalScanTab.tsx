
import React from "react";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AnimalItem {
  id: string;
  name: string;
  scientificName: string;
  riskLevel: "High" | "Moderate" | "Low";
  imageUrl: string;
  borderColor: string;
  icon: "mammal" | "bird" | "fish";
  type: string;
  dietary: string;
  behavior: string;
}

const animalItems: AnimalItem[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png",
    borderColor: "border-red-200",
    icon: "mammal",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Nocturnal"
  },
  {
    id: "2",
    name: "Gray Wolf",
    scientificName: "Canis lupus",
    riskLevel: "Moderate",
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    borderColor: "border-orange-200",
    icon: "mammal",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Crepuscular"
  },
  {
    id: "3",
    name: "Labrador Retriever",
    scientificName: "Canis lupus familiaris",
    riskLevel: "Low",
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    borderColor: "border-green-200",
    icon: "mammal",
    type: "Mammal",
    dietary: "Omnivore",
    behavior: "Diurnal"
  },
];

const AnimalScanTab = () => {
  const navigate = useNavigate();
  
  const getRiskColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "bg-red-500";
    if (risk === "Moderate") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getBorderColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "border-red-200";
    if (risk === "Moderate") return "border-orange-200";
    return "border-green-200";
  };

  const handleAnimalClick = (id: string) => {
    navigate(`/animal/${id}`);
  };

  return (
    <div className="space-y-3">
      {animalItems.map((item) => (
        <div 
          key={item.id} 
          className={`p-3 rounded-xl border-2 ${getBorderColor(item.riskLevel)} shadow-sm bg-white flex items-center justify-between cursor-pointer`}
          onClick={() => handleAnimalClick(item.id)}
        >
          <div className="h-14 w-14 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <Avatar className="h-full w-full">
              <AvatarImage src={item.imageUrl} alt={item.name} className="object-cover" />
              <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <p className="text-md text-blue-500">{item.scientificName}</p>
            <div className={`${getRiskColor(item.riskLevel)} text-white px-2 py-1 rounded-full inline-flex items-center text-sm mt-2`}>
              <AlertTriangle className="mr-1" size={14} />
              <span>{item.riskLevel} Risk</span>
            </div>
          </div>
          <ChevronRight className="text-gray-400 h-5 w-5" />
        </div>
      ))}
    </div>
  );
};

export default AnimalScanTab;
