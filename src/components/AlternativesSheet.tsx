
import React from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Food {
  id: string;
  name: string;
  brand: string;
  score: number;
  imageUrl: string;
  serving: string;
}

interface AlternativesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFood: Food;
}

const alternativeFoods = [
  {
    name: "Whole Grain Bread",
    brand: "Dave's Killer Bread",
    score: 88,
    imageUrl: "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    benefits: [
      "Higher fiber content (5g vs 2g)",
      "Lower sodium content",
      "More protein (5g vs 3g)",
      "No artificial preservatives"
    ]
  },
  {
    name: "Baked Veggie Chips",
    brand: "Terra",
    score: 72,
    imageUrl: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    benefits: [
      "30% less fat than regular chips",
      "Made from real vegetables",
      "No artificial flavors or colors",
      "Good source of vitamin A and C"
    ]
  },
  {
    name: "Grilled Chicken",
    brand: "Home-cooked",
    score: 95,
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    benefits: [
      "Excellent protein source",
      "Low in saturated fat",
      "No added sodium or preservatives",
      "High in B vitamins"
    ]
  }
];

const AlternativesSheet: React.FC<AlternativesSheetProps> = ({
  open,
  onOpenChange,
  currentFood
}) => {
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
            <h2 className="text-xl font-bold">Healthier Alternatives</h2>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100">
              <X size={20} />
            </SheetClose>
          </div>
          
          <div className="mt-4 bg-amber-50 p-3 rounded-lg">
            <div className="flex">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                <img 
                  src={currentFood.imageUrl} 
                  alt={currentFood.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{currentFood.name}</h3>
                  <div className={`${getScoreColor(currentFood.score)} text-white text-xs px-2 py-0.5 rounded-full ml-2`}>
                    {currentFood.score}
                  </div>
                </div>
                <p className="text-sm text-amber-800">
                  Try these healthier alternatives instead
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-auto h-[calc(85vh-140px)]">
          <div className="p-4 space-y-5 pb-10">
            {alternativeFoods.map((food, index) => (
              <div key={index} className="bg-white rounded-lg border p-3">
                <div className="flex">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                    <img 
                      src={food.imageUrl} 
                      alt={food.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{food.name}</h4>
                      <div className={`${getScoreColor(food.score)} text-white text-xs px-2 py-0.5 rounded-full`}>
                        {food.score}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{food.brand}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium">Nutritional Value</span>
                        <span className="text-xs text-gray-500">{food.score}/100</span>
                      </div>
                      <Progress value={food.score} className="h-2" indicatorColor={getScoreColor(food.score)} />
                    </div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Benefits over {currentFood.name}:</h5>
                  <ul className="space-y-1">
                    {food.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="text-teal-500 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 p-3 rounded-lg mt-4">
              <h3 className="font-medium text-blue-800 mb-2">Tips for Healthier Choices</h3>
              <ul className="space-y-2">
                <li className="text-sm text-blue-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Look for products with shorter ingredient lists and recognizable ingredients.</span>
                </li>
                <li className="text-sm text-blue-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Choose whole foods over highly processed options when possible.</span>
                </li>
                <li className="text-sm text-blue-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Compare nutrition facts between similar products to find better options.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlternativesSheet;
