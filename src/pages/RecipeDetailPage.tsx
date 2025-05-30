import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  BookmarkPlus, 
  Share2,
  ChefHat,
  CircleCheck,
  Info,
  MessageSquare,
  LightbulbIcon,
  Check,
  Tags,
  X,
  Copy,
  Facebook,
  Loader2,
  WifiOff
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getRecipe, saveRecipeComment, getRecipeComments, addBookmark, removeBookmark, saveRecipe as saveRecipeToFirebase } from "@/lib/firebaseService";

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
    description: "This creamy garlic parmesan pasta is quick, easy, and uses simple ingredients. Perfect for busy weeknights when you want something delicious and comforting. The secret is using freshly grated Parmesan and not letting the cream boil to avoid curdling.",
    ingredients: [
      "1 pound fettuccine pasta",
      "4 tablespoons butter",
      "6 cloves garlic, minced",
      "1 cup heavy cream",
      "1½ cups freshly grated Parmesan cheese",
      "½ teaspoon salt (or to taste)",
      "¼ teaspoon black pepper",
      "2 tablespoons fresh parsley, chopped",
      "Optional: ½ cup reserved pasta water"
    ],
    instructions: [
      "Bring a large pot of salted water to boil. Cook fettuccine according to package instructions until al dente. Reserve ½ cup pasta water before draining.",
      "While pasta cooks, melt butter in a large skillet over medium heat. Add minced garlic and sauté for 1-2 minutes until fragrant but not browned.",
      "Reduce heat to medium-low and slowly pour in heavy cream. Let it simmer gently for 3-4 minutes, stirring occasionally.",
      "Remove skillet from heat and gradually whisk in the Parmesan cheese until completely melted and sauce is smooth.",
      "Season with salt and pepper to taste. The cheese will add saltiness, so taste first.",
      "Add the drained pasta to the sauce and toss gently to coat. If sauce seems too thick, add reserved pasta water gradually.",
      "Serve immediately, garnished with fresh parsley and extra Parmesan if desired."
    ],
    nutrition: {
      calories: 680,
      protein: "26g",
      carbs: "68g",
      fat: "38g"
    },
    tags: ["pasta", "italian", "dinner", "weeknight", "easy", "creamy"],
    tips: [
      "Use freshly grated Parmesan for the best flavor and melting properties. Pre-grated cheese won't melt as smoothly.",
      "Don't let the cream boil vigorously as it may curdle. Keep it at a gentle simmer.",
      "For extra protein, add grilled chicken, shrimp, or pancetta before adding the pasta.",
      "Save some pasta water - its starch helps bind the sauce to the pasta perfectly.",
      "Serve immediately as cream sauces don't reheat well and may separate."
    ],
    comments: [
      {
        id: 1,
        author: "Sarah Johnson",
        date: "2 days ago",
        rating: 5,
        text: "Absolutely incredible! Made this for my family last night and everyone was asking for seconds. The sauce was so creamy and flavorful. I followed the recipe exactly and it turned out perfect. Definitely adding this to my regular rotation!",
        ratingLabel: "Delicious"
      },
      {
        id: 2,
        author: "Mike Thompson",
        date: "1 week ago",
        rating: 4,
        text: "Great recipe! I added some grilled chicken and it was perfect for dinner. The garlic flavor really comes through nicely. Only suggestion would be to add a bit more salt to taste.",
        ratingLabel: "Tasty"
      },
      {
        id: 3,
        author: "Emily Chen",
        date: "2 weeks ago",
        rating: 5,
        text: "This is now my go-to pasta recipe! So easy and always turns out amazing. I've made it probably 10 times now and it never disappoints. My husband says it's better than restaurant pasta!",
        ratingLabel: "Delicious"
      },
      {
        id: 4,
        author: "David Rodriguez",
        date: "3 weeks ago",
        rating: 4,
        text: "Really good! I was a bit worried about making cream sauce but this was surprisingly easy. Added some mushrooms and it was fantastic. Will definitely make again.",
        ratingLabel: "Tasty"
      },
      {
        id: 5,
        author: "Lisa Anderson",
        date: "1 month ago",
        rating: 5,
        text: "Perfect comfort food! Made this on a cold winter night and it hit the spot. The kids loved it too, which is always a win. Thank you for sharing this recipe!",
        ratingLabel: "Delicious"
      }
    ]
  },
  "stir-fry-1": {
    id: "stir-fry-1",
    title: "Rainbow Vegetable Stir Fry",
    time: "20 mins",
    rating: 4.6,
    reviews: 189,
    servings: 3,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    description: "A vibrant and healthy vegetable stir fry packed with colorful vegetables and a savory-sweet sauce. This recipe is perfect for using up vegetables in your fridge and can be customized with your favorites. Serve over rice or noodles for a complete meal.",
    ingredients: [
      "2 tablespoons vegetable oil (or peanut oil)",
      "1 red bell pepper, sliced into strips",
      "1 yellow bell pepper, sliced into strips",
      "1 cup broccoli florets",
      "1 large carrot, julienned or sliced diagonally",
      "1 cup snap peas, trimmed",
      "1 small zucchini, sliced into half-moons",
      "3 cloves garlic, minced",
      "1 tablespoon fresh ginger, grated",
      "3 tablespoons low-sodium soy sauce",
      "2 tablespoons honey or brown sugar",
      "1 tablespoon rice vinegar",
      "1 teaspoon sesame oil",
      "1 tablespoon cornstarch mixed with 2 tablespoons water",
      "2 green onions, sliced",
      "1 tablespoon sesame seeds for garnish",
      "Optional: red pepper flakes for heat"
    ],
    instructions: [
      "Prepare all vegetables and have them ready before you start cooking. Stir-frying goes quickly!",
      "Heat vegetable oil in a large wok or skillet over high heat until shimmering.",
      "Add bell peppers and carrots first as they take longer to cook. Stir-fry for 2-3 minutes.",
      "Add broccoli florets and cook for another 2 minutes, stirring constantly.",
      "Add zucchini and snap peas. Stir-fry for 1-2 minutes until vegetables are crisp-tender.",
      "Push vegetables to one side of the pan. Add garlic and ginger to the empty space and cook for 30 seconds until fragrant.",
      "In a small bowl, whisk together soy sauce, honey, rice vinegar, and sesame oil.",
      "Pour sauce over vegetables and toss everything together.",
      "Add cornstarch slurry and cook for 1 minute until sauce thickens and coats the vegetables.",
      "Remove from heat, garnish with green onions and sesame seeds. Serve immediately over rice or noodles."
    ],
    nutrition: {
      calories: 195,
      protein: "6g",
      carbs: "28g",
      fat: "8g"
    },
    tags: ["vegetarian", "healthy", "quick", "asian", "colorful", "vegan"],
    tips: [
      "Cut all vegetables to similar sizes for even cooking.",
      "Don't overcrowd the pan - cook in batches if necessary to avoid steaming the vegetables.",
      "For added protein, add tofu, chicken, beef, or shrimp in the first step.",
      "Substitute any vegetables you have on hand - this recipe is very flexible.",
      "For extra heat, add red pepper flakes or a drizzle of sriracha at the end."
    ],
    comments: [
      {
        id: 1,
        author: "Jennifer K.",
        date: "3 days ago",
        rating: 5,
        text: "Love this recipe! So colorful and fresh. I added some tofu for protein and it was perfect. The sauce has just the right balance of sweet and savory.",
        ratingLabel: "Delicious"
      },
      {
        id: 2,
        author: "Mark Wilson",
        date: "1 week ago",
        rating: 4,
        text: "Great way to get kids to eat vegetables! Mine loved all the colors. I used frozen vegetables when I was short on time and it still turned out great.",
        ratingLabel: "Tasty"
      },
      {
        id: 3,
        author: "Amanda Foster",
        date: "2 weeks ago",
        rating: 5,
        text: "This has become my go-to weeknight dinner! So quick and healthy. I love that I can use whatever vegetables I have in the fridge.",
        ratingLabel: "Delicious"
      },
      {
        id: 4,
        author: "Carlos M.",
        date: "3 weeks ago",
        rating: 4,
        text: "Really tasty! Added some chicken and served over brown rice. The sauce is fantastic - will definitely use it for other stir-fries too.",
        ratingLabel: "Tasty"
      }
    ]
  },
  "salmon-1": {
    id: "salmon-1",
    title: "Honey Garlic Glazed Salmon",
    time: "25 mins",
    rating: 4.9,
    reviews: 342,
    servings: 4,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600",
    description: "Perfectly flaky salmon with a sweet and savory honey garlic glaze. This restaurant-quality dish comes together in just 25 minutes and pairs beautifully with rice and steamed vegetables. The glaze caramelizes beautifully and creates an irresistible flavor combination.",
    ingredients: [
      "4 salmon fillets (6 oz each), skin-on or skinless",
      "3 tablespoons honey",
      "3 tablespoons soy sauce",
      "4 cloves garlic, minced",
      "2 tablespoons olive oil",
      "1 tablespoon fresh lemon juice",
      "1 teaspoon fresh ginger, grated",
      "½ teaspoon red pepper flakes (optional)",
      "Salt and black pepper to taste",
      "2 green onions, sliced for garnish",
      "1 tablespoon sesame seeds for garnish",
      "Lemon wedges for serving"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C). Line a baking sheet with parchment paper.",
      "Pat salmon fillets dry and season both sides with salt and pepper.",
      "In a small bowl, whisk together honey, soy sauce, minced garlic, lemon juice, ginger, and red pepper flakes.",
      "Heat olive oil in a large oven-safe skillet over medium-high heat.",
      "Place salmon fillets skin-side up (if using skin-on) and sear for 3-4 minutes until golden brown.",
      "Flip salmon carefully and brush tops with half of the honey garlic glaze.",
      "Transfer skillet to preheated oven and bake for 8-10 minutes or until salmon flakes easily with a fork.",
      "Remove from oven and brush with remaining glaze. Let rest for 2 minutes.",
      "Garnish with sliced green onions and sesame seeds. Serve with lemon wedges."
    ],
    nutrition: {
      calories: 320,
      protein: "35g",
      carbs: "12g",
      fat: "15g"
    },
    tags: ["seafood", "healthy", "protein", "dinner", "easy", "gluten-free"],
    tips: [
      "Choose salmon fillets of similar thickness for even cooking.",
      "Don't overcook the salmon - it should still be slightly pink in the center.",
      "If you don't have an oven-safe skillet, transfer salmon to the prepared baking sheet before going in the oven.",
      "For crispy skin, start with skin-side down and don't move the fish until it's time to flip.",
      "The glaze will thicken as it cools, so serve immediately for best results."
    ],
    comments: [
      {
        id: 1,
        author: "Rachel Cooper",
        date: "1 day ago",
        rating: 5,
        text: "This is hands down the best salmon recipe I've ever made! The glaze is incredible and the fish was perfectly cooked. My whole family loved it. Making it again this weekend!",
        ratingLabel: "Delicious"
      },
      {
        id: 2,
        author: "Tom Bradley",
        date: "4 days ago",
        rating: 5,
        text: "Restaurant quality at home! The honey garlic combination is perfect. Even my kids who usually don't like fish asked for seconds. This is definitely going in our regular rotation.",
        ratingLabel: "Delicious"
      },
      {
        id: 3,
        author: "Maria Santos",
        date: "1 week ago",
        rating: 4,
        text: "Really delicious! The glaze caramelized beautifully. I served it with jasmine rice and steamed broccoli. Only thing I'd change is maybe add a bit more ginger next time.",
        ratingLabel: "Tasty"
      },
      {
        id: 4,
        author: "Alex Turner",
        date: "2 weeks ago",
        rating: 5,
        text: "Perfect recipe! So easy to follow and the results were amazing. The salmon was flaky and the glaze had the perfect balance of sweet and savory. Highly recommend!",
        ratingLabel: "Delicious"
      },
      {
        id: 5,
        author: "Nicole James",
        date: "3 weeks ago",
        rating: 5,
        text: "Made this for a dinner party and everyone was raving about it! Looks so elegant but surprisingly simple to make. The glaze is absolutely divine.",
        ratingLabel: "Delicious"
      },
      {
        id: 6,
        author: "Steve Park",
        date: "1 month ago",
        rating: 4,
        text: "Great recipe! I'm not usually confident cooking fish but this turned out perfectly. The timing was spot on and the flavor was fantastic. Will definitely make again.",
        ratingLabel: "Tasty"
      }
    ]
  }
};

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
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState<string | null>("delicious");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("recipes");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(getDefaultRecipe(recipeId || "unknown"));
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [systemComments, setSystemComments] = useState<any[]>([]);
  const isMobile = useIsMobile();

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
    const loadRecipe = async () => {
      if (!recipeId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const savedRecipes = localStorage.getItem('recipes');
        const localRecipes = savedRecipes ? JSON.parse(savedRecipes) : [];
        const localRecipe = localRecipes.find((r: any) => r.id === recipeId);
        
        if (!navigator.onLine) {
          if (localRecipe) {
            console.log('Using cached recipe from localStorage:', localRecipe);
            setRecipe(localRecipe);
          } else {
            const mockRecipe = recipeData[recipeId as keyof typeof recipeData];
            if (mockRecipe) {
              console.log('Using mock recipe data:', mockRecipe);
              setRecipe(mockRecipe);
              
              const updatedRecipes = [...localRecipes, mockRecipe];
              localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
            } else {
              console.log('No mock or cached data found, using default recipe');
              setRecipe(getDefaultRecipe(recipeId));
            }
          }
          
          const savedComments = localStorage.getItem(`comments-${recipeId}`);
          if (savedComments) {
            setSystemComments(JSON.parse(savedComments));
          }
          
          toast({
            title: "You're offline",
            description: "Using cached recipe data",
            variant: "default"
          });
        } else {
          try {
            console.log('Fetching recipe from Firebase:', recipeId);
            const firebaseRecipe = await getRecipe(recipeId);
            
            if (firebaseRecipe) {
              console.log('Firebase recipe found:', firebaseRecipe);
              const safeRecipe = {
                ...getDefaultRecipe(recipeId),
                ...firebaseRecipe
              };
              setRecipe(safeRecipe);
            } else if (localRecipe) {
              console.log('No Firebase recipe, using local:', localRecipe);
              const safeRecipe = {
                ...getDefaultRecipe(recipeId),
                ...localRecipe
              };
              setRecipe(safeRecipe);
              
              await saveRecipeToFirebase(safeRecipe);
            } else {
              const mockRecipe = recipeData[recipeId as keyof typeof recipeData];
              if (mockRecipe) {
                console.log('Using and saving mock recipe:', mockRecipe);
                setRecipe(mockRecipe);
                await saveRecipeToFirebase(mockRecipe);
              } else {
                console.log('No recipe found anywhere, using default');
                setRecipe(getDefaultRecipe(recipeId));
              }
            }
            
            try {
              const comments = await getRecipeComments(recipeId);
              console.log('Recipe comments:', comments);
              setSystemComments(comments || []);
            } catch (commentErr) {
              console.error('Error loading recipe comments:', commentErr);
              const savedComments = localStorage.getItem(`comments-${recipeId}`);
              if (savedComments) {
                setSystemComments(JSON.parse(savedComments));
              }
            }
          } catch (firebaseErr) {
            console.error('Firebase recipe fetch error:', firebaseErr);
            
            if (localRecipe) {
              console.log('Firebase error, using local recipe');
              const safeRecipe = {
                ...getDefaultRecipe(recipeId),
                ...localRecipe
              };
              setRecipe(safeRecipe);
            } else {
              const mockRecipe = recipeData[recipeId as keyof typeof recipeData];
              if (mockRecipe) {
                console.log('Firebase error, using mock recipe');
                setRecipe(mockRecipe);
                
                const updatedRecipes = [...localRecipes, mockRecipe];
                localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
              } else {
                console.log('No fallback data found, using default');
                setRecipe(getDefaultRecipe(recipeId));
              }
            }
            
            const savedComments = localStorage.getItem(`comments-${recipeId}`);
            if (savedComments) {
              setSystemComments(JSON.parse(savedComments));
            }
          }
        }
        
        const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
        if (savedBookmarks) {
          const bookmarks = JSON.parse(savedBookmarks);
          const isRecipeSaved = bookmarks.some((item: any) => item.id === recipeId);
          setIsSaved(isRecipeSaved);
        }
        
        const savedComments = localStorage.getItem(`userComments-${recipeId}`);
        if (savedComments) {
          setUserComments(JSON.parse(savedComments));
        }
      } catch (error) {
        console.error('General error loading recipe:', error);
        
        const mockRecipe = recipeData[recipeId as keyof typeof recipeData];
        setRecipe(mockRecipe || getDefaultRecipe(recipeId));
        
        toast({
          title: "Error Loading Recipe",
          description: "Could not load the recipe details. Using fallback data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
  }, [recipeId, toast, isOffline]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    const newSaveState = !isSaved;
    setIsSaved(newSaveState);
    
    try {
      if (newSaveState) {
        await addBookmark(recipe, 'recipe');
      } else {
        await removeBookmark(recipe.id, 'recipe');
      }
      
      const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
      let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      
      if (newSaveState) {
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
        bookmarks = bookmarks.filter((item: any) => item.id !== recipe.id);
      }
      
      localStorage.setItem('bookmarkedRecipes', JSON.stringify(bookmarks));

      toast({
        title: newSaveState ? "Saved to Bookmarks" : "Removed from Bookmarks",
        description: newSaveState 
          ? `${recipe.title} has been added to your bookmarks.` 
          : `${recipe.title} has been removed from your bookmarks.`,
      });
    } catch (error) {
      console.error('Error updating bookmark:', error);
      
      setIsSaved(!newSaveState);
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link Copied",
      description: "Recipe link has been copied to clipboard!",
    });
    
    setShowShareOptions(false);
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    
    toast({
      title: "Sharing on Facebook",
      description: "Opening Facebook share dialog.",
    });
    
    setShowShareOptions(false);
  };

  const handleViewAllComments = () => {
    setIsDrawerOpen(true);
  };

  const getRatingLabelColor = (ratingLabel: string) => {
    switch(ratingLabel) {
      case "Delicious": return "bg-green-100 text-green-700";
      case "Tasty": return "bg-blue-100 text-blue-700";
      case "Just Okay": return "bg-yellow-100 text-yellow-700";
      case "Not Great": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRatingLabel = (ratingType: string): string => {
    switch(ratingType) {
      case "delicious": return "Delicious";
      case "tasty": return "Tasty";
      case "just-okay": return "Just Okay";
      case "not-great": return "Not Great";
      default: return "Delicious";
    }
  };

  const handlePostComment = async () => {
    if (!comment) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment before posting.",
      });
      return;
    }

    const ratingLabel = getRatingLabel(selectedRating || "delicious");
    
    const newComment = {
      id: Date.now(),
      author: "You",
      date: "Just now",
      rating: ratingLabel === "Delicious" ? 5 : ratingLabel === "Tasty" ? 4 : ratingLabel === "Just Okay" ? 3 : 2,
      text: comment,
      ratingLabel: ratingLabel
    };

    try {
      const savedUserComments = localStorage.getItem(`userComments-${recipe.id}`);
      const userCommentsList = savedUserComments ? JSON.parse(savedUserComments) : [];
      const updatedUserComments = [...userCommentsList, newComment];
      localStorage.setItem(`userComments-${recipe.id}`, JSON.stringify(updatedUserComments));
      setUserComments(updatedUserComments);
      
      if (navigator.onLine) {
        await saveRecipeComment(recipe.id, newComment);
        
        toast({
          title: "Comment Posted",
          description: "Your comment has been posted successfully.",
        });
      } else {
        toast({
          title: "Comment Saved Locally",
          description: "You're offline. Comment saved locally and will sync when back online.",
        });
      }

      setComment("");
    } catch (error) {
      console.error('Error posting comment:', error);
      
      toast({
        title: "Comment Saved Locally",
        description: "Error saving to database. Comment saved locally and will sync when possible.",
      });
      
      setComment("");
    }
  };

  const allComments = [...(systemComments || []), ...(recipe?.comments || []), ...userComments];

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
    
    switch (item) {
      case "home":
        navigate("/");
        break;
      case "forum":
        navigate("/forum");
        break;
      case "recipes":
        navigate("/recipes");
        break;
      case "shop":
        navigate("/marketplace");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-wayscanner-blue" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
        <p className="text-gray-500 mb-4">The recipe you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/recipes')} type="button">
          Back to Recipes
        </Button>
      </div>
    );
  }

  // Ensure recipe has all required properties to prevent errors
  const tags = recipe.tags || [];
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];
  const tips = recipe.tips || [];
  const nutrition = recipe.nutrition || { calories: 0, protein: '0g', carbs: '0g', fat: '0g' };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#034AFF] text-white p-4 flex items-center shadow-md">
        <button 
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Recipe Details</h1>
      </div>
      
      {isOffline && (
        <div className="fixed top-16 left-0 right-0 z-10 bg-amber-50 border-b border-amber-200 p-2 flex items-center justify-center">
          <WifiOff className="h-4 w-4 text-amber-500 mr-2" />
          <p className="text-amber-700 text-sm">You're offline. Some features may be limited.</p>
        </div>
      )}
      
      <div className="pt-16">
        <div className="relative h-72 bg-gray-200">
          <img 
            src={recipe.image || "https://via.placeholder.com/800x600?text=No+Image"}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute top-0 left-0 right-0 bg-primary/20 backdrop-blur-sm p-4 flex justify-end items-center">
            <div className="flex space-x-2">
              <button 
                onClick={handleSave}
                className="bg-white/20 backdrop-blur-sm rounded-full p-2"
              >
                <BookmarkPlus 
                  size={16} 
                  color="white"
                  fill={isSaved ? "white" : "none"}
                />
              </button>
              <Popover open={showShareOptions} onOpenChange={setShowShareOptions}>
                <PopoverTrigger asChild>
                  <button 
                    onClick={handleShare}
                    className="bg-white/20 backdrop-blur-sm rounded-full p-2"
                  >
                    <Share2 size={16} color="white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align={isMobile ? "end" : "center"} sideOffset={5}>
                  <div className="flex flex-col">
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Link
                    </button>
                    <button 
                      onClick={handleFacebookShare}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-blue-600"
                    >
                      <Facebook size={16} className="mr-2" />
                      Share on Facebook
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4">
          <h1 className="text-2xl font-semibold mb-3 text-[28px]">{recipe.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="capitalize text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="px-4 grid grid-cols-4 gap-2 mb-4">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <Clock size={16} className="text-blue-500" />
            </div>
            <p className="text-xs text-blue-500 font-medium">{recipe.time || 'N/A'}</p>
            <p className="text-[10px] text-gray-500">Cook Time</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <Tags size={16} className="text-green-500" />
            </div>
            <p className="text-xs text-green-500 font-medium">Category</p>
            <p className="text-[10px] text-gray-500">Type</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <Users size={16} className="text-orange-500" />
            </div>
            <p className="text-xs text-orange-500 font-medium">{recipe.servings || 0}</p>
            <p className="text-[10px] text-gray-500">Servings</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
              <LightbulbIcon size={16} className="text-yellow-500" />
            </div>
            <p className="text-xs text-yellow-500 font-medium">{recipe.rating > 4 ? "Delicious" : recipe.rating > 3 ? "Tasty" : recipe.rating > 2 ? "Just Okay" : "Not Great"}</p>
            <p className="text-[10px] text-gray-500">Rating</p>
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="text-base font-semibold mb-2">Description</h3>
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">{recipe.description || 'No description available.'}</p>
          </div>
        </div>

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
                {ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{ingredient}</span>
                  </li>
                ))}
                {ingredients.length === 0 && (
                  <li className="text-sm text-gray-500 italic">No ingredients listed for this recipe.</li>
                )}
              </ul>
            </TabsContent>
            
            <TabsContent value="instructions" className="mt-4">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <CircleCheck className="mr-2" size={14} />
                Instructions
              </h3>
              <ol className="space-y-4">
                {instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex">
                    <div className="h-6 w-6 bg-primary text-white rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{instruction}</span>
                  </li>
                ))}
                {instructions.length === 0 && (
                  <li className="text-sm text-gray-500 italic">No instructions provided for this recipe.</li>
                )}
              </ol>
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-base font-semibold mb-3">Nutrition Information</h3>
          <div className="flex justify-between mb-2">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
                <span className="text-red-500 text-xs font-semibold">{nutrition.calories}</span>
              </div>
              <p className="text-xs text-gray-600">Calories</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
                <span className="text-purple-600 text-xs font-semibold">{nutrition.protein}</span>
              </div>
              <p className="text-xs text-gray-600">Protein</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
                <span className="text-green-500 text-xs font-semibold">{nutrition.carbs}</span>
              </div>
              <p className="text-xs text-gray-600">Carbs</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mb-1">
                <span className="text-yellow-500 text-xs font-semibold">{nutrition.fat}</span>
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

        <div className="px-4 mt-6">
          <h3 className="text-base font-semibold mb-3">Tips</h3>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="flex items-start mb-2">
              <LightbulbIcon size={14} className="text-yellow-500 mr-2 text-blue-500" />
              <h4 className="text-sm font-semibold text-yellow-600">Chef Tips</h4>
            </div>
            <ul className="space-y-2 ml-2">
              {tips && tips.length > 0 ? (
                tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start">
                  <span className="text-sm text-gray-500 italic">No tips available for this recipe.</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-2 text-blue-500" />
              <h3 className="text-base font-semibold">Comments ({allComments.length})</h3>
            </div>
            <button 
              className="text-blue-500 text-sm font-medium"
              onClick={handleViewAllComments}
            >
              View All
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-semibold mb-4">Add Your Comment</h3>
            
            <Textarea 
              placeholder="Share your experience with this recipe..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4 bg-gray-50"
            />
            
            <div className="mb-4">
              <h4 className="text-sm text-gray-700 mb-2">Rate this recipe:</h4>
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

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="p-4 max-h-[90vh]">
            <DrawerHeader className="relative">
              <DrawerTitle className="text-center">All Comments ({allComments.length})</DrawerTitle>
              <DrawerClose className="absolute right-2 top-2">
                <X className="h-5 w-5" />
              </DrawerClose>
            </DrawerHeader>
            
            <div className="mt-4 space-y-4 overflow-auto max-h-[70vh] p-2">
              {allComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-500 font-semibold mr-3">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium text-sm">{comment.author}</div>
                        <div className="text-xs text-gray-500">{comment.date}</div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.text}</p>
                      {comment.ratingLabel && (
                        <div className={`inline-block px-3 py-1 rounded-full text-xs ${getRatingLabelColor(comment.ratingLabel)}`}>
                          {comment.ratingLabel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {allComments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to add one!
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        <BottomNavigation
          activeItem={activeNavItem}
          onItemClick={handleNavItemClick}
          onCameraClick={handleCameraClick}
        />

        <CameraSheet 
          open={cameraSheetOpen}
          onOpenChange={setCameraSheetOpen}
        />
      </div>
    </div>
  );
};

const saveRecipeHelper = async (recipe: any) => {
  try {
    await saveRecipeToFirebase(recipe);
    return true;
  } catch (error) {
    console.error('Error saving recipe:', error);
    return false;
  }
};

export default RecipeDetailPage;
