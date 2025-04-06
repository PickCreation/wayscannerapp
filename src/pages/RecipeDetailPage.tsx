
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  Users, 
  BookmarkPlus, 
  Heart, 
  Share2,
  ChefHat,
  CircleCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock recipe data (in a real app this would come from an API)
const recipeData = {
  "pasta-1": {
    id: "pasta-1",
    title: "Creamy Garlic Parmesan Pasta",
    time: "30 mins",
    rating: 4.8,
    reviews: 256,
    servings: 4,
    isFeatured: true,
    image: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
    description: "This creamy garlic parmesan pasta is quick, easy, and uses simple ingredients. It's the perfect weeknight dinner!",
    ingredients: [
      "1 pound fettuccine pasta",
      "4 tablespoons butter",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1 cup grated Parmesan cheese",
      "½ teaspoon salt",
      "¼ teaspoon black pepper",
      "2 tablespoons fresh parsley, chopped"
    ],
    instructions: [
      "Cook pasta according to package instructions. Reserve ½ cup of pasta water before draining.",
      "In a large skillet over medium heat, melt butter. Add minced garlic and cook for 1-2 minutes until fragrant.",
      "Reduce heat to medium-low and add heavy cream. Simmer for 3-4 minutes until it starts to thicken.",
      "Whisk in the Parmesan cheese until melted and sauce is smooth.",
      "Season with salt and pepper to taste.",
      "Add drained pasta to the sauce and toss to coat. If needed, add reserved pasta water to thin the sauce.",
      "Garnish with fresh parsley before serving."
    ],
    nutrition: {
      calories: 650,
      protein: "22g",
      carbs: "65g",
      fat: "35g"
    },
    tags: ["pasta", "italian", "dinner", "weeknight", "easy"]
  },
  "stir-fry-1": {
    id: "stir-fry-1",
    title: "Vegetable Stir Fry",
    time: "20 mins",
    rating: 4.5,
    reviews: 128,
    servings: 3,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    description: "A quick and healthy vegetable stir fry with a flavorful sauce. Perfect for a simple dinner!",
    ingredients: [
      "2 tablespoons vegetable oil",
      "1 red bell pepper, sliced",
      "1 yellow bell pepper, sliced",
      "1 cup broccoli florets",
      "1 carrot, julienned",
      "1 cup snap peas",
      "2 cloves garlic, minced",
      "1 tablespoon ginger, grated",
      "3 tablespoons soy sauce",
      "1 tablespoon honey",
      "1 teaspoon sesame oil",
      "1 tablespoon cornstarch mixed with 2 tablespoons water",
      "Sesame seeds for garnish"
    ],
    instructions: [
      "Heat vegetable oil in a large wok or skillet over high heat.",
      "Add bell peppers, broccoli, and carrots. Stir-fry for 3-4 minutes.",
      "Add snap peas, garlic, and ginger. Cook for another 1-2 minutes.",
      "In a small bowl, mix soy sauce, honey, and sesame oil.",
      "Pour sauce mixture over vegetables and stir to coat.",
      "Add cornstarch slurry and cook until sauce thickens, about 1 minute.",
      "Garnish with sesame seeds and serve over rice if desired."
    ],
    nutrition: {
      calories: 180,
      protein: "5g",
      carbs: "22g",
      fat: "9g"
    },
    tags: ["vegetarian", "healthy", "quick", "asian"]
  }
};

// For other recipes we'll load a simplified version
const getDefaultRecipe = (id: string) => ({
  id,
  title: "Recipe Not Found",
  time: "N/A",
  rating: 0,
  reviews: 0,
  servings: 0,
  image: "",
  description: "We couldn't find details for this recipe.",
  ingredients: [],
  instructions: [],
  nutrition: {
    calories: 0,
    protein: "0g",
    carbs: "0g",
    fat: "0g"
  },
  tags: []
});

const RecipeDetailPage = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Get recipe data using the recipeId from URL params
  const recipe = recipeData[recipeId as keyof typeof recipeData] || getDefaultRecipe(recipeId || "unknown");

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Bookmarks" : "Saved to Bookmarks",
      description: isSaved 
        ? `${recipe.title} has been removed from your bookmarks.` 
        : `${recipe.title} has been added to your bookmarks.`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed Like" : "Recipe Liked",
      description: `You've ${isLiked ? 'removed your like from' : 'liked'} ${recipe.title}.`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Recipe",
      description: `Sharing options for ${recipe.title} are coming soon.`,
    });
  };

  return (
    <div className="pb-6 bg-white min-h-screen">
      {/* Header with Image */}
      <div className="relative h-72 bg-gray-200">
        <img 
          src={recipe.image || "https://via.placeholder.com/800x600?text=No+Image"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="bg-white/20 backdrop-blur-sm rounded-full p-2"
          >
            <ArrowLeft size={24} color="white" />
          </button>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleSave}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <BookmarkPlus 
                size={24} 
                color="white"
                fill={isSaved ? "white" : "none"}
              />
            </button>
            <button 
              onClick={handleLike}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <Heart 
                size={24} 
                color="white"
                fill={isLiked ? "white" : "none"}
              />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <Share2 size={24} color="white" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center">
              <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
              <span>{recipe.rating} ({recipe.reviews})</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-4">
        <p className="text-gray-700">{recipe.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs for Ingredients and Instructions */}
      <div className="px-4">
        <Tabs defaultValue="ingredients" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredients" className="mt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <ChefHat className="mr-2" size={20} />
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CircleCheck className="mr-2" size={20} />
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <div className="h-6 w-6 bg-wayscanner-blue text-white rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </div>

      {/* Nutrition Info */}
      <div className="px-4 mt-8">
        <h3 className="text-lg font-semibold mb-3">Nutrition Information</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-500">Calories</p>
            <p className="font-bold">{recipe.nutrition.calories}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-500">Protein</p>
            <p className="font-bold">{recipe.nutrition.protein}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="font-bold">{recipe.nutrition.carbs}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-500">Fat</p>
            <p className="font-bold">{recipe.nutrition.fat}</p>
          </div>
        </div>
      </div>

      {/* Start Cooking Button */}
      <div className="px-4 mt-8">
        <Button className="w-full py-6 text-lg" onClick={() => toast({
          title: "Start Cooking",
          description: "This feature is coming soon!",
        })}>
          Start Cooking
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
