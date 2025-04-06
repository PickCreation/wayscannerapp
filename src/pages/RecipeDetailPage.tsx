
import React, { useState, useEffect } from "react";
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
  CircleCheck,
  Info,
  MessageSquare,
  LightbulbIcon,
  Check
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    tags: ["pasta", "italian", "dinner", "weeknight", "easy"],
    tips: [
      "For extra protein, add grilled chicken or shrimp.",
      "Use freshly grated Parmesan for the best flavor and melting properties.",
      "Make the sauce ahead of time for quicker meal prep.",
      "If sauce becomes too thick, add a splash of milk or pasta water."
    ],
    comments: [
      {
        id: 1,
        author: "Sarah Johnson",
        date: "2 days ago",
        rating: 5,
        text: "Made this last night and it was amazing! My family loved it. Will definitely make again."
      },
      {
        id: 2,
        author: "Mike Thompson",
        date: "1 week ago",
        rating: 4,
        text: "Great recipe! I added some grilled chicken and it was perfect for dinner."
      }
    ]
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
    tags: ["vegetarian", "healthy", "quick", "asian"],
    tips: [
      "For protein, add tofu, chicken, or beef.",
      "Use any vegetables you have on hand.",
      "Make the sauce ahead of time for even quicker preparation.",
      "If you like spice, add red pepper flakes or sriracha."
    ],
    comments: [
      {
        id: 1,
        author: "Emily Chen",
        date: "3 days ago",
        rating: 5,
        text: "So fresh and healthy! I added tofu for protein and it was delicious."
      },
      {
        id: 2,
        author: "David Wilson",
        date: "1 week ago",
        rating: 4,
        text: "Great weeknight dinner option. Quick and tasty, my kids even ate the veggies!"
      }
    ]
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
  tags: [],
  tips: [],
  comments: []
});

