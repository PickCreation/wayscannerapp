
import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Bell, BookmarkCheck, 
  Folder, FolderOpen 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

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

    // For demonstration, we'll add some placeholder data for scans and recipes
    // In a real app, you would load these from localStorage or an API
    setBookmarkedScans([
      { id: 's1', title: 'Organic Apple', date: '2025-04-01', category: 'Fruit', score: 87 },
      { id: 's2', title: 'Whole Grain Bread', date: '2025-04-02', category: 'Bakery', score: 92 },
    ]);

    setBookmarkedRecipes([
      { id: 'r1', title: 'Vegetable Stir Fry', author: 'Chef Jamie', difficulty: 'Medium', time: '30 mins' },
      { id: 'r2', title: 'Chocolate Brownies', author: 'Baker Paul', difficulty: 'Easy', time: '45 mins' },
    ]);
  }, []);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/forum/post/${postId}`);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
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
            <Card>
              <CardContent className="p-0">
                {bookmarkedPosts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Author</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookmarkedPosts.map((post) => (
                        <TableRow 
                          key={post.id} 
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handlePostClick(post.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <BookmarkCheck size={16} className="mr-2 text-wayscanner-blue" />
                              {post.content.length > 30 ? post.content.substring(0, 30) + "..." : post.content}
                            </div>
                          </TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell>{post.author.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    <FolderOpen size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 text-center">No bookmarked forum posts yet.</p>
                    <p className="text-gray-400 text-sm text-center mt-1">
                      Bookmark posts in the forum to save them here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scan Bookmarks */}
          <TabsContent value="scan" className="pb-20">
            <Card>
              <CardContent className="p-0">
                {bookmarkedScans.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookmarkedScans.map((scan) => (
                        <TableRow key={scan.id} className="cursor-pointer hover:bg-gray-100">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <BookmarkCheck size={16} className="mr-2 text-wayscanner-blue" />
                              {scan.title}
                            </div>
                          </TableCell>
                          <TableCell>{scan.category}</TableCell>
                          <TableCell>{scan.date}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              scan.score >= 90 ? "bg-green-100 text-green-700" :
                              scan.score >= 70 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {scan.score}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    <FolderOpen size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 text-center">No bookmarked scans yet.</p>
                    <p className="text-gray-400 text-sm text-center mt-1">
                      Bookmark scans to save them here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Bookmarks */}
          <TabsContent value="recipes" className="pb-20">
            <Card>
              <CardContent className="p-0">
                {bookmarkedRecipes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipe</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookmarkedRecipes.map((recipe) => (
                        <TableRow key={recipe.id} className="cursor-pointer hover:bg-gray-100">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <BookmarkCheck size={16} className="mr-2 text-wayscanner-blue" />
                              {recipe.title}
                            </div>
                          </TableCell>
                          <TableCell>{recipe.author}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              recipe.difficulty === 'Easy' ? "bg-green-100 text-green-700" :
                              recipe.difficulty === 'Medium' ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {recipe.difficulty}
                            </span>
                          </TableCell>
                          <TableCell>{recipe.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    <FolderOpen size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 text-center">No bookmarked recipes yet.</p>
                    <p className="text-gray-400 text-sm text-center mt-1">
                      Bookmark recipes to save them here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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
