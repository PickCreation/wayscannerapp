
import React, { useState } from "react";
import { 
  Search, 
  ChevronRight, 
  Coffee, 
  Utensils, 
  Soup,
  Cookie,
  ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";

const trendingRecipes = [
  {
    id: "stir-fry-1",
    title: "Vegetable Stir Fry",
    time: "20 mins",
    rating: 4.5,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "smoothie-bowl",
    title: "Acai Smoothie Bowl",
    time: "10 mins",
    rating: 4.7,
    reviews: 93,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "chicken-salad",
    title: "Grilled Chicken Salad",
    time: "25 mins",
    rating: 4.6,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    time: "15 mins",
    rating: 4.4,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1603046891744-1f76eb10aec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  }
];

const categories = [
  { id: "breakfast", name: "Breakfast", icon: <Coffee size={20} color="#FF9800" /> },
  { id: "lunch", name: "Lunch", icon: <Utensils size={20} color="#4CAF50" /> },
  { id: "dinner", name: "Dinner", icon: <Soup size={20} color="#9C27B0" /> },
  { id: "dessert", name: "Dessert", icon: <Cookie size={20} color="#E91E63" /> }
];

const RecipesPage = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("recipes");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
      return;
    }
    
    if (item === "forum") {
      navigate("/forum");
      return;
    }
    
    if (item !== "recipes") {
      toast({
        title: "Coming Soon",
        description: `The ${item} feature is under development.`,
      });
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for "${searchQuery}"...`,
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    toast({
      title: "Category Selected",
      description: `Browsing the "${categoryId}" category.`,
    });
  };

  const handleViewAll = () => {
    toast({
      title: "View All",
      description: "Viewing all trending recipes.",
    });
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-10" style={{ backgroundColor: "#034AFF" }}>
        <div className="flex items-center justify-between h-14 px-4">
          <button 
            onClick={handleBack}
            className="p-2 text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold text-white">Recipes</h1>
          <div className="w-10"></div>
        </div>
      </div>
      
      <div className="pt-14">
        <div className="px-4 my-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for recipes..."
                className="pl-10 pr-10 py-2 bg-gray-100 border-0 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </form>
        </div>

        <div className="px-4 mt-6 mb-8">
          <h2 className="text-base font-bold mb-4 text-gray-800 text-[16px] text-center">Categories</h2>
          <div className="flex justify-center space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2" 
                  style={{ backgroundColor: category.id === "breakfast" ? "#FFF3E0" : 
                                          category.id === "lunch" ? "#E8F5E9" :
                                          category.id === "dinner" ? "#F3E5F5" : "#FCE4EC" }}>
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-800 text-[16px]">Trending Recipes</h2>
            <button 
              className="text-primary text-sm font-medium"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {trendingRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default RecipesPage;
