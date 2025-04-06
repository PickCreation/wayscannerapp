
import React, { useState } from "react";
import { ChevronLeft, Heart, Bookmark, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
      content: "It looks like a variety of fern. Beautiful find!",
    },
    {
      id: "c2",
      author: {
        name: "Tom B.",
        avatar: "/placeholder.svg",
      },
      timeAgo: "8h ago",
      content: "I think it's a Japanese painted fern. They have that distinctive silver color.",
    },
  ],
  bookmarked: false,
  liked: false,
};

export const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(POST);
  const [comments, setComments] = useState(POST.comments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  
  const handleBackClick = () => {
    navigate("/forum");
  };
  
  const handleLikePost = () => {
    setPost(prev => {
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
    setPost(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
    
    toast({
      title: post.bookmarked ? "Bookmark removed" : "Post bookmarked",
      description: post.bookmarked ? "Removed from your saved items" : "Saved to your profile",
    });
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: `c${comments.length + 1}`,
      author: {
        name: "You",
        avatar: "/placeholder.svg",
      },
      timeAgo: "Just now",
      content: newComment,
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment("");
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the post",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex items-center">
        <button
          onClick={handleBackClick}
          className="p-2 -ml-2 mr-2"
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold">Post</h1>
        </div>
        <div className="w-10"></div> {/* Empty space for balance */}
      </header>
      
      {/* Original Post */}
      <div className="bg-white p-4 border-b">
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
        <div className="flex items-center pt-2">
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
            className="flex items-center"
            onClick={handleBookmarkPost}
          >
            <Bookmark 
              size={22} 
              className={post.bookmarked ? "fill-gray-700 text-gray-700" : "text-gray-500"}
            />
          </button>
        </div>
      </div>
      
      {/* Comments Header */}
      <div className="bg-white px-4 py-3 border-b">
        <h2 className="font-medium">Comments ({comments.length})</h2>
      </div>
      
      {/* Comments List */}
      <div className="flex-1 overflow-auto">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="divide-y">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 bg-white">
                <div className="flex">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline">
                      <h4 className="font-medium">{comment.author.name}</h4>
                      <span className="ml-2 text-xs text-gray-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Comment Input */}
      <div className="bg-white border-t p-3 sticky bottom-0">
        <form onSubmit={handleSubmitComment} className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 shrink-0">
            <AvatarImage src="/placeholder.svg" alt="You" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-gray-100 border-0"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="ml-1 text-wayscanner-blue" 
            disabled={!newComment.trim()}
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostDetailPage;
