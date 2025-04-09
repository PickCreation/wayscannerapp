
import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

// Using the same sample food data from FoodDetailPage
const foodItems = [
  {
    id: "1",
    name: "Whole Wheat Bread",
    brand: "Nature's Own",
    score: 81,
    imageUrl: "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    serving: "26g",
    nutrients: {
      negatives: [
        { name: "Sodium", value: "120mg", progress: 35, color: "bg-red-500" },
        { name: "Sugar", value: "6g", progress: 30, color: "bg-purple-500" },
      ],
      positives: [
        { name: "Fiber", value: "0g", progress: 45, color: "bg-teal-500" },
        { name: "Protein", value: "3g", progress: 30, color: "bg-green-500" },
      ]
    }
  },
  {
    id: "2",
    name: "Doritos Chips",
    brand: "Frito-Lay",
    score: 74,
    imageUrl: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    serving: "30g",
    nutrients: {
      negatives: [
        { name: "Sodium", value: "210mg", progress: 65, color: "bg-red-500" },
        { name: "Sugar", value: "2g", progress: 15, color: "bg-purple-500" },
      ],
      positives: [
        { name: "Fiber", value: "1g", progress: 15, color: "bg-teal-500" },
        { name: "Protein", value: "2g", progress: 15, color: "bg-green-500" },
      ]
    }
  },
  {
    id: "3",
    name: "Greek Yogurt",
    brand: "Chobani",
    score: 50,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    serving: "150g",
    nutrients: {
      negatives: [
        { name: "Sodium", value: "65mg", progress: 25, color: "bg-red-500" },
        { name: "Sugar", value: "7g", progress: 32, color: "bg-purple-500" },
      ],
      positives: [
        { name: "Fiber", value: "0g", progress: 0, color: "bg-teal-500" },
        { name: "Protein", value: "15g", progress: 60, color: "bg-green-500" },
      ]
    }
  }
];

// Get fixed colors for nutrients
const getNutrientColor = (nutrientName: string, index: number) => {
  const colorMap: Record<string, string> = {
    "Sodium": "bg-red-500",
    "Sugar": "bg-purple-500",
    "Fiber": "bg-teal-500",
    "Protein": "bg-green-600",
    "Saturated Fat": "bg-blue-500",
    "Calcium": "bg-cyan-500",
    "Vitamin D": "bg-amber-500",
    "Potassium": "bg-pink-600"
  };

  if (colorMap[nutrientName]) {
    return colorMap[nutrientName];
  }

  const fallbackColors = [
    "bg-indigo-500", "bg-orange-500", "bg-lime-500", 
    "bg-emerald-500", "bg-sky-500", "bg-fuchsia-500"
  ];
  
  return fallbackColors[index % fallbackColors.length];
};

// Color for health score
const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-teal-500";
  if (score >= 60) return "bg-purple-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

interface ComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFoodId: string;
}

const ComparisonSheet: React.FC<ComparisonSheetProps> = ({
  open,
  onOpenChange,
  currentFoodId
}) => {
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([currentFoodId]);
  
  const handleToggleFood = (id: string) => {
    if (selectedFoodIds.includes(id)) {
      // Don't remove if it's the only one or if it's the current food
      if (selectedFoodIds.length > 1 && id !== currentFoodId) {
        setSelectedFoodIds(selectedFoodIds.filter(foodId => foodId !== id));
      }
    } else {
      // Maximum 3 items for comparison
      if (selectedFoodIds.length < 3) {
        setSelectedFoodIds([...selectedFoodIds, id]);
      }
    }
  };
  
  const selectedFoods = foodItems.filter(food => selectedFoodIds.includes(food.id));
  const availableFoods = foodItems.filter(food => !selectedFoodIds.includes(food.id));

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <div className="p-4 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Compare Foods</h2>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Selected Foods for Comparison */}
            <div className="grid grid-cols-1 gap-4">
              <h3 className="text-lg font-semibold mb-1">Comparing {selectedFoods.length} items</h3>
              
              {/* Health Score Comparison */}
              <div className="bg-white rounded-lg shadow p-4">
                <h4 className="font-semibold mb-3">Health Score</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedFoods.map(food => (
                    <div key={food.id} className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full ${getScoreColor(food.score)} flex items-center justify-center text-white font-bold text-lg`}>
                        {food.score}
                      </div>
                      <p className="text-sm mt-2 font-medium">{food.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Negative Nutrients Comparison */}
              <div className="bg-white rounded-lg shadow p-4">
                <h4 className="font-semibold mb-3">Negative Nutrients</h4>
                {["Sodium", "Sugar"].map((nutrient, index) => (
                  <div key={nutrient} className="mb-4">
                    <p className="font-medium mb-2">{nutrient}</p>
                    <div className="space-y-2">
                      {selectedFoods.map(food => {
                        const nutrientData = food.nutrients.negatives.find(n => n.name === nutrient);
                        return (
                          <div key={food.id} className="flex items-center">
                            <span className="w-24 text-sm">{food.name}</span>
                            <div className="flex-1 mx-2">
                              <Progress 
                                value={nutrientData?.progress || 0} 
                                className="h-2 bg-gray-200"
                                indicatorColor={getNutrientColor(nutrient, index)}
                              />
                            </div>
                            <span className="w-12 text-right text-sm">{nutrientData?.value || '0'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Positive Nutrients Comparison */}
              <div className="bg-white rounded-lg shadow p-4">
                <h4 className="font-semibold mb-3">Positive Nutrients</h4>
                {["Protein", "Fiber"].map((nutrient, index) => (
                  <div key={nutrient} className="mb-4">
                    <p className="font-medium mb-2">{nutrient}</p>
                    <div className="space-y-2">
                      {selectedFoods.map(food => {
                        const nutrientData = food.nutrients.positives.find(n => n.name === nutrient);
                        return (
                          <div key={food.id} className="flex items-center">
                            <span className="w-24 text-sm">{food.name}</span>
                            <div className="flex-1 mx-2">
                              <Progress 
                                value={nutrientData?.progress || 0} 
                                className="h-2 bg-gray-200"
                                indicatorColor={getNutrientColor(nutrient, index)}
                              />
                            </div>
                            <span className="w-12 text-right text-sm">{nutrientData?.value || '0'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add More Foods to Compare */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Add more foods to compare</h3>
              <div className="space-y-2">
                {availableFoods.map(food => (
                  <Card 
                    key={food.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleToggleFood(food.id)}
                  >
                    <CardContent className="p-3 flex items-center">
                      <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                        <img 
                          src={food.imageUrl} 
                          alt={food.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{food.name}</h4>
                        <p className="text-sm text-gray-500">{food.brand}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ComparisonSheet;
