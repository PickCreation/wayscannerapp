import React, { useState, useEffect } from "react";
import { 
  Search, 
  ChevronRight, 
  Coffee, 
  Utensils, 
  Soup,
  Cookie,
  Grid,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import { getAllRecipes } from "@/lib/firebaseService";

const mockRecipes = [
  {
    id: "stir-fry-1",
    title: "Vegetable Stir Fry",
    time: "20 mins",
    rating: 4.5,
    reviews: 128,
    category: "dinner",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "smoothie-bowl",
    title: "Acai Smoothie Bowl",
    time: "10 mins",
    rating: 4.7,
    reviews: 93,
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "chicken-salad",
    title: "Grilled Chicken Salad",
    time: "25 mins",
    rating: 4.6,
    reviews: 112,
    category: "lunch",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    time: "15 mins",
    rating: 4.4,
    reviews: 86,
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1603046891744-1f76eb10aec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "pasta-1",
    title: "Creamy Garlic Parmesan Pasta",
    time: "30 mins",
    rating: 4.8,
    reviews: 256,
    category: "dinner",
    image: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png"
  },
  {
    id: "pancakes",
    title: "Blueberry Pancakes",
    time: "15 mins",
    rating: 4.9,
    reviews: 178,
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1528207776418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "salmon",
    title: "Baked Salmon",
    time: "25 mins",
    rating: 4.7,
    reviews: 145,
    category: "dinner",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "cookie",
    title: "Chocolate Chip Cookies",
    time: "30 mins",
    rating: 4.8,
    reviews: 205,
    category: "dessert",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  }
];

const categories = [
  { id: "all", name: "All", icon: <Grid size={20} color="#2196F3" /> },
  { id: "breakfast", name: "Breakfast", icon: <Coffee size={20} color="#FF9800" /> },
  { id: "lunch", name: "Lunch", icon: <Utensils size={20} color="#4CAF50" /> },
  { id: "dinner", name: "Dinner", icon: <Soup size={20} color="#9C27B0" /> },
  { id: "dessert", name: "Dessert", icon: <Cookie size={20} color="#E91E63" /> }
];

const RecipesPage = () => {
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("recipes");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        
        const firebaseRecipes = await getAllRecipes();
        
        if (firebaseRecipes && firebaseRecipes.length > 0) {
          setRecipes(firebaseRecipes);
        } else {
          setRecipes(mockRecipes);
          
          if (navigator.onLine) {
            for (const recipe of mockRecipes) {
              try {
                await import('@/lib/firebaseService').then(module => 
                  module.saveRecipe(recipe)
                );
              } catch (error) {
                console.error('Error saving mock recipe:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        setRecipes(mockRecipes);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, []);

  const filteredRecipes = selectedCategory && selectedCategory !== "all"
    ? recipes.filter(recipe => recipe.category === selectedCategory)
    : recipes;
  
  const displayedRecipes = selectedCategory ? filteredRecipes : recipes.slice(0, 4);

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
    if (searchQuery.trim()) {
      navigate(`/recipes/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleViewAll = () => {
    navigate("/recipes/all");
  };

  return (
    <div className="pb-20 bg-white min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10" style={{ backgroundColor: "#034AFF" }}>
        <h1 className="text-xl font-semibold text-white">Recipes</h1>
        
      </header>
      
      <div className="pt-16">
        <div className="px-4 my-4 w-full">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for recipes..."
                className="pl-10 pr-10 py-2 bg-gray-100 rounded-full focus:border-wayscanner-blue focus:ring-1 focus:ring-wayscanner-blue w-full"
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

        <div className="px-4 mt-2 mb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800 text-center">Categories</h2>
          <div className="flex justify-center space-x-4 overflow-x-auto py-2 px-2 no-scrollbar">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center cursor-pointer transition-transform duration-200 ${selectedCategory === category.id ? 'scale-105' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${selectedCategory === category.id ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} 
                  style={{ backgroundColor: category.id === "all" ? "#E3F2FD" :
                                          category.id === "breakfast" ? "#FFF3E0" : 
                                          category.id === "lunch" ? "#E8F5E9" :
                                          category.id === "dinner" ? "#F3E5F5" : "#FCE4EC" }}>
                  {React.cloneElement(category.icon, { size: 24 })}
                </div>
                <span className={`text-sm ${selectedCategory === category.id ? 'font-bold text-blue-500' : 'text-gray-700'}`}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedCategory && selectedCategory !== "all"
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recipes` 
                : "All Recipes"}
            </h2>
            <button 
              className="text-primary text-sm font-medium"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-wayscanner-blue" />
            </div>
          ) : displayedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {displayedRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found for this category</p>
            </div>
          )}
          
          {isOffline && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4 flex items-center">
              <p className="text-amber-700">You're currently offline. Some content may be limited.</p>
            </div>
          )}
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
