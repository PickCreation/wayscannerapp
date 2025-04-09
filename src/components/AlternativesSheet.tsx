
import React from "react";
import { X, ChevronRight } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";

interface Food {
  id: string;
  name: string;
  brand: string;
  score: number;
  imageUrl: string;
  serving: string;
  nutrients: {
    negatives: { name: string; value: string; progress: number; color: string }[];
    positives: { name: string; value: string; progress: number; color: string }[];
    highlights?: { name: string; value: string; icon: string; color: string; textColor: string }[];
  };
  ingredients: string;
  certifications: string[];
  dietInfo: string[];
}

interface AlternativesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFood: Food;
}

// Sample healthier alternatives based on food score
const getHealthierAlternatives = (currentFood: Food) => {
  // Mock data for alternatives
  const alternatives = [
    {
      id: "alt1",
      name: "Ezekiel Bread",
      brand: "Food for Life",
      score: 95,
      imageUrl: "/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png",
      benefits: ["Higher fiber", "Lower sodium", "No added sugars", "Sprouted grains"],
      why: "Made from sprouted whole grains and contains no added sugars or preservatives."
    },
    {
      id: "alt2",
      name: "Sourdough Bread",
      brand: "Artisan Bakers",
      score: 88,
      imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
      benefits: ["Easier to digest", "Lower glycemic index", "Probiotic properties"],
      why: "Fermentation process breaks down gluten and creates beneficial bacteria."
    },
    {
      id: "alt3",
      name: "Thin Rice Cakes",
      brand: "Lundberg",
      score: 84,
      imageUrl: "/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png",
      benefits: ["Gluten-free", "Low calorie", "No added fat", "Simple ingredients"],
      why: "Made from whole grain brown rice with no artificial additives."
    }
  ];

  // For junk food like chips, show healthier snack alternatives
  if (currentFood.name.includes("Chips")) {
    return [
      {
        id: "alt4",
        name: "Air-popped Popcorn",
        brand: "Skinny Pop",
        score: 85,
        imageUrl: "/lovable-uploads/3981fb88-0fa3-404e-8a77-3a58ae1e0347.png",
        benefits: ["High fiber", "Low calorie", "Whole grain", "No artificial additives"],
        why: "Whole grain snack with fiber and lower calories than chips."
      },
      {
        id: "alt5",
        name: "Roasted Chickpeas",
        brand: "Biena",
        score: 92,
        imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
        benefits: ["High protein", "High fiber", "Plant-based", "Lower sodium"],
        why: "Crunchy snack with more protein and fiber than traditional chips."
      },
      {
        id: "alt6",
        name: "Vegetable Chips",
        brand: "Terra",
        score: 82,
        imageUrl: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
        benefits: ["Made from vegetables", "Higher nutrients", "Lower sodium"],
        why: "Made from actual vegetables, providing more nutrients than potato chips."
      }
    ];
  }

  // For yogurt, show healthier yogurt alternatives
  if (currentFood.name.includes("Yogurt")) {
    return [
      {
        id: "alt7",
        name: "Plain Greek Yogurt",
        brand: "Fage",
        score: 90,
        imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
        benefits: ["Higher protein", "No added sugar", "Probiotic", "Lower sodium"],
        why: "Plain yogurt without added sugars provides better nutritional value."
      },
      {
        id: "alt8",
        name: "Icelandic Skyr",
        brand: "Siggi's",
        score: 92,
        imageUrl: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
        benefits: ["Very high protein", "Lower sugar", "Traditional fermentation"],
        why: "Traditional Icelandic yogurt with higher protein and less sugar."
      },
      {
        id: "alt9",
        name: "Coconut Yogurt",
        brand: "So Delicious",
        score: 84,
        imageUrl: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
        benefits: ["Dairy-free", "Plant-based", "Good fats", "Low sodium"],
        why: "Plant-based alternative with beneficial medium-chain fatty acids."
      }
    ];
  }

  // Return default alternatives if no specific category is matched
  return alternatives;
};

const AlternativesSheet: React.FC<AlternativesSheetProps> = ({
  open,
  onOpenChange,
  currentFood
}) => {
  const alternatives = getHealthierAlternatives(currentFood);
  
  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-500";
    if (score >= 60) return "bg-purple-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <div className="p-4 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Healthier Alternatives</h2>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 flex items-center">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                <img 
                  src={currentFood.imageUrl} 
                  alt={currentFood.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Current: {currentFood.name}</h3>
                <div className="flex items-center mt-1">
                  <div className={`${getScoreColor(currentFood.score)} text-white px-2 py-0.5 rounded-full text-xs inline-flex items-center`}>
                    <span className="font-bold">{currentFood.score}</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Try these healthier options</h3>
            <div className="space-y-3">
              {alternatives.map((alternative) => (
                <Card key={alternative.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                          <img 
                            src={alternative.imageUrl} 
                            alt={alternative.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{alternative.name}</h4>
                            <div className={`${getScoreColor(alternative.score)} text-white px-2 py-0.5 rounded-full text-xs inline-flex items-center`}>
                              <span className="font-bold">{alternative.score}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{alternative.brand}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-1">Why it's better:</p>
                        <p className="text-sm text-gray-700">{alternative.why}</p>
                        
                        <div className="mt-2">
                          <p className="text-sm font-semibold mb-1">Benefits:</p>
                          <div className="flex flex-wrap gap-2">
                            {alternative.benefits.map((benefit, index) => (
                              <span 
                                key={index} 
                                className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mt-4">
              <p className="text-sm text-blue-800">
                These alternatives are suggested based on nutritional profile and health benefits. Individual dietary needs may vary.
              </p>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AlternativesSheet;
