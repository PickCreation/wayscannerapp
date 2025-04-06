import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark, CircleCheck, Vegan, Fish, Edit, Info, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

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
    score: 50,
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
  }
];

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Find the food item based on the ID from URL params
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

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-medium">Food Detail</h1>
        <div className="w-10 h-10 flex items-center justify-center">
          {/* Placeholder for right side button */}
          <div className="w-6 h-6"></div>
        </div>
      </header>

      {/* Food Summary Card */}
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

      {/* Per Serving */}
      <div className="mx-4 mt-6 text-center">
        <p className="text-gray-500 text-sm border-b border-dashed border-gray-300 pb-2">
          -------------------------- per serving ({food.serving}) --------------------------
        </p>
      </div>

      {/* Negatives Section */}
      <div className="bg-white rounded-lg shadow-sm mx-4 mt-6 p-4">
        <h3 className="text-xl font-bold mb-4">Negatives</h3>
        <div className="space-y-4">
          {food.nutrients.negatives.map((nutrient, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 flex items-center">
                {nutrient.name === "Sodium" ? (
                  <span className="text-teal-600 mr-2">🧂</span>
                ) : (
                  <span className="text-purple-600 mr-2">🍬</span>
                )}
                <span className="font-medium">{nutrient.name}</span>
              </div>
              <div className="flex-1 mx-4">
                <Progress 
                  value={nutrient.progress} 
                  className="h-2 bg-gray-200" 
                />
              </div>
              <div className="w-16 text-right font-medium">{nutrient.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Positives (Highlights) Section */}
      <div className="mx-4 mt-6">
        <h3 className="text-xl font-bold mb-4">Positives</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {food.nutrients.highlights.map((highlight, index) => (
            <div key={index} className={`${highlight.color} p-4 rounded-lg text-center`}>
              <div className="text-3xl mb-1">{highlight.icon}</div>
              <div className="text-xl font-bold">{highlight.value}</div>
              <div className={`text-sm ${highlight.textColor}`}>{highlight.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="space-y-4">
            {food.nutrients.positives.map((nutrient, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 flex items-center">
                  {nutrient.name === "Fiber" && <span className="text-teal-600 mr-2">🌿</span>}
                  {nutrient.name === "Sugar" && <span className="text-purple-600 mr-2">🍬</span>}
                  {nutrient.name === "Saturated Fat" && <span className="text-blue-600 mr-2">🧈</span>}
                  {nutrient.name === "Calcium" && <span className="text-teal-600 mr-2">🥛</span>}
                  {nutrient.name === "Vitamin D" && <span className="text-yellow-600 mr-2">☀️</span>}
                  {nutrient.name === "Potassium" && <span className="text-red-700 mr-2">🍌</span>}
                  <span className="font-medium">{nutrient.name}</span>
                </div>
                <div className="flex-1 mx-4">
                  <Progress 
                    value={nutrient.progress} 
                    className="h-2 bg-gray-200" 
                  />
                </div>
                <div className="w-16 text-right font-medium">{nutrient.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="bg-white rounded-lg shadow-sm mx-4 mt-6 p-4">
        <h3 className="text-xl font-bold mb-4">Ingredients</h3>
        <p className="text-gray-800 mb-4">{food.ingredients}</p>
        
        <div className="space-y-3">
          {food.certifications.map((certification, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg flex items-center">
              <CircleCheck className="h-6 w-6 text-teal-500 mr-2" />
              <span>{certification}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allergy & Diet Info */}
      <div className="bg-white rounded-lg shadow-sm mx-4 mt-6 p-4">
        <h3 className="text-xl font-bold mb-4">Allergy & Diet Info</h3>
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-3">
          {food.dietInfo.includes("Vegan") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <Vegan className="h-4 w-4" />
              <span>Vegan</span>
            </Badge>
          )}
          {food.dietInfo.includes("Fish") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <Fish className="h-4 w-4" />
              <span>Fish</span>
            </Badge>
          )}
          {food.dietInfo.includes("Contains Milk") && (
            <Badge variant="outline" className="py-1.5 px-4 flex items-center gap-2 rounded-full border-2">
              <span>🥛</span>
              <span>Contains Milk</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Other Section */}
      <div className="bg-white rounded-lg shadow-sm mx-4 mt-6 p-4 mb-8">
        <h3 className="text-xl font-bold mb-4">Other</h3>
        
        <button className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-3">
          <div className="flex items-center">
            <Edit className="h-6 w-6 mx-3" />
            <span className="font-medium">Edit Preferences</span>
          </div>
          <ChevronRight className="h-6 w-6 mx-3 text-gray-400" />
        </button>
        
        <button className="w-full py-3 flex items-center justify-between bg-gray-100 rounded-lg mb-6">
          <div className="flex items-center">
            <Info className="h-6 w-6 mx-3" />
            <span className="font-medium">How do we score food?</span>
          </div>
          <ChevronRight className="h-6 w-6 mx-3 text-gray-400" />
        </button>
        
        <Separator className="my-4" />
        
        <p className="text-center text-sm text-gray-600 px-4">
          We don't partner with any brand or product, so the scores we provide are unbiased.
        </p>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />

      {/* Camera Sheet */}
      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
    </div>
  );
};

export default FoodDetailPage;
