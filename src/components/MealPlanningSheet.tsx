
import React from "react";
import { X, Info } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface MealPlanningSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFood: Food;
}

// Generate meal ideas based on the food
const generateMealIdeas = (food: Food) => {
  // Bread-based meal ideas
  if (food.name.includes("Bread")) {
    return {
      category: "Bread",
      breakfast: [
        {
          name: "Avocado Toast with Poached Egg",
          ingredients: ["Whole wheat bread", "Avocado", "Eggs", "Cherry tomatoes", "Lemon juice"],
          nutritionTip: "The healthy fats from avocado combined with protein from eggs creates a balanced breakfast with sustained energy."
        },
        {
          name: "Almond Butter & Banana Toast",
          ingredients: ["Whole wheat bread", "Almond butter", "Banana", "Cinnamon", "Honey (optional)"],
          nutritionTip: "A great pre-workout meal with complex carbs and potassium from bananas to support muscle function."
        }
      ],
      lunch: [
        {
          name: "Open-Faced Veggie Sandwich",
          ingredients: ["Whole wheat bread", "Hummus", "Cucumber", "Bell pepper", "Sprouts", "Feta cheese"],
          nutritionTip: "Packed with fiber, plant protein, and a variety of nutrients from the vegetables."
        },
        {
          name: "Tuna Melt",
          ingredients: ["Whole wheat bread", "Canned tuna", "Greek yogurt", "Diced celery", "Lemon juice", "Cheese"],
          nutritionTip: "High in protein and omega-3 fatty acids which support heart and brain health."
        }
      ],
      dinner: [
        {
          name: "Garlic Bread with Lentil Soup",
          ingredients: ["Whole wheat bread", "Olive oil", "Garlic", "Lentil soup"],
          nutritionTip: "Lentils provide plant protein and iron, while the bread adds complex carbohydrates for a satisfying meal."
        },
        {
          name: "Bread Bowl Vegetable Stew",
          ingredients: ["Whole wheat bread", "Mixed vegetables", "Beans", "Vegetable broth", "Herbs"],
          nutritionTip: "A hearty, fiber-rich dinner with plenty of plant-based nutrients."
        }
      ]
    };
  }
  
  // Chip-based meal ideas
  if (food.name.includes("Chips")) {
    return {
      category: "Chips/Snacks",
      snacks: [
        {
          name: "Balanced Snack Plate",
          ingredients: ["Small portion of chips", "Hummus", "Carrot sticks", "Apple slices"],
          nutritionTip: "Balancing chips with protein and fresh produce creates a more nutritious snack with better blood sugar control."
        },
        {
          name: "Mexican-inspired Yogurt Dip",
          ingredients: ["Small portion of chips", "Greek yogurt", "Lime juice", "Cilantro", "Taco seasoning"],
          nutritionTip: "Using Greek yogurt as a dip adds protein and calcium to offset the simple carbs in chips."
        }
      ],
      sides: [
        {
          name: "Healthier Loaded Nachos",
          ingredients: ["Baked tortilla chips", "Black beans", "Avocado", "Plain Greek yogurt", "Fresh salsa"],
          nutritionTip: "Adding beans and vegetables to nachos increases fiber, protein and nutrient content."
        },
        {
          name: "Crushed Chip Topping",
          ingredients: ["Small amount of crushed chips", "Baked fish", "Lemon juice", "Herbs"],
          nutritionTip: "Using chips as a crunchy topping rather than the main component helps control portions."
        }
      ],
      alternatives: [
        {
          name: "Kale Chips",
          ingredients: ["Kale leaves", "Olive oil", "Sea salt", "Nutritional yeast"],
          nutritionTip: "A nutrient-dense alternative with vitamin K, A and antioxidants."
        },
        {
          name: "Roasted Chickpeas",
          ingredients: ["Chickpeas", "Olive oil", "Spices of choice"],
          nutritionTip: "High in protein and fiber for a more filling and nutritious crunchy snack."
        }
      ]
    };
  }
  
  // Yogurt-based meal ideas
  if (food.name.includes("Yogurt")) {
    return {
      category: "Yogurt",
      breakfast: [
        {
          name: "Protein-Packed Parfait",
          ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Chopped nuts", "Honey"],
          nutritionTip: "Contains probiotics for gut health plus antioxidants from berries."
        },
        {
          name: "Yogurt Banana Oatmeal",
          ingredients: ["Greek yogurt", "Cooked oats", "Banana", "Cinnamon", "Walnuts"],
          nutritionTip: "Combines protein with complex carbs for lasting energy."
        }
      ],
      snacks: [
        {
          name: "Savory Yogurt Bowl",
          ingredients: ["Greek yogurt", "Cucumber", "Olive oil", "Herbs", "Pine nuts"],
          nutritionTip: "A Mediterranean-inspired protein snack with healthy fats."
        },
        {
          name: "Frozen Yogurt Bites",
          ingredients: ["Greek yogurt", "Frozen berries", "Honey"],
          nutritionTip: "A calcium-rich alternative to ice cream with less sugar."
        }
      ],
      sauces: [
        {
          name: "Yogurt Tzatziki",
          ingredients: ["Greek yogurt", "Cucumber", "Garlic", "Lemon juice", "Dill"],
          nutritionTip: "A protein-rich sauce for vegetables, grilled meats, or as a sandwich spread."
        },
        {
          name: "Curry Yogurt Marinade",
          ingredients: ["Greek yogurt", "Curry powder", "Lemon juice", "Garlic"],
          nutritionTip: "Yogurt tenderizes protein while adding calcium and probiotics."
        }
      ]
    };
  }
  
  // Default meal ideas for chocolate and other foods
  return {
    category: "General",
    breakfast: [
      {
        name: "Balanced Breakfast Bowl",
        ingredients: ["Whole grains", "Protein source", "Healthy fat", "Fruit or vegetable"],
        nutritionTip: "A balanced breakfast should include protein, complex carbs, and healthy fats."
      }
    ],
    lunch: [
      {
        name: "Power-Packed Plate",
        ingredients: ["Lean protein", "Complex carbohydrate", "Colorful vegetables", "Healthy fat"],
        nutritionTip: "Aim for a colorful plate with at least half filled with vegetables."
      }
    ],
    dinner: [
      {
        name: "Balanced Evening Meal",
        ingredients: ["Palm-sized protein portion", "Fist-sized carbohydrate portion", "Two fists of vegetables", "Thumb of healthy fat"],
        nutritionTip: "Using hand portions can help create balanced meals without measuring."
      }
    ],
    snacks: [
      {
        name: "Nutrient-Dense Snacks",
        ingredients: ["Protein source", "Fiber source", "Hydrating component"],
        nutritionTip: "Snacks with protein and fiber help maintain steady energy levels."
      }
    ]
  };
};

