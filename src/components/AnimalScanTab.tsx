
import React from "react";
import { ChevronRight, AlertTriangle, PawPrint, Bird, Fish } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    imageUrl: "/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png",
    borderColor: "border-red-100",
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
    imageUrl: "/lovable-uploads/b7a77845-a980-42f1-8b7e-eea9a8b822f8.png",
    borderColor: "border-yellow-100",
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
    imageUrl: "/lovable-uploads/b7a77845-a980-42f1-8b7e-eea9a8b822f8.png",
    borderColor: "border-green-100",
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

  const getAnimalIcon = (type: "mammal" | "bird" | "fish") => {
    if (type === "bird") return <Bird size={14} className="mr-1" />;
    if (type === "fish") return <Fish size={14} className="mr-1" />;
    return <PawPrint size={14} className="mr-1" />;
  };

  const handleAnimalClick = (id: string) => {
    navigate(`/animal/${id}`);
  };

  return (
    <div className="space-y-3 mb-6">
      {animalItems.map((item) => (
        <div 
          key={item.id} 
          className={`rounded-xl overflow-hidden border border-black ${item.borderColor} shadow-sm flex`}
          onClick={() => handleAnimalClick(item.id)}
        >
          <div className="flex items-center p-3 w-full">
            <div className="w-14 h-14 rounded-lg overflow-hidden mr-3">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-0.5">{item.name}</h3>
              <p className="text-blue-500 text-xs font-medium mb-1">{item.scientificName}</p>
              <div className={`${getRiskColor(item.riskLevel)} text-white px-2 py-0.5 rounded-full inline-flex items-center text-xs`}>
                <AlertTriangle className="mr-1" size={10} />
                <span>{item.riskLevel} Risk</span>
              </div>
            </div>
            <ChevronRight className="text-gray-400 ml-2" size={18} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimalScanTab;
