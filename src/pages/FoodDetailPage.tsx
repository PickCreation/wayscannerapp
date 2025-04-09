import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark, CircleCheck, Vegan, Fish, Edit, Info, ChevronRight, BarChart2, ListCheck, Calendar, Leaf } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import EditPreferencesSheet from "@/components/EditPreferencesSheet";
import HowWeScoreSheet from "@/components/HowWeScoreSheet";
import ComparisonSheet from "@/components/ComparisonSheet";
import AlternativesSheet from "@/components/AlternativesSheet";
import NutrientInfoSheet from "@/components/NutrientInfoSheet";
import MealPlanningSheet from "@/components/MealPlanningSheet";
import EnvironmentSheet from "@/components/EnvironmentSheet";
import { toast } from "sonner";

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
        { name: "Sugar", value: "6g", progress: 30, color: "bg-purple-500" },
        { name: "Saturated Fat", value: "0.5g", progress: 25, color: "bg-blue-500" },
        { name: "Calcium", value: "20g", progress: 40, color: "bg-teal-500" },
        { name: "Vitamin D", value: "15g", progress: 35, color: "bg-yellow-500" },
        { name: "Potassium", value: "18%", progress: 45, color: "bg-red-700" },
      ],
      highlights: [
        { name: "Calories", value: "1,250", icon: "🔥", color: "bg-blue-50", textColor: "text-blue-800" },
        { name: "Protein", value: "89g", icon: "⚡", color: "bg-green-50", textColor: "text-green-800" },
        { name: "Water", value: "1.8L", icon: "💧", color: "bg-orange-50", textColor: "text-orange-600" },
      ]
    },
    ingredients: "Cultured pasteurized grade A nonfat milk, fruit pectin. Contains live and active cultures including L. acidophilus, Bifidus, and L. casei.",
    certifications: [
      "No artificial flavors, colors or preservatives",
      "Non-GMO Project Verified",
      "USDA Organic Certified"
    ],
    dietInfo: ["Vegan", "Fish"]
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
        { name: "Sugar", value: "2g", progress: 15, color: "bg-purple-500" },
        { name: "Saturated Fat", value: "1.5g", progress: 45, color: "bg-blue-500" },
        { name: "Calcium", value: "5g", progress: 10, color: "bg-teal-500" },
        { name: "Vitamin D", value: "0g", progress: 0, color: "bg-yellow-500" },
        { name: "Potassium", value: "5%", progress: 10, color: "bg-red-700" },
      ],
      highlights: [
        { name: "Calories", value: "210", icon: "🔥", color: "bg-blue-50", textColor: "text-blue-800" },
        { name: "Protein", value: "2g", icon: "⚡", color: "bg-green-50", textColor: "text-green-800" },
        { name: "Water", value: "0L", icon: "💧", color: "bg-orange-50", textColor: "text-orange-600" },
      ]
    },
    ingredients: "Corn, Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Maltodextrin (Made from Corn), Salt, Cheddar Cheese (Milk, Cheese Cultures, Salt, Enzymes), Whey, Monosodium Glutamate, Buttermilk, Romano Cheese (Part-Skim Cow's Milk, Cheese Cultures, Salt, Enzymes), Whey Protein Concentrate, Onion Powder, Corn Flour, Natural and Artificial Flavor, Dextrose, Tomato Powder, Lactose, Spices, Artificial Color (Yellow 6, Yellow 5, and Red 40), Lactic Acid, Citric Acid, Sugar, Garlic Powder, Skim Milk, Red and Green Bell Pepper Powder, Disodium Inosinate, and Disodium Guanylate.",
    certifications: [
      "Contains artificial flavors, colors and preservatives"
    ],
    dietInfo: ["Contains Milk"]
  },
  {
    id: "3",
    name: "Greek Yogurt",
    brand: "Chobani",
    score: 50,
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    serving: "150g",
    nutrients: {
      negatives: [
        { name: "Sodium", value: "65mg", progress: 25, color: "bg-red-500" },
        { name: "Sugar", value: "7g", progress: 32, color: "bg-purple-500" },
      ],
      positives: [
        { name: "Fiber", value: "0g", progress: 0, color: "bg-teal-500" },
        { name: "Protein", value: "15g", progress: 60, color: "bg-green-500" },
        { name: "Saturated Fat", value: "3g", progress: 40, color: "bg-blue-500" },
        { name: "Calcium", value: "15%", progress: 35, color: "bg-teal-500" },
        { name: "Vitamin D", value: "10%", progress: 25, color: "bg-yellow-500" },
        { name: "Potassium", value: "8%", progress: 20, color: "bg-red-700" },
      ],
      highlights: [
        { name: "Calories", value: "130", icon: "🔥", color: "bg-blue-50", textColor: "text-blue-800" },
        { name: "Protein", value: "15g", icon: "⚡", color: "bg-green-50", textColor: "text-green-800" },
        { name: "Water", value: "0.12L", icon: "💧", color: "bg-orange-50", textColor: "text-orange-600" },
      ]
    },
    ingredients: "Cultured Grade A Non-Fat Milk, Cream, Live and Active Cultures: S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, and L. Casei.",
    certifications: [
      "No artificial flavors",
      "No artificial preservatives",
      "Grade A"
    ],
    dietInfo: ["Contains Milk"]
  },
  {
    id: "4",
    name: "Chocolate Bar",
    brand: "Hershey's",
    score: 23,
    imageUrl: "/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png",
    serving: "43g",
    nutrients: {
      negatives: [
        { name: "Sodium", value: "35mg", progress: 15, color: "bg-red-500" },
        { name: "Sugar", value: "24g", progress: 85, color: "bg-purple-500" },
      ],
      positives: [
        { name: "Fiber", value: "2g", progress: 20, color: "bg-teal-500" },
        { name: "Protein", value: "3g", progress: 15, color: "bg-green-500" },
        { name: "Saturated Fat", value: "8g", progress: 75, color: "bg-blue-500" },
        { name: "Calcium", value: "8%", progress: 20, color: "bg-teal-500" },
        { name: "Vitamin D", value: "0%", progress: 0, color: "bg-yellow-500" },
        { name: "Potassium", value: "4%", progress: 10, color: "bg-red-700" },
      ],
      highlights: [
        { name: "Calories", value: "210", icon: "🔥", color: "bg-blue-50", textColor: "text-blue-800" },
        { name: "Protein", value: "3g", icon: "⚡", color: "bg-green-50", textColor: "text-green-800" },
        { name: "Water", value: "0L", icon: "💧", color: "bg-orange-50", textColor: "text-orange-600" },
      ]
    },
    ingredients: "Sugar, Milk, Chocolate, Cocoa Butter, Lactose, Milk Fat, Soy Lecithin, PGPR, Emulsifier, Vanillin, Artificial Flavor.",
    certifications: [
      "Contains artificial flavors"
    ],
    dietInfo: ["Contains Milk", "Contains Soy"]
  }
];

