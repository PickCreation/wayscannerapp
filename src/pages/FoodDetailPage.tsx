import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark, CircleCheck, Vegan, Fish, Edit, Info, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import EditPreferencesSheet from "@/components/EditPreferencesSheet";
import HowWeScoreSheet from "@/components/HowWeScoreSheet";
import { toast } from "sonner";

// Sample food data to simulate fetching from API
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
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
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

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <header className="bg-wayscanner-blue text-white py-3 px-3 flex justify-between items-center">
        <button 
          className="p-1.5" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" color="white" />
        </button>
        <h1 className="text-[18px] font-medium">Food Detail</h1>
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-5 h-5"></div>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm mx-3 mt-3 overflow-hidden">
        <div className="flex p-3 items-center">
          <div className="mr-3 w-16 h-16 rounded-lg overflow-hidden">
            <img 
              src={food.imageUrl} 
              alt={food.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-[16px] font-bold">{food.name}</h2>
            <p className="text-blue-500 text-xs font-medium">{food.brand}</p>
            <div className="flex items-center mt-1.5">
              <div className={`${getScoreColor(food.score)} text-white px-2 py-0.5 rounded-full inline-flex items-center text-xs`}>
                <span className="font-bold mr-0.5">{food.score}</span>
                <span>{getScoreText(food.score)}</span>
              </div>
            </div>
          </div>
          <button 
            className="p-1.5 text-red-500"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark 
              className={`h-5 w-5 ${isBookmarked ? 'fill-red-500' : ''}`} 
            />
          </button>
        </div>
      </div>

      <div className="mx-3 mt-4 text-center">
        <p className="text-gray-500 text-xs pb-1.5">
          per serving ({food.serving})
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-3 mt-4 p-3">
        <h3 className="text-[16px] font-bold mb-3">Negatives</h3>
        <div className="space-y-3">
          {food.nutrients.negatives.map((nutrient, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 flex items-center">
                {nutrient.name === "Sodium" ? (
                  <span className="text-teal-600 mr-1.5 text-[14px]">🧂</span>
                ) : (
                  <span className="text-purple-600 mr-1.5 text-[14px]">🍬</span>
                )}
                <span className="font-medium text-[14px]">{nutrient.name}</span>
              </div>
              <div className="flex-1 mx-3">
                <Progress 
                  value={nutrient.progress} 
                  className="h-1.5 bg-gray-200" 
                />
              </div>
              <div className="w-14 text-right font-medium text-[14px]">{nutrient.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-3 mt-4">
        <h3 className="text-[16px] font-bold mb-3">Positives</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {food.nutrients.highlights.map((highlight, index) => (
            <div key={index} className={`${highlight.color} p-2.5 rounded-lg text-center`}>
              <div className="text-2xl mb-0.5">{highlight.icon}</div>
              <div className="text-[14px] font-bold">{highlight.value}</div>
              <div className={`text-xs ${highlight.textColor}`}>{highlight.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="space-y-3">
            {food.nutrients.positives.map((nutrient, index) => (
              <div key={index} className="flex items-center">
                <div className="w-28 flex items-center">
                  {nutrient.name === "Fiber" && <span className="text-teal-600 mr-1.5 text-[14px]">🌿</span>}
                  {nutrient.name === "Sugar" && <span className="text-purple-600 mr-1.5 text-[14px]">🍬</span>}
                  {nutrient.name === "Saturated Fat" && <span className="text-blue-600 mr-1.5 text-[14px]">🧈</span>}
                  {nutrient.name === "Calcium" && <span className="text-teal-600 mr-1.5 text-[14px]">🥛</span>}
                  {nutrient.name === "Vitamin D" && <span className="text-yellow-600 mr-1.5 text-[14px]">☀️</span>}
                  {nutrient.name === "Potassium" && <span className="text-red-700 mr-1.5 text-[14px]">🍌</span>}
                  <span className="font-medium text-[14px]">{nutrient.name}</span>
                </div>
                <div className="flex-1 mx-3">
                  <Progress 
                    value={nutrient.progress} 
                    className="h-1.5 bg-gray-200" 
                  />
                </div>
                <div className="w-14 text-right font-medium text-[14px]">{nutrient.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-3 mt-4 p-3">
        <h3 className="text-[16px] font-bold mb-3">Ingredients</h3>
        <p className="text-gray-800 text-[14px] mb-3">{food.ingredients}</p>
        
        <div className="space-y-2">
          {food.certifications.map((certification, index) => (
            <div key={index} className="bg-gray-100 p-2.5 rounded-lg flex items-center">
              <CircleCheck className="h-4 w-4 text-teal-500 mr-1.5" />
              <span className="text-[14px]">{certification}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-3 mt-4 p-3">
        <h3 className="text-[16px] font-bold mb-3">Allergy & Diet Info</h3>
        <Separator className="my-3" />
        
        <div className="flex flex-wrap gap-2">
          {food.dietInfo.includes("Vegan") && (
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1.5 rounded-full border-2">
              <Vegan className="h-3.5 w-3.5" />
              <span className="text-[14px]">Vegan</span>
            </Badge>
          )}
          {food.dietInfo.includes("Fish") && (
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1.5 rounded-full border-2">
              <Fish className="h-3.5 w-3.5" />
              <span className="text-[14px]">Fish</span>
            </Badge>
          )}
          {food.dietInfo.includes("Contains Milk") && (
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1.5 rounded-full border-2">
              <span>🥛</span>
              <span className="text-[14px]">Contains Milk</span>
            </Badge>
          )}
          {food.dietInfo.includes("Contains Soy") && (
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1.5 rounded-full border-2">
              <span>🌱</span>
              <span className="text-[14px]">Contains Soy</span>
            </Badge>
          )}
          
          {userDiet && !food.dietInfo.includes(userDiet) && (
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1.5 rounded-full border-2 border-blue-500 bg-blue-50">
              {userDiet === "Vegan" && <span>🌱</span>}
              {userDiet === "Vegetarian" && <span>🥦</span>}
              <span className="text-[14px] text-blue-800">{userDiet}</span>
            </Badge>
          )}
          
          {userAllergies.map(allergy => (
            <Badge key={allergy} variant="outline" className="py-1 px-3 flex items-center gap-1.5 rounded-full border-2 border-red-400 bg-red-50">
              <span>{getAllergyIcon(allergy)}</span>
              <span className="text-[14px] text-red-800">{allergy}</span>
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-3 mt-4 p-3 mb-6">
        <h3 className="text-[16px] font-bold mb-3">Other</h3>
        
        <button 
          className="w-full py-2.5 flex items-center justify-between bg-gray-100 rounded-lg mb-2.5"
          onClick={() => setEditPreferencesOpen(true)}
        >
          <div className="flex items-center">
            <Edit className="h-4 w-4 mx-2.5" />
            <span className="font-medium text-[14px]">Edit Preferences</span>
          </div>
          <ChevronRight className="h-4 w-4 mx-2.5 text-gray-400" />
        </button>
        
        <button 
          className="w-full py-2.5 flex items-center justify-between bg-gray-100 rounded-lg mb-4"
          onClick={() => setHowWeScoreOpen(true)}
        >
          <div className="flex items-center">
            <Info className="h-4 w-4 mx-2.5" />
            <span className="font-medium text-[14px]">How do we score food?</span>
          </div>
          <ChevronRight className="h-4 w-4 mx-2.5 text-gray-400" />
        </button>
        
        <Separator className="my-3" />
        
        <p className="text-center text-xs text-gray-600 px-3">
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
    </div>
  );
};

export default FoodDetailPage;
