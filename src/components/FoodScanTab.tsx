
import React from "react";
import { ChevronRight, Utensils, Banana, Apple } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  brand: string;
  score: number;
  imageUrl: string;
  borderColor: string;
}

const foodItems: FoodItem[] = [
  {
    id: "1",
    name: "Whole Wheat Bread",
    brand: "Nature's Own",
    score: 81,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    borderColor: "border-teal-100",
  },
  {
    id: "2",
    name: "Doritos Chips",
    brand: "Frito-Lay",
    score: 74,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    borderColor: "border-purple-100",
  },
  {
    id: "3",
    name: "Greek Yogurt",
    brand: "Chobani",
    score: 50,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    borderColor: "border-orange-100",
  },
  {
    id: "4",
    name: "Chocolate Bar",
    brand: "Hershey's",
    score: 23,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    borderColor: "border-red-100",
  },
];

const FoodScanTab = () => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-500";
    if (score >= 60) return "bg-purple-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Not great";
    return "Bad";
  };

  return (
    <div className="space-y-3 mb-6">
      {foodItems.map((item) => (
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
              <p className="text-blue-500 text-xs font-medium mb-1">{item.brand}</p>
              <div className={`${getScoreColor(item.score)} text-white px-3 py-1 rounded-full inline-flex items-center text-xs`}>
                <span className="font-bold mr-1">{item.score}</span>
                <span>{getScoreText(item.score)}</span>
              </div>
            </div>
            <ChevronRight className="text-gray-400 ml-2" size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodScanTab;
