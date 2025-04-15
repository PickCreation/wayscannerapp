import React, { useState, useEffect } from "react";
import { 
  Search, 
  ArrowLeft, 
  Bell, 
  User,
  Filter,
  Loader2,
  WifiOff
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { getAllRecipes, saveRecipe } from "@/lib/firebaseService";

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
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
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
    id: "tacos",
    title: "Vegetarian Tacos",
    time: "20 mins",
    rating: 4.5,
    reviews: 112,
    category: "lunch",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: "cookie",
    title: "Chocolate Chip Cookies",
    time: "30 mins",
    rating: 4.8,
    reviews: 205,
    category: "dessert",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  }
];

const AllRecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("recipes");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
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
        console.log('Loading recipes from Firebase/localStorage');
        
        // Try to get recipes from Firebase/localStorage
        const firebaseRecipes = await getAllRecipes();
        
        if (firebaseRecipes && firebaseRecipes.length > 0) {
          console.log('Recipes loaded successfully:', firebaseRecipes.length);
          setRecipes(firebaseRecipes);
        } else {
          console.log('No recipes found, initializing with mock data');
          // Initialize with mock data if no recipes found
          setRecipes(mockRecipes);
          
          // Save mock data to localStorage for offline access
          localStorage.setItem('recipes', JSON.stringify(mockRecipes));
          
          // Save mock data to Firebase if online
          if (navigator.onLine) {
            console.log('Saving mock recipes to Firebase');
            for (const recipe of mockRecipes) {
              try {
                await saveRecipe(recipe);
              } catch (error) {
                console.error('Error saving mock recipe:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        setRecipes(mockRecipes);
        
        // Save mock data to localStorage for offline access
        localStorage.setItem('recipes', JSON.stringify(mockRecipes));
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, []);

  const handleBack = () => {
    navigate("/recipes");
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
    
    if (item === "recipes") {
      navigate("/recipes");
      return;
    }
    
    if (item === "shop") {
      toast({
        title: "Coming Soon",
        description: `The ${item} feature is under development.`,
      });
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleFilterClick = () => {
    toast({
      title: "Filter",
      description: "Filtering functionality is coming soon.",
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="pb-20 bg-white min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10" style={{ backgroundColor: "#034AFF" }}>
        <h1 className="text-xl font-semibold text-white">All Recipes</h1>
        <div className="flex items-center space-x-3">
          <button className="p-2">
            <Bell size={24} fill="white" strokeWidth={1.5} />
          </button>
          <button className="p-2" onClick={handleProfileClick}>
            <User size={24} fill="white" strokeWidth={1.5} />
          </button>
        </div>
      </header>
      
      <div className="pt-16">
        <div className="px-4 my-4 w-full">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for recipes..."
                className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full focus:border-wayscanner-blue focus:ring-1 focus:ring-wayscanner-blue focus:border-[1px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderColor: "#e5e7eb", borderWidth: "1px" }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={handleFilterClick}
              >
                <Filter className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>
        </div>

        {isOffline && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 mx-4 flex items-center">
            <WifiOff className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-700">You're currently offline. Some features may be limited.</p>
          </div>
        )}

        <div className="px-4 mb-8">
          <h2 className="text-lg font-medium mb-3">
            All Available Recipes
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-wayscanner-blue" />
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found</p>
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

export default AllRecipesPage;