const RecipeDetailPage = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState<string | null>("delicious");

  // Get recipe data using the recipeId from URL params
  const recipe = recipeData[recipeId as keyof typeof recipeData] || getDefaultRecipe(recipeId || "unknown");

  useEffect(() => {
    // Check if recipe is already saved in bookmarks
    const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks);
      const isRecipeSaved = bookmarks.some((item: any) => item.id === recipe.id);
      setIsSaved(isRecipeSaved);
    }
  }, [recipe.id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    const newSaveState = !isSaved;
    setIsSaved(newSaveState);
    
    // Update localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
    let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    if (newSaveState) {
      // Add to bookmarks if not already saved
      if (!bookmarks.some((item: any) => item.id === recipe.id)) {
        const bookmarkItem = {
          id: recipe.id,
          title: recipe.title,
          time: recipe.time,
          rating: recipe.rating,
          reviews: recipe.reviews,
          image: recipe.image
        };
        bookmarks.push(bookmarkItem);
      }
    } else {
      // Remove from bookmarks
      bookmarks = bookmarks.filter((item: any) => item.id !== recipe.id);
    }
    
    localStorage.setItem('bookmarkedRecipes', JSON.stringify(bookmarks));

    toast({
      title: newSaveState ? "Saved to Bookmarks" : "Removed from Bookmarks",
      description: newSaveState 
        ? `${recipe.title} has been added to your bookmarks.` 
        : `${recipe.title} has been removed from your bookmarks.`,
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

  const handleViewAllComments = () => {
    toast({
      title: "Comments",
      description: "Comments section is coming soon!",
    });
  };

  const handlePostComment = () => {
    if (!comment) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment before posting.",
      });
      return;
    }

    toast({
      title: "Comment Posted",
      description: "Your comment has been posted successfully.",
    });

    setComment("");
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
        
        <div className="absolute top-0 left-0 right-0 bg-primary/20 backdrop-blur-sm p-4 flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="bg-white/20 backdrop-blur-sm rounded-full p-2"
          >
            <ArrowLeft size={14} color="white" />
          </button>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleSave}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <BookmarkPlus 
                size={14} 
                color="white"
                fill={isSaved ? "white" : "none"}
              />
            </button>
            <button 
              onClick={handleLike}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <Heart 
                size={14} 
                color="white"
                fill={isLiked ? "white" : "none"}
              />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <Share2 size={14} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Title */}
      <div className="px-4 pt-4">
        <h1 className="text-base font-semibold mb-3">{recipe.title}</h1>
        
        {/* Recipe Info */}
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="capitalize text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2">
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">{recipe.description}</p>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="px-4 grid grid-cols-4 gap-2 mb-4">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
            <Clock size={16} className="text-blue-500" />
          </div>
          <p className="text-xs text-blue-500 font-medium">{recipe.time}</p>
          <p className="text-[10px] text-gray-500">Cook Time</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" className="text-green-500">
              <rect x="3" y="12" width="4" height="6" fill="currentColor" />
              <rect x="10" y="8" width="4" height="10" fill="currentColor" />
              <rect x="17" y="4" width="4" height="14" fill="currentColor" />
            </svg>
          </div>
          <p className="text-xs text-green-500 font-medium">Easy</p>
          <p className="text-[10px] text-gray-500">Difficulty</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
            <Users size={16} className="text-orange-500" />
          </div>
          <p className="text-xs text-orange-500 font-medium">{recipe.servings}</p>
          <p className="text-[10px] text-gray-500">Servings</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
            <Star size={16} className="text-yellow-500" />
          </div>
          <p className="text-xs text-yellow-500 font-medium">{recipe.rating}</p>
          <p className="text-[10px] text-gray-500">Rating</p>
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
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <ChefHat className="mr-2" size={14} />
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <CircleCheck className="mr-2" size={14} />
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <div className="h-6 w-6 bg-primary text-white rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </div>

      {/* Nutrition Info - Smaller Size */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-semibold mb-3">Nutrition Information</h3>
        <div className="flex justify-between mb-2">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <span className="text-red-500 text-xs font-semibold">{recipe.nutrition.calories}</span>
            </div>
            <p className="text-xs text-gray-600">Calories</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <span className="text-purple-600 text-xs font-semibold">{recipe.nutrition.protein}</span>
            </div>
            <p className="text-xs text-gray-600">Protein</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <span className="text-green-500 text-xs font-semibold">{recipe.nutrition.carbs}</span>
            </div>
            <p className="text-xs text-gray-600">Carbs</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <span className="text-yellow-600 text-xs font-semibold">{recipe.nutrition.fat}</span>
            </div>
            <p className="text-xs text-gray-600">Fat</p>
          </div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg text-center">
          <div className="flex items-center justify-center">
            <Info size={12} className="mr-1 text-gray-500" />
            <p className="text-xs text-gray-500">Values are per serving and are approximate.</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-semibold mb-3">Tips</h3>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-start mb-2">
            <LightbulbIcon size={14} className="text-yellow-500 mr-2 mt-0.5" />
            <h4 className="text-sm font-semibold text-yellow-600">Chef Tips</h4>
          </div>
          <ul className="space-y-2 ml-2">
            {recipe.tips && recipe.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span className="text-sm text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <MessageSquare size={14} className="mr-2 text-blue-500" />
            <h3 className="text-base font-semibold">Comments ({recipe.comments?.length || 0})</h3>
          </div>
          <button 
            className="text-blue-500 text-sm font-medium"
            onClick={handleViewAllComments}
          >
            View All
          </button>
        </div>

        {/* Display comments */}
        <div className="space-y-4 mb-6">
          {recipe.comments && recipe.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between mb-1">
                <div className="font-medium text-sm">{comment.author}</div>
                <div className="text-xs text-gray-500">{comment.date}</div>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>

        {/* Add comment form */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Add Your Comment</h3>
          
          <Textarea 
            placeholder="Share your experience with this recipe..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4 bg-gray-50"
          />
          
          <div className="mb-4">
            <h4 className="text-base text-gray-700 mb-2">Rate this recipe:</h4>
            <div className="flex flex-wrap gap-2">
              <div className={`flex items-center border ${selectedRating === 'delicious' ? 'bg-green-100 border-green-500' : 'bg-gray-50 border-gray-200'} rounded-full px-4 py-2`}>
                <input
                  type="radio"
                  id="delicious"
                  name="rating"
                  value="delicious"
                  checked={selectedRating === 'delicious'}
                  onChange={() => setSelectedRating('delicious')}
                  className="sr-only"
                />
                <label 
                  htmlFor="delicious" 
                  className="flex items-center cursor-pointer"
                  onClick={() => setSelectedRating('delicious')}
                >
                  {selectedRating === 'delicious' && <Check size={16} className="mr-1 text-green-500" />}
                  <span className={`text-sm ${selectedRating === 'delicious' ? 'text-green-700' : 'text-gray-700'}`}>Delicious</span>
                </label>
              </div>
              
              <div className={`flex items-center border ${selectedRating === 'tasty' ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'} rounded-full px-4 py-2`}>
                <input
                  type="radio"
                  id="tasty"
                  name="rating"
                  value="tasty"
                  checked={selectedRating === 'tasty'}
                  onChange={() => setSelectedRating('tasty')}
                  className="sr-only"
                />
                <label 
                  htmlFor="tasty" 
                  className="flex items-center cursor-pointer"
                  onClick={() => setSelectedRating('tasty')}
                >
                  {selectedRating === 'tasty' && <Check size={16} className="mr-1 text-blue-500" />}
                  <span className={`text-sm ${selectedRating === 'tasty' ? 'text-blue-700' : 'text-gray-700'}`}>Tasty</span>
                </label>
              </div>
              
              <div className={`flex items-center border ${selectedRating === 'just-okay' ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-50 border-gray-200'} rounded-full px-4 py-2`}>
                <input
                  type="radio"
                  id="just-okay"
                  name="rating"
                  value="just-okay"
                  checked={selectedRating === 'just-okay'}
                  onChange={() => setSelectedRating('just-okay')}
                  className="sr-only"
                />
                <label 
                  htmlFor="just-okay" 
                  className="flex items-center cursor-pointer"
                  onClick={() => setSelectedRating('just-okay')}
                >
                  {selectedRating === 'just-okay' && <Check size={16} className="mr-1 text-yellow-500" />}
                  <span className={`text-sm ${selectedRating === 'just-okay' ? 'text-yellow-700' : 'text-gray-700'}`}>Just Okay</span>
                </label>
              </div>
              
              <div className={`flex items-center border ${selectedRating === 'not-great' ? 'bg-red-100 border-red-500' : 'bg-gray-50 border-gray-200'} rounded-full px-4 py-2`}>
                <input
                  type="radio"
                  id="not-great"
                  name="rating"
                  value="not-great"
                  checked={selectedRating === 'not-great'}
                  onChange={() => setSelectedRating('not-great')}
                  className="sr-only"
                />
                <label 
                  htmlFor="not-great" 
                  className="flex items-center cursor-pointer"
                  onClick={() => setSelectedRating('not-great')}
                >
                  {selectedRating === 'not-great' && <Check size={16} className="mr-1 text-red-500" />}
                  <span className={`text-sm ${selectedRating === 'not-great' ? 'text-red-700' : 'text-gray-700'}`}>Not Great</span>
                </label>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={handlePostComment}
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
