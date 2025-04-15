import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Bell, BookmarkCheck, Heart, MessageSquare, Bookmark,
  Folder, FolderOpen, Utensils, Flower, PawPrint, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { RecipeCard } from "@/components/RecipeCard";
import CameraSheet from "@/components/CameraSheet";
import { getBookmarks, removeBookmark } from '@/lib/firebaseService';
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

const BookmarksPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState("forum");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [bookmarkedScans, setBookmarkedScans] = useState<any[]>([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<any[]>([]);
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);

  useEffect(() => {
    const loadBookmarks = async () => {
      const forumBookmarks = await getBookmarks('forum');
      setBookmarkedPosts(forumBookmarks);
      
      const recipeBookmarks = await getBookmarks('recipe');
      setBookmarkedRecipes(recipeBookmarks);
      
      const foodBookmarks = await getBookmarks('food');
      const plantBookmarks = await getBookmarks('plants');
      const animalBookmarks = await getBookmarks('animals');
      
      setBookmarkedScans([...foodBookmarks, ...plantBookmarks, ...animalBookmarks]);
    };
    
    loadBookmarks();
  }, [user]);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/forum/post/${postId}`);
  };
  
  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    } else if (item === "profile") {
      navigate("/profile");
    }
  };

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };

  const handleLikePost = (postId: string) => {
    toast({
      title: "Post liked",
      description: "The author has been notified",
    });
  };

  const handleUnbookmarkPost = async (postId: string) => {
    const success = await removeBookmark(postId, 'forum');
    
    if (success) {
      setBookmarkedPosts(bookmarkedPosts.filter(post => post.id !== postId));
      
      toast({
        title: "Post unbookmarked",
        description: "Removed from your bookmarks",
      });
    }
  };
  
  const handleRemoveRecipeBookmark = async (recipeId: string) => {
    const success = await removeBookmark(recipeId, 'recipe');
    
    if (success) {
      setBookmarkedRecipes(bookmarkedRecipes.filter(recipe => recipe.id !== recipeId));
      
      toast({
        title: "Recipe unbookmarked",
        description: "Recipe removed from your bookmarks",
      });
    }
  };

  const handleRemoveScanBookmark = async (scanId: string, scanType: string) => {
    const success = await removeBookmark(scanId, scanType as 'food' | 'plants' | 'animals');
    
    if (success) {
      setBookmarkedScans(bookmarkedScans.filter(scan => !(scan.id === scanId && scan.type === scanType)));
      
      toast({
        title: "Scan unbookmarked",
        description: "Scan removed from your bookmarks",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-500";
    if (score >= 60) return "bg-purple-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };
  
  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return "border-teal-300";
    if (score >= 60) return "border-purple-300";
    if (score >= 40) return "border-orange-300";
    return "border-red-300";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Not great";
    return "Bad";
  };

  const getScanTypeIcon = (type: string) => {
    switch (type) {
      case 'food':
        return <Utensils className="h-5 w-5 text-wayscanner-blue" />;
      case 'plants':
        return <Flower className="h-5 w-5 text-wayscanner-green" />;
      case 'animals':
        return <PawPrint className="h-5 w-5 text-wayscanner-red" />;
      default:
        return <Bookmark className="h-5 w-5" />;
    }
  };

  const getScanPath = (scan: any) => {
    switch (scan.type) {
      case 'food':
        return `/food/${scan.id}`;
      case 'plants':
        return `/plants/${scan.id}`;
      case 'animals':
        return `/animals/${scan.id}`;
      default:
        return `/scan?tab=${scan.type}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <button className="p-2" onClick={handleBackClick} type="button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">My Bookmarks</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2" type="button">
              <Bell size={24} fill="white" strokeWidth={1.5} />
            </button>
            <button className="p-2" onClick={() => navigate("/profile")} type="button">
              <User size={24} fill="white" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="forum" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="forum" className="text-base py-2 data-[state=active]:bg-wayscanner-blue data-[state=active]:text-white">
              Forum
            </TabsTrigger>
            <TabsTrigger value="scan" className="text-base py-2 data-[state=active]:bg-wayscanner-blue data-[state=active]:text-white">
              Scan
            </TabsTrigger>
            <TabsTrigger value="recipes" className="text-base py-2 data-[state=active]:bg-wayscanner-blue data-[state=active]:text-white">
              Recipes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="pb-20">
            <div className="space-y-4">
              {bookmarkedPosts.length > 0 ? (
                bookmarkedPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-[16px] text-gray-800">{post.author.name}</h3>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">{post.timeAgo}</span>
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                            post.category === "Plants" ? "bg-green-100 text-green-700" : 
                            post.category.includes("Food") || post.category.includes("Recipe") || post.category.includes("Cooking") || post.category.includes("Kitchen") || post.category.includes("Nutrition") ? "bg-red-100 text-red-700" : 
                            post.category.includes("Animals") || post.category.includes("Pets") ? "bg-yellow-100 text-yellow-700" :
                            post.category === "Travel" ? "bg-purple-100 text-purple-700" :
                            post.category.includes("DIY") || post.category.includes("Home") || post.category.includes("Decor") ? "bg-orange-100 text-orange-700" :
                            post.category.includes("Question") ? "bg-blue-100 text-blue-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[16px] text-gray-700 mb-4">{post.content}</p>
                    
                    {post.imageUrl && (
                      <div className="mb-4 border rounded-lg overflow-hidden">
                        <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
                      </div>
                    )}
                    
                    <div className="flex items-center border-t border-gray-100 pt-3">
                      <button 
                        className="flex items-center mr-5"
                        onClick={() => handleLikePost(post.id)}
                        type="button"
                      >
                        <Heart 
                          size={22} 
                          className={post.liked ? "fill-red-500 text-red-500" : "text-black"}
                        />
                        <span className="ml-1 text-gray-600">{post.likes}</span>
                      </button>
                      <button 
                        className="flex items-center mr-5"
                        onClick={() => handlePostClick(post.id)}
                        type="button"
                      >
                        <MessageSquare size={22} className="text-black" />
                        <span className="ml-1 text-gray-600">{post.comments}</span>
                      </button>
                      <button 
                        className="flex items-center"
                        onClick={() => handleUnbookmarkPost(post.id)}
                        type="button"
                      >
                        <Bookmark 
                          size={22} 
                          className="fill-wayscanner-blue text-wayscanner-blue"
                        />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow">
                  <FolderOpen size={48} className="text-gray-400 mb-2" />
                  <p className="text-gray-600 text-center text-[16px]">No bookmarked forum posts yet.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Bookmark posts in the forum to save them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="pb-20">
            <div className="space-y-4">
              {bookmarkedScans.length > 0 ? (
                bookmarkedScans.map(scan => (
                  <div 
                    key={`${scan.type}-${scan.id}`} 
                    className="p-3 rounded-xl border shadow-sm bg-white flex items-center justify-between cursor-pointer"
                    onClick={() => navigate(getScanPath(scan))}
                  >
                    <div className="h-14 w-14 mr-3 flex-shrink-0 rounded-xl overflow-hidden">
                      <img 
                        src={scan.imageUrl} 
                        alt={scan.name} 
                        className="h-full w-full object-cover rounded-[12px]"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{scan.name}</h3>
                      <p className="text-md text-blue-500">{scan.brand}</p>
                      {scan.score && (
                        <div className={`${getScoreColor(scan.score)} text-white px-4 py-1 rounded-full text-md inline-flex items-center mt-2 border-2 ${getScoreBorderColor(scan.score)}`}>
                          <span className="font-bold mr-1">{scan.score}</span>
                          <span>{getScoreText(scan.score)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveScanBookmark(scan.id, scan.type);
                        }}
                        className="p-2 mr-2 text-gray-500"
                        aria-label="Remove bookmark"
                      >
                        <Bookmark className="h-6 w-6 fill-wayscanner-blue text-wayscanner-blue" />
                      </button>
                      <ChevronRight className="text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow">
                  <FolderOpen size={48} className="text-gray-400 mb-2" />
                  <p className="text-gray-600 text-center text-[16px]">No bookmarked scans yet.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Bookmark scans to save them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="pb-20">
            <div className="space-y-4">
              {bookmarkedRecipes.length > 0 ? (
                bookmarkedRecipes.map(recipe => (
                  <div key={recipe.id} className="bg-white rounded-lg shadow">
                    <RecipeCard
                      recipe={recipe}
                      onClick={() => handleRecipeClick(recipe.id)}
                    />
                    <div className="px-4 pb-3">
                      <button 
                        className="flex items-center text-blue-500 py-2 text-[16px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveRecipeBookmark(recipe.id);
                        }}
                        type="button"
                      >
                        <Bookmark size={18} className="fill-blue-500 mr-2" />
                        Remove from bookmarks
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow">
                  <FolderOpen size={48} className="text-gray-400 mb-2" />
                  <p className="text-gray-600 text-center text-[16px]">No bookmarked recipes yet.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Bookmark recipes to save them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
      
      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
    </div>
  );
};

export default BookmarksPage;
