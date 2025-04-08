
import React, { useState } from "react";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/use-auth";

const BlogPostsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [blogPosts, setBlogPosts] = useState([
    {
      id: "1",
      title: "My Journey With Sustainable Gardening",
      excerpt: "How I transformed my garden into a sustainable ecosystem...",
      date: "April 2, 2025",
      readTime: "5 min read",
      likes: 24,
      comments: 8
    },
    {
      id: "2",
      title: "Top 10 Eco-Friendly Plants for Your Home",
      excerpt: "Discover the best plants that purify air and require minimal maintenance...",
      date: "March 28, 2025",
      readTime: "7 min read",
      likes: 42,
      comments: 15
    }
  ]);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleWriteNewPost = () => {
    navigate("/blog/write-post");
  };

  const handleEditPost = (postId: string) => {
    toast({
      title: "Edit Post",
      description: `Editing post ${postId}`,
    });
    navigate(`/blog/write-post?edit=${postId}`);
  };

  const handleDeletePost = (postId: string) => {
    setBlogPosts(blogPosts.filter(post => post.id !== postId));
    toast({
      title: "Post Deleted",
      description: "Your post has been deleted successfully",
    });
  };

  const handleViewPost = (postId: string) => {
    toast({
      title: "View Post",
      description: `Viewing post ${postId}`,
    });
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
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
    toast({
      title: "Camera",
      description: "The camera feature is under development.",
    });
  };

  if (!isAuthenticated) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">My Blog Posts</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <Button 
          className="w-full mb-4 bg-wayscanner-blue"
          onClick={handleWriteNewPost}
        >
          <Plus className="mr-2 h-4 w-4" />
          Write New Post
        </Button>

        <div className="space-y-4">
          {blogPosts.length > 0 ? (
            blogPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-4">
                <h3 
                  className="font-bold text-lg mb-2 cursor-pointer hover:text-wayscanner-blue"
                  onClick={() => handleViewPost(post.id)}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="mr-3">{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-500 border-blue-500"
                      onClick={() => handleEditPost(post.id)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-500"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-center">You haven't written any blog posts yet.</p>
              <Button 
                className="mt-4 bg-wayscanner-blue"
                onClick={handleWriteNewPost}
              >
                <Plus className="mr-2 h-4 w-4" />
                Write Your First Post
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default BlogPostsPage;
