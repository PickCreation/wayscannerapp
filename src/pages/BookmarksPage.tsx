
import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Bell, BookmarkCheck, Heart, MessageSquare, Bookmark,
  Folder, FolderOpen 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { RecipeCard } from "@/components/RecipeCard";

const BookmarksPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("forum");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("recipes");
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [bookmarkedScans, setBookmarkedScans] = useState<any[]>([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<any[]>([]);

  // Load bookmarked posts from localStorage
  useEffect(() => {
    // Load forum posts
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      const bookmarkedItems = allPosts.filter((post: any) => post.bookmarked);
      setBookmarkedPosts(bookmarkedItems);
    }

    // Load bookmarked recipes
    const savedRecipes = localStorage.getItem('bookmarkedRecipes');
    if (savedRecipes) {
      setBookmarkedRecipes(JSON.parse(savedRecipes));
    } else {
      // For demonstration only - this would be removed in production
      setBookmarkedRecipes([
        { 
          id: 'r1', 
          title: 'Vegetable Stir Fry', 
          author: 'Chef Jamie', 
          difficulty: 'Medium', 
          time: '30 mins',
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        },
        { 
          id: 'r2', 
          title: 'Chocolate Brownies', 
          author: 'Baker Paul', 
          difficulty: 'Easy', 
          time: '45 mins',
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        }
      ]);
    }

    // For demonstration, we'll add some placeholder data for scans
    setBookmarkedScans([
      { id: 's1', title: 'Organic Apple', date: '2025-04-01', category: 'Fruit', score: 87 },
      { id: 's2', title: 'Whole Grain Bread', date: '2025-04-02', category: 'Bakery', score: 92 },
    ]);
  }, []);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/forum/post/${postId}`);
  };
  
  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else {
      toast({
        title: "Coming Soon",
        description: `The ${item} feature is under development.`,
      });
    }
  };

  const handleCameraClick = () => {
    toast({
      title: "Camera",
      description: "The camera feature is under development.",
    });
  };

  const handleLikePost = (postId: string) => {
    // This is a placeholder for liking a post
    toast({
      title: "Post liked",
      description: "The author has been notified",
    });
  };

  const handleUnbookmarkPost = (postId: string) => {
    // Update the local state
    setBookmarkedPosts(bookmarkedPosts.filter(post => post.id !== postId));
    
    // Update localStorage
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      const updatedPosts = allPosts.map((post: any) => 
        post.id === postId ? { ...post, bookmarked: false } : post
      );
      localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    }
    
    toast({
      title: "Post unbookmarked",
      description: "Removed from your bookmarks",
    });
  };
  
  const handleRemoveRecipeBookmark = (recipeId: string) => {
    // Update the local state
    setBookmarkedRecipes(bookmarkedRecipes.filter(recipe => recipe.id !== recipeId));
    
    // Update localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks);
      const updatedBookmarks = bookmarks.filter((recipe: any) => recipe.id !== recipeId);
      localStorage.setItem('bookmarkedRecipes', JSON.stringify(updatedBookmarks));
    }
    
    toast({
      title: "Recipe unbookmarked",
      description: "Recipe removed from your bookmarks",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <button className="p-2" onClick={handleBackClick} type="button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">My Bookmarks</h1>
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

      {/* Tabs */}
      <div className="p-4">
        <Tabs defaultValue="forum" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="forum" className="data-[state=active]:bg-wayscanner-blue data-[state=active]:text-white">
              Forum
            </TabsTrigger>
            <TabsTrigger value="scan" className="data-[state=active]:bg-wayscanner-blue data-[state=active]:text-white">
              Scan
            </TabsTrigger>
            <TabsTrigger value="recipes" className="data-[state=active]:bg-wayscanner-blue data-[state=active]:text-white">
              Recipes
            </TabsTrigger>
          </TabsList>

          {/* Forum Bookmarks */}
          <TabsContent value="forum" className="pb-20">
            <div className="space-y-4">
              {bookmarkedPosts.length > 0 ? (
                bookmarkedPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    {/* Post Header - Author & Time */}
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
                    
                    {/* Post Content */}
                    <p className="text-[14px] text-gray-700 mb-4">{post.content}</p>
                    
                    {/* Post Image (if available) */}
                    {post.imageUrl && (
                      <div className="mb-4 border rounded-lg overflow-hidden">
                        <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
                      </div>
                    )}
                    
                    {/* Post Actions */}
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
                  <p className="text-gray-600 text-center">No bookmarked forum posts yet.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Bookmark posts in the forum to save them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scan Bookmarks */}
          <TabsContent value="scan" className="pb-20">
            <div className="space-y-4">
              {bookmarkedScans.length > 0 ? (
                bookmarkedScans.map(scan => (
                  <Card key={scan.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{scan.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          scan.score >= 90 ? "bg-green-100 text-green-700" :
                          scan.score >= 70 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          Score: {scan.score}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">Category: {scan.category}</div>
                      <div className="text-sm text-gray-500">Scanned on: {scan.date}</div>
                      <button 
                        className="mt-4 flex items-center text-wayscanner-blue"
                        onClick={() => setBookmarkedScans(prev => prev.filter(s => s.id !== scan.id))}
                        type="button"
                      >
                        <Bookmark size={18} className="fill-wayscanner-blue mr-1" />
                        Remove from bookmarks
                      </button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow">
                  <FolderOpen size={48} className="text-gray-400 mb-2" />
                  <p className="text-gray-600 text-center">No bookmarked scans yet.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Bookmark scans to save them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Recipes Bookmarks */}
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
                        className="flex items-center text-blue-500 py-2"
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
                  <p className="text-gray-600 text-center">No bookmarked recipes yet.</p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    Bookmark recipes to save them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default BookmarksPage;
