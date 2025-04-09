
import React, { useState } from "react";
import { X, Search, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface ComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFoodId: string;
}

const foodItems = [
  {
    id: "1",
    name: "Whole Wheat Bread",
    brand: "Nature's Own",
    score: 81,
    imageUrl: "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    calories: 80,
    protein: 4,
    carbs: 15,
    sugar: 2,
    fat: 1
  },
  {
    id: "2",
    name: "Doritos Chips",
    brand: "Frito-Lay",
    score: 35,
    imageUrl: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    calories: 150,
    protein: 2,
    carbs: 18,
    sugar: 1,
    fat: 8
  },
  {
    id: "3",
    name: "Greek Yogurt",
    brand: "Chobani",
    score: 75,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    calories: 120,
    protein: 15,
    carbs: 8,
    sugar: 6,
    fat: 3
  },
  {
    id: "4",
    name: "Chocolate Bar",
    brand: "Hershey's",
    score: 23,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    calories: 210,
    protein: 3,
    carbs: 24,
    sugar: 22,
    fat: 13
  }
];

const ComparisonSheet: React.FC<ComparisonSheetProps> = ({
  open,
  onOpenChange,
  currentFoodId
}) => {
  const currentFood = foodItems.find(item => item.id === currentFoodId);
  const [compareFood, setCompareFood] = useState<typeof foodItems[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFoods = foodItems
    .filter(item => item.id !== currentFoodId)
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-500";
    if (score >= 60) return "bg-purple-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0">
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Compare Foods</h2>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100">
              <X size={20} />
            </SheetClose>
          </div>
          
          {!compareFood ? (
            <div className="mt-4">
              <div className="relative">
                <Input
                  placeholder="Search for a food to compare..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <Search className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="flex justify-between mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-md overflow-hidden">
                  <img 
                    src={currentFood?.imageUrl} 
                    alt={currentFood?.name || ""} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{currentFood?.name}</p>
                  <p className="text-xs text-gray-500">{currentFood?.brand}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold">vs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div>
                  <p className="font-medium text-sm text-right">{compareFood.name}</p>
                  <p className="text-xs text-gray-500 text-right">{compareFood.brand}</p>
                </div>
                <div className="w-10 h-10 rounded-md overflow-hidden">
                  <img 
                    src={compareFood.imageUrl} 
                    alt={compareFood.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!compareFood ? (
          <div className="overflow-auto max-h-[calc(85vh-105px)]">
            <div className="p-4 space-y-3">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  className="w-full flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  onClick={() => setCompareFood(food)}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                    <img 
                      src={food.imageUrl} 
                      alt={food.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.brand}</p>
                  </div>
                  <div className={`${getScoreColor(food.score)} text-white px-2 py-1 rounded-full text-sm`}>
                    {food.score}
                  </div>
                  <Plus className="ml-2 h-5 w-5 text-gray-400" />
                </button>
              ))}
              
              {filteredFoods.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No matching foods found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-auto h-[calc(85vh-135px)]">
            <div className="p-4 space-y-6 pb-14">
              <div>
                <h3 className="text-lg font-semibold mb-3">Nutritional Score</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className={`${getScoreColor(currentFood?.score || 0)} text-white inline-block px-3 py-1 rounded-full text-sm mb-1`}>
                      {currentFood?.score || 0}
                    </div>
                    <p className="text-sm">Nutritional Score</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className={`${getScoreColor(compareFood.score)} text-white inline-block px-3 py-1 rounded-full text-sm mb-1`}>
                      {compareFood.score}
                    </div>
                    <p className="text-sm">Nutritional Score</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Calories</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold mb-1">{currentFood?.calories || 0}</div>
                    <p className="text-sm">calories</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold mb-1">{compareFood.calories}</div>
                    <p className="text-sm">calories</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Protein</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{currentFood?.protein || 0}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={(currentFood?.protein || 0) * 5} className="h-3" indicatorColor="bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{compareFood.protein}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={compareFood.protein * 5} className="h-3" indicatorColor="bg-green-500" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Carbohydrates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{currentFood?.carbs || 0}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={(currentFood?.carbs || 0) * 3} className="h-3" indicatorColor="bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{compareFood.carbs}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={compareFood.carbs * 3} className="h-3" indicatorColor="bg-yellow-500" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Sugar</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{currentFood?.sugar || 0}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={(currentFood?.sugar || 0) * 5} className="h-3" indicatorColor="bg-purple-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{compareFood.sugar}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={compareFood.sugar * 5} className="h-3" indicatorColor="bg-purple-500" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Fat</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{currentFood?.fat || 0}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={(currentFood?.fat || 0) * 5} className="h-3" indicatorColor="bg-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{compareFood.fat}g</span>
                      <span className="text-sm text-gray-500">per serving</span>
                    </div>
                    <Progress value={compareFood.fat * 5} className="h-3" indicatorColor="bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {compareFood && (
          <div className="sticky bottom-0 border-t bg-white p-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setCompareFood(null)}
            >
              Change Comparison Food
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ComparisonSheet;