const MealPlanningSheet: React.FC<MealPlanningSheetProps> = ({
  open,
  onOpenChange,
  currentFood
}) => {
  const mealIdeas = generateMealIdeas(currentFood);
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0 flex flex-col">
        <div className="bg-white z-10 p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Meal Planning Suggestions</h2>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100">
              <X size={20} />
            </SheetClose>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <div className="flex">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                <img 
                  src={currentFood.imageUrl} 
                  alt={currentFood.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">Planning meals with {currentFood.name}</h3>
                <p className="text-sm text-blue-700">
                  Here are balanced meal ideas that include this food
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4">
            {/* Breakfast Ideas */}
            {mealIdeas.breakfast && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Breakfast Ideas</h3>
                <div className="space-y-3">
                  {mealIdeas.breakfast.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Lunch Ideas */}
            {mealIdeas.lunch && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Lunch Ideas</h3>
                <div className="space-y-3">
                  {mealIdeas.lunch.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Dinner Ideas */}
            {mealIdeas.dinner && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Dinner Ideas</h3>
                <div className="space-y-3">
                  {mealIdeas.dinner.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Snack Ideas */}
            {mealIdeas.snacks && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Snack Ideas</h3>
                <div className="space-y-3">
                  {mealIdeas.snacks.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Side Dish Ideas */}
            {mealIdeas.sides && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Side Dish Ideas</h3>
                <div className="space-y-3">
                  {mealIdeas.sides.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Sauce Ideas */}
            {mealIdeas.sauces && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Sauce & Dip Ideas</h3>
                <div className="space-y-3">
                  {mealIdeas.sauces.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Healthier Alternatives */}
            {mealIdeas.alternatives && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Healthier Alternatives</h3>
                <div className="space-y-3">
                  {mealIdeas.alternatives.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meal.name}</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm max-w-xs">{meal.nutritionTip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-semibold">Ingredients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add bottom padding for scrolling */}
            <div className="h-4"></div>
          </div>
        </ScrollArea>
        
        <div className="bg-green-50 p-3 border-t mt-auto">
          <p className="text-sm text-green-800">
            Tip: Building balanced meals helps moderate the impact of less nutritious foods. Try to pair foods with protein, fiber, and healthy fats.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MealPlanningSheet;
