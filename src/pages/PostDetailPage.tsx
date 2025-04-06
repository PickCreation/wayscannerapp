
import React, { useState } from "react";
import { ChevronLeft, Heart, Bookmark, Send, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import CameraSheet from "@/components/CameraSheet";

// Sample post data
const POST = {
  id: "1",
  author: {
    name: "John D.",
    avatar: "/placeholder.svg",
  },
  timeAgo: "12h ago",
  category: "Plants",
  content: "Just found this amazing plant in my backyard. Anyone know what it is?",
  likes: 2,
  comments: [
    {
      id: "c1",
      author: {
        name: "Sarah M.",
        avatar: "/placeholder.svg",
      },
      timeAgo: "10h ago",
      content: "Looks like a peace lily! They're great indoor plants.",
    },
    {
      id: "c2",
      author: {
        name: "Robert J.",
        avatar: "/placeholder.svg",
      },
      timeAgo: "8h ago",
      content: "I agree with Sarah, definitely a peace lily. They like indirect light and regular watering.",
    }
  ],
  bookmarked: false,
  liked: false
};

const PostDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState(POST);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  
  const handleLikePost = () => {
    setPost((prev) => {
      const newLikes = prev.likes + (prev.liked ? -1 : 1);
      return { ...prev, likes: newLikes, liked: !prev.liked };
    });
    
    if (!post.liked) {
      toast({
        title: "Post liked",
        description: "The author has been notified",
      });
    }
  };
  
  const handleBookmarkPost = () => {
    setPost((prev) => ({ ...prev, bookmarked: !prev.bookmarked }));
    
    toast({
      title: post.bookmarked ? "Bookmark removed" : "Post bookmarked",
      description: post.bookmarked ? "Removed from your profile" : "Saved to your profile",
    });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c${comments.length + 1}`,
      author: {
        name: "You",
        avatar: "/placeholder.svg",
      },
      timeAgo: "Just now",
      content: newComment.trim(),
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
    
    toast({
      title: "Comment posted",
      description: "The author has been notified",
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header - Using the same header as home page */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
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
          <button className="p-2">
            <Bell size={24} fill="white" strokeWidth={1.5} />
          </button>
          <button className="p-2" onClick={handleProfileClick}>
            <User size={24} fill="white" strokeWidth={1.5} />
          </button>
        </div>
      </header>
      
      {/* Post Detail */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-100">
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
                <span className="ml-2 px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
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
              onClick={handleLikePost}
            >
              <Heart 
                size={22} 
                className={post.liked ? "fill-red-500 text-red-500" : "text-gray-500"}
              />
              <span className="ml-1 text-gray-600">{post.likes}</span>
            </button>
            <button 
              className="flex items-center mr-5"
            >
              <div className="text-blue-600 font-medium">
                {comments.length} Comments
              </div>
            </button>
            <button 
              className="flex items-center ml-auto"
              onClick={handleBookmarkPost}
            >
              <Bookmark 
                size={22} 
                className={post.bookmarked ? "fill-gray-700 text-gray-700" : "text-gray-500"}
              />
            </button>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <h4 className="font-medium text-lg mb-4">Comments</h4>
          
          <div className="space-y-4 mb-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex">
                <Avatar className="h-10 w-10 mr-3 mt-1">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-gray-500 text-xs">{comment.timeAgo}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Comment */}
          <div className="flex space-x-2">
            <Input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button onClick={handleSubmitComment} size="icon">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Camera Sheet */}
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
      
      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem="forum"
        onItemClick={(item) => {
          if (item === "forum") {
            navigate("/forum");
            return;
          }
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

export default PostDetailPage;
