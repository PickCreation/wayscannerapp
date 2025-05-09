
import React, { useState, useEffect } from "react";
import { Heart, MessageSquare, Bookmark, Bell, User, ChevronLeft, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import CreatePostSheet from "@/components/CreatePostSheet";
import CameraSheet from "@/components/CameraSheet";
import { useAuth } from "@/hooks/use-auth";
import { getMyPosts, likePost, addBookmark, removeBookmark, deletePost } from "@/lib/firebaseService";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CATEGORIES = [
  "All", "Plants", "Gardening", "Nature", "Food", "Healthy Recipes", 
  "Nutrition Tips", "Cooking", "Kitchen", "Animals & Pets", "DIY", 
  "Home", "Decor", "Travel", "Questions", "Product Talk"
];

const MyPostsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "my">("my");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const myPosts = await getMyPosts();
          setPosts(myPosts);
        } else {
          navigate('/profile');
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load your posts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [isAuthenticated, navigate, toast]);
  
  useEffect(() => {
    const handleAddNewPost = (event: CustomEvent) => {
      const newPost = event.detail;
      setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    window.addEventListener('addNewPost', handleAddNewPost as EventListener);
    
    return () => {
      window.removeEventListener('addNewPost', handleAddNewPost as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const handleOpenCreatePost = () => {
      setShowCreatePost(true);
    };
    
    window.addEventListener('openCreatePost', handleOpenCreatePost);
    
    return () => {
      window.removeEventListener('openCreatePost', handleOpenCreatePost);
    };
  }, []);
  
  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);
  
  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      const result = await likePost(postId, isLiked);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: result.likes, liked: result.liked };
        }
        return post;
      }));
      
      if (!isLiked) {
        toast({
          title: "Post liked",
          description: "The author has been notified",
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleBookmarkPost = async (postId: string, isBookmarked: boolean) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      if (isBookmarked) {
        await removeBookmark(postId, 'forum');
      } else {
        await addBookmark(post, 'forum');
      }
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, bookmarked: !isBookmarked };
        }
        return post;
      }));
      
      toast({
        title: isBookmarked ? "Bookmark removed" : "Post bookmarked",
        description: isBookmarked ? "Removed from your bookmarks" : "Saved to your bookmarks",
      });
    } catch (error) {
      console.error("Error bookmarking post:", error);
      toast({
        title: "Error",
        description: "Failed to bookmark post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCommentClick = (postId: string) => {
    console.log("Navigating to post detail from My Posts:", postId);
    navigate(`/forum/post/${postId}`);
  };
  
  const handleDeletePost = async (postId: string) => {
    setDeleting(postId);
    
    try {
      await deletePost(postId);
      
      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Post deleted",
        description: "Your post has been removed",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };
  
  const handleTabChange = (tab: "all" | "my") => {
    if (tab === "all") {
      navigate('/forum');
      return;
    }
    setActiveTab(tab);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button onClick={() => navigate('/forum')} className="p-2 -ml-2" type="button">
          <ChevronLeft size={24} color="white" />
        </button>
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" 
            alt="WayScanner Logo" 
            className="h-8" 
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2" type="button">
            <Bell size={24} fill="white" strokeWidth={1.5} />
          </button>
          <button className="p-2" onClick={handleProfileClick} type="button">
            <User size={24} fill="white" strokeWidth={1.5} />
          </button>
        </div>
      </header>
      
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 font-medium ${activeTab === "all" ? "text-wayscanner-blue border-b-2 border-wayscanner-blue" : "text-gray-500"}`}
          onClick={() => handleTabChange("all")}
          type="button"
        >
          <span className="text-[18px]">All Posts</span>
        </button>
        <button
          className={`flex-1 py-3 font-medium ${activeTab === "my" ? "text-wayscanner-blue border-b-2 border-wayscanner-blue" : "text-gray-500"}`}
          onClick={() => handleTabChange("my")}
          type="button"
        >
          <span className="text-[18px]">My Posts</span>
        </button>
      </div>
      
      <div className="p-3 overflow-x-auto flex space-x-2 bg-white">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full text-sm flex items-center whitespace-nowrap ${
              activeCategory === category
                ? "bg-blue-100 text-blue-600 border border-blue-300"
                : "bg-white border border-gray-300"
            }`}
            type="button"
          >
            {activeCategory === category && category === "All" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {category}
          </button>
        ))}
      </div>
      
      <div className="flex-1 p-3 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-wayscanner-blue" />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center mb-3">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[16px] text-gray-800">{post.author.name}</h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-gray-400 hover:text-red-500" type="button">
                          {deleting === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeletePost(post.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
              
              <p className="text-[14px] text-gray-700 mb-4">{post.content}</p>
              
              {post.imageUrl && (
                <div className="mb-4 border rounded-lg overflow-hidden">
                  <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
                </div>
              )}
              
              <div className="flex items-center border-t border-gray-100 pt-3">
                <button 
                  className="flex items-center mr-5"
                  onClick={() => handleLikePost(post.id, post.liked)}
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
                  onClick={() => handleCommentClick(post.id)}
                  type="button"
                >
                  <MessageSquare size={22} className="text-black" />
                  <span className="ml-1 text-gray-600">{post.comments}</span>
                </button>
                <button 
                  className="flex items-center"
                  onClick={() => handleBookmarkPost(post.id, post.bookmarked)}
                  type="button"
                >
                  <Bookmark 
                    size={22} 
                    className={post.bookmarked ? "fill-wayscanner-blue text-wayscanner-blue" : "text-black"}
                  />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-500 mb-6">Create your first post to share with the community</p>
            <button 
              onClick={() => setShowCreatePost(true)} 
              className="bg-wayscanner-blue text-white px-6 py-3 rounded-lg font-medium"
              type="button"
            >
              Create Post
            </button>
          </div>
        )}
      </div>
      
      <CreatePostSheet open={showCreatePost} onOpenChange={setShowCreatePost} />
      
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
      
      <BottomNavigation
        activeItem="forum"
        onItemClick={(item) => {
          if (item === "forum") return;
          if (item === "home") {
            navigate("/");
            return;
          }
          
          toast({
            title: "Coming Soon",
            description: `The ${item} feature is under development.`,
          });
        }}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default MyPostsPage;
