
import React, { useState } from "react";
import { ChevronLeft, Heart, MessageSquare, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import CreatePostSheet from "@/components/CreatePostSheet";

// Sample forum data
const POSTS = [
  {
    id: "1",
    author: {
      name: "John D.",
      avatar: "/placeholder.svg",
    },
    timeAgo: "12h ago",
    category: "Plants",
    content: "Just found this amazing plant in my backyard. Anyone know what it is?",
    likes: 2,
    comments: 2,
    bookmarked: false,
    liked: false, // Add the liked property
  },
  {
    id: "2",
    author: {
      name: "Emma K.",
      avatar: "/placeholder.svg",
    },
    timeAgo: "5h ago",
    category: "Food",
    content: "Made this healthy salad for lunch today. The app identified all the ingredients perfectly!",
    likes: 3,
    comments: 1,
    bookmarked: false,
    liked: false, // Add the liked property
  },
  {
    id: "3",
    author: {
      name: "Mike P.",
      avatar: "/placeholder.svg",
    },
    timeAgo: "2d ago",
    category: "Animals",
    content: "Spotted this rare bird in the park today. The scanner identified it as a Northern Flicker!",
    likes: 15,
    comments: 7,
    bookmarked: true,
    liked: false, // Add the liked property
  }
];

// Category options for filtering
const CATEGORIES = ["All", "Plants", "Gardening", "Nature", "Food", "Animals"];

export const ForumPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState(POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { toast } = useToast();
  
  const handleBackClick = () => {
    navigate("/");
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.likes + (post.liked ? -1 : 1);
        return { ...post, likes: newLikes, liked: !post.liked };
      }
      return post;
    }));
    
    toast({
      title: "Post liked",
      description: "The author has been notified",
    });
  };
  
  const handleBookmarkPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, bookmarked: !post.bookmarked };
      }
      return post;
    }));
    
    toast({
      title: "Post bookmarked",
      description: "Saved to your profile",
    });
  };
  
  const handleCommentClick = (postId: string) => {
    navigate(`/forum/post/${postId}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex items-center">
        <button
          onClick={handleBackClick}
          className="p-2 -ml-2 mr-2"
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">Forum</h1>
        </div>
        <div className="w-10"></div> {/* Empty space for balance */}
      </header>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 font-medium text-lg ${activeTab === "all" ? "text-wayscanner-blue border-b-2 border-wayscanner-blue" : "text-gray-500"}`}
          onClick={() => setActiveTab("all")}
        >
          All Posts
        </button>
        <button
          className={`flex-1 py-3 font-medium text-lg ${activeTab === "my" ? "text-wayscanner-blue border-b-2 border-wayscanner-blue" : "text-gray-500"}`}
          onClick={() => setActiveTab("my")}
        >
          My Posts
        </button>
      </div>
      
      {/* Category Filter */}
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
      
      {/* Posts List */}
      <div className="flex-1 p-3 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            {/* Post Header - Author & Time */}
            <div className="flex items-center mb-3">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg text-gray-800">{post.author.name}</h3>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">{post.timeAgo}</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                    post.category === "Plants" ? "bg-green-100 text-green-700" : 
                    post.category === "Food" ? "bg-red-100 text-red-700" : 
                    post.category === "Animals" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <p className="text-gray-700 mb-4">{post.content}</p>
            
            {/* Post Actions */}
            <div className="flex items-center border-t border-gray-100 pt-3">
              <button 
                className="flex items-center mr-5"
                onClick={() => handleLikePost(post.id)}
              >
                <Heart 
                  size={22} 
                  className={post.liked ? "fill-red-500 text-red-500" : "text-gray-500"}
                />
                <span className="ml-1 text-gray-600">{post.likes}</span>
              </button>
              <button 
                className="flex items-center mr-5"
                onClick={() => handleCommentClick(post.id)}
              >
                <MessageSquare size={22} className="text-gray-500" />
                <span className="ml-1 text-gray-600">{post.comments}</span>
              </button>
              <button 
                className="flex items-center"
                onClick={() => handleBookmarkPost(post.id)}
              >
                <Bookmark 
                  size={22} 
                  className={post.bookmarked ? "fill-gray-700 text-gray-700" : "text-gray-500"}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Post Sheet */}
      <CreatePostSheet open={showCreatePost} onOpenChange={setShowCreatePost} />
      
      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem="forum"
        onItemClick={(item) => {
          if (item === "forum") return;
          navigate("/");
        }}
        onCameraClick={() => setShowCreatePost(true)}
      />
    </div>
  );
};

export default ForumPage;
