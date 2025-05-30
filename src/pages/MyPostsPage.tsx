
import React, { useState, useEffect } from "react";
import { Loader2, Heart, MessageSquare, Bookmark, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import CreatePostSheet from "@/components/CreatePostSheet";
import CameraSheet from "@/components/CameraSheet";
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/hooks/use-auth";
import { getMyPosts, likePost, addBookmark, removeBookmark, deletePost, createSampleUserPosts } from "@/lib/firebaseService";

export const MyPostsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingPosts, setCreatingPosts] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Try to get posts from Firebase first
        try {
          const fetchedPosts = await getMyPosts();
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching my posts from Firebase:", error);
          
          // Fallback to localStorage
          const savedPosts = localStorage.getItem('forumPosts');
          const allPosts = savedPosts ? JSON.parse(savedPosts) : [];
          const myPosts = allPosts.filter((post: any) => 
            post.authorId === user.id || 
            post.author?.name === user.name
          );
          setPosts(myPosts);
        }
      } catch (error) {
        console.error("Error fetching my posts:", error);
        toast({
          title: "Error",
          description: "Failed to load your posts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [isAuthenticated, user, toast]);

  const handleCreateSamplePosts = async () => {
    if (creatingPosts) return;
    
    setCreatingPosts(true);
    try {
      const newPosts = await createSampleUserPosts();
      setPosts(prevPosts => [...newPosts, ...prevPosts]);
      
      toast({
        title: "Success",
        description: `Created ${newPosts.length} sample posts for testing`,
      });
    } catch (error) {
      console.error("Error creating sample posts:", error);
      toast({
        title: "Error",
        description: "Failed to create sample posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreatingPosts(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      
      // Also remove from localStorage
      const savedPosts = localStorage.getItem('forumPosts');
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts);
        const updatedPosts = allPosts.filter((post: any) => post.id !== postId);
        localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
      }
      
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      const result = await likePost(postId, isLiked);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: result.likes, liked: result.liked };
        }
        return post;
      }));
    } catch (error) {
      console.error("Error liking post:", error);
      // Fallback to local update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { 
            ...post, 
            likes: isLiked ? post.likes - 1 : post.likes + 1, 
            liked: !isLiked 
          };
        }
        return post;
      }));
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
    }
  };

  const handleCommentClick = (postId: string) => {
    navigate(`/forum/post/${postId}`);
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
          <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">My Posts</h1>
          </header>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Please log in to view your posts</p>
              <button
                onClick={() => setShowLoginDialog(true)}
                className="bg-wayscanner-blue text-white px-6 py-3 rounded-lg font-medium"
                type="button"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
        
        {showLoginDialog && (
          <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
        )}
        
        <BottomNavigation
          activeItem="forum"
          onItemClick={(item) => {
            if (item === "home") navigate("/");
            if (item === "forum") navigate("/forum");
            if (item === "recipes") navigate("/recipes");
            if (item === "shop") navigate("/marketplace");
          }}
          onCameraClick={handleCameraClick}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button onClick={() => navigate("/forum")} className="text-white">
          ← Back
        </button>
        <h1 className="text-xl font-bold">My Posts</h1>
        <button 
          onClick={() => setShowCreatePost(true)}
          className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-colors"
          type="button"
        >
          <Plus size={20} />
        </button>
      </header>
      
      <div className="flex-1 p-3 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-wayscanner-blue" />
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
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
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  type="button"
                  title="Delete post"
                >
                  <Trash2 size={18} />
                </button>
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
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200 text-center">
            <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-wayscanner-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors block w-full"
                type="button"
              >
                Create Your First Post
              </button>
              <button
                onClick={handleCreateSamplePosts}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors block w-full"
                disabled={creatingPosts}
                type="button"
              >
                {creatingPosts ? (
                  <>
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                    Creating sample posts...
                  </>
                ) : (
                  "Create Sample Posts for Testing"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showCreatePost && (
        <CreatePostSheet open={showCreatePost} onOpenChange={setShowCreatePost} />
      )}
      
      {showCameraSheet && (
        <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
      )}
      
      {showLoginDialog && (
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      )}
      
      <BottomNavigation
        activeItem="forum"
        onItemClick={(item) => {
          if (item === "home") navigate("/");
          if (item === "forum") navigate("/forum");
          if (item === "recipes") navigate("/recipes");
          if (item === "shop") navigate("/marketplace");
        }}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default MyPostsPage;