type Diet = "Vegan" | "Vegetarian" | null;
type Allergy = "Sesame" | "Peanuts" | "Eggs" | "Shellfish" | "Lactose" | "Soy" | "Nuts" | "Fish" | "Milk" | "Gluten";

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [editPreferencesOpen, setEditPreferencesOpen] = useState(false);
  const [howWeScoreOpen, setHowWeScoreOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [alternativesOpen, setAlternativesOpen] = useState(false);
  const [nutrientInfoOpen, setNutrientInfoOpen] = useState(false);
  const [mealPlanningOpen, setMealPlanningOpen] = useState(false);
  const [environmentOpen, setEnvironmentOpen] = useState(false);
  const [userDiet, setUserDiet] = useState<Diet>(null);
  const [userAllergies, setUserAllergies] = useState<Allergy[]>([]);
  
  const food = foodItems.find(item => item.id === foodId);
  
  if (!food) {
    return <div>Food not found</div>;
  }

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    }
  };

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };

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
  
  const handleSavePreferences = (diet: Diet, allergies: Allergy[]) => {
    setUserDiet(diet);
    setUserAllergies(allergies);
    toast.success("Preferences saved successfully!");
  };

  const getAllergyIcon = (allergy: Allergy) => {
    switch(allergy) {
      case "Sesame": return "🌰";
      case "Peanuts": return "🥜";
      case "Eggs": return "🥚";
      case "Shellfish": return "🦞";
      case "Lactose": return "🧀";
      case "Soy": return "🌱";
      case "Nuts": return "🌰";
      case "Fish": return "🐟";
      case "Milk": return "🥛";
      case "Gluten": return "🌾";
      default: return "⚠️";
    }
  };

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

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-xl font-semibold">Food Details</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          <div className="w-6 h-6"></div>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm mx-4 mt-4 overflow-hidden">
        <div className="flex p-4 items-center">
          <div className="mr-4 w-20 h-20 rounded-lg overflow-hidden">
            <img 
              src={food.imageUrl} 
              alt={food.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{food.name}</h2>
            <p className="text-blue-500 text-sm font-medium">{food.brand}</p>
            <div className="flex items-center mt-2">
              <div className={`${getScoreColor(food.score)} text-white px-3 py-1 rounded-full inline-flex items-center text-sm`}>
                <span className="font-bold mr-1">{food.score}</span>
                <span>{getScoreText(food.score)}</span>
              </div>
            </div>
          </div>
          <button 
            className="p-2 text-red-500"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark 
              className={`h-6 w-6 ${isBookmarked ? 'fill-red-500' : ''}`} 
            />
          </button>
        </div>
      </div>

      <div className="mx-4 mt-4 text-center">
        <p className="text-gray-500 text-sm pb-2">
          per serving ({food.serving})
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-4 mt-4 p-4">
        <h3 className="text-lg font-bold mb-4">Negatives</h3>
        <div className="space-y-4">
          {food.nutrients.negatives.map((nutrient, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 flex items-center">
                {nutrient.name === "Sodium" ? (
                  <span className="text-teal-600 mr-2 text-base">🧂</span>
                ) : (
                  <span className="text-purple-600 mr-2 text-base">🍬</span>
                )}
                <span className="font-medium text-base">{nutrient.name}</span>
              </div>
              <div className="flex-1 mx-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Progress 
                          value={nutrient.progress} 
                          className="h-2.5 bg-gray-200" 
                          indicatorColor={getNutrientColor(nutrient.name, index)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {nutrient.name === "Sodium" ? "High sodium can lead to high blood pressure" : "High sugar can lead to weight gain"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="w-16 text-right font-medium text-base">{nutrient.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-5">
        <h3 className="text-lg font-bold mb-4">Positives</h3>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {food.nutrients.highlights.map((highlight, index) => (
            <div key={index} className={`${highlight.color} p-3 rounded-lg text-center`}>
              <div className="text-2xl mb-1">{highlight.icon}</div>
              <div className="text-base font-bold">{highlight.value}</div>
              <div className={`text-sm ${highlight.textColor}`}>{highlight.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="space-y-4">
            {food.nutrients.positives.map((nutrient, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 flex items-center">
                  {nutrient.name === "Fiber" && <span className="text-teal-600 mr-2 text-base">🌿</span>}
                  {nutrient.name === "Sugar" && <span className="text-purple-600 mr-2 text-base">🍬</span>}
                  {nutrient.name === "Saturated Fat" && <span className="text-blue-600 mr-2 text-base">🧈</span>}
                  {nutrient.name === "Calcium" && <span className="text-teal-600 mr-2 text-base">🥛</span>}
                  {nutrient.name === "Vitamin D" && <span className="text-yellow-600 mr-2 text-base">☀️</span>}
                  {nutrient.name === "Potassium" && <span className="text-red-700 mr-2 text-base">🍌</span>}
                  <span className="font-medium text-base">{nutrient.name}</span>
                </div>
                <div className="flex-1 mx-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Progress 
                            value={nutrient.progress} 
                            className="h-2.5 bg-gray-200" 
                            indicatorColor={getNutrientColor(nutrient.name, index)}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          {nutrient.name === "Fiber" && "Fiber aids digestion and helps you feel full"}
                          {nutrient.name === "Protein" && "Protein helps build and repair muscles"}
                          {nutrient.name === "Calcium" && "Calcium strengthens bones and teeth"}
                          {nutrient.name === "Vitamin D" && "Vitamin D helps calcium absorption"}
                          {nutrient.name === "Potassium" && "Potassium regulates heartbeat and nerve signals"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="w-16 text-right font-medium text-base">{nutrient.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-4 mt-5 p-4">
        <h3 className="text-lg font-bold mb-4">Ingredients</h3>
        <p className="text-gray-800 text-base mb-4">{food.ingredients}</p>
        
        <div className="space-y-3">
          {food.certifications.map((certification, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg flex items-center">
              <CircleCheck className="h-5 w-5 text-teal-500 mr-2" />
              <span className="text-base">{certification}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-4 mt-5 p-4">
        <h3 className="text-lg font-bold mb-4">Allergy & Diet Info</h3>
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-3">
          {food.dietInfo.includes("Vegan") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <Vegan className="h-4 w-4" />
              <span className="text-base">Vegan</span>
            </Badge>
          )}
          {food.dietInfo.includes("Fish") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <Fish className="h-4 w-4" />
              <span className="text-base">Fish</span>
            </Badge>
          )}
          {food.dietInfo.includes("Contains Milk") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <span>🥛</span>
              <span className="text-base">Contains Milk</span>
            </Badge>
          )}
          {food.dietInfo.includes("Contains Soy") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <span>🌱</span>
              <span className="text-base">Contains Soy</span>
            </Badge>
          )}
          
          {userDiet && !food.dietInfo.includes(userDiet) && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2 border-blue-500 bg-blue-50">
              {userDiet === "Vegan" && <span>🌱</span>}
              {userDiet === "Vegetarian" && <span>🥦</span>}
              <span className="text-base text-blue-800">{userDiet}</span>
            </Badge>
          )}
          
          {userAllergies.map(allergy => (
            <Badge key={allergy} variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2 border-red-400 bg-red-50">
              <span>{getAllergyIcon(allergy)}</span>
              <span className="text-base text-red-800">{allergy}</span>
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-4 mt-5 p-4 mb-6">
        <h3 className="text-lg font-bold mb-4">Other</h3>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3"
          onClick={() => setEditPreferencesOpen(true)}
        >
          <div className="flex items-center">
            <Edit className="h-5 w-5 mx-3" />
            <span className="font-medium text-base">Edit Preferences</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3"
          onClick={() => setComparisonOpen(true)}
        >
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mx-3" />
            <span className="font-medium text-base">Compare Foods</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3"
          onClick={() => setAlternativesOpen(true)}
        >
          <div className="flex items-center">
            <ListCheck className="h-5 w-5 mx-3" />
            <span className="font-medium text-base">Healthier Alternatives</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3"
          onClick={() => setNutrientInfoOpen(true)}
        >
          <div className="flex items-center">
            <Info className="h-5 w-5 mx-3" />
            <span className="font-medium text-base">Nutrition Education</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3"
          onClick={() => setEnvironmentOpen(true)}
        >
          <div className="flex items-center">
            <Leaf className="h-5 w-5 mx-3 text-green-500" />
            <span className="font-medium text-base">Environment</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3"
          onClick={() => setMealPlanningOpen(true)}
        >
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mx-3" />
            <span className="font-medium text-base">Meal Planning Suggestions</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-5"
          onClick={() => setHowWeScoreOpen(true)}
        >
          <div className="flex items-center">
            <Info className="h-5 w-5 mx-3" />
            <span className="font-medium text-base">How do we score food?</span>
          </div>
          <ChevronRight className="h-5 w-5 mx-3 text-gray-400" />
        </button>
        
        <Separator className="my-4" />
        
        <p className="text-center text-sm text-gray-600 px-4">
          We don't partner with any brand or product, so the scores we provide are unbiased.
        </p>
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />

      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
      
      <EditPreferencesSheet 
        open={editPreferencesOpen} 
        onOpenChange={setEditPreferencesOpen} 
        onSave={handleSavePreferences}
        initialDiet={userDiet}
        initialAllergies={userAllergies}
      />
      
      <HowWeScoreSheet
        open={howWeScoreOpen}
        onOpenChange={setHowWeScoreOpen}
      />
      
      <ComparisonSheet 
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        currentFoodId={foodId as string}
      />
      
      <AlternativesSheet 
        open={alternativesOpen}
        onOpenChange={setAlternativesOpen}
        currentFood={food}
      />
      
      <NutrientInfoSheet 
        open={nutrientInfoOpen}
        onOpenChange={setNutrientInfoOpen}
      />
      
      <EnvironmentSheet
        open={environmentOpen}
        onOpenChange={setEnvironmentOpen}
        currentFood={food}
      />
      
      <MealPlanningSheet 
        open={mealPlanningOpen}
        onOpenChange={setMealPlanningOpen}
        currentFood={food}
      />
    </div>
  );
};

export default FoodDetailPage;
