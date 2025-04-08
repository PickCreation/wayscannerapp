
import React, { useState, useEffect } from "react";
import { ArrowLeft, Image, Save, FileQuestion } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const WritePostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    coverImage: null as string | null,
    category: "gardening"
  });

  useEffect(() => {
    // Check if we're editing an existing post
    const queryParams = new URLSearchParams(location.search);
    const editPostId = queryParams.get('edit');
    
    if (editPostId) {
      setIsEditing(true);
      // In a real app, you would fetch the post data
      // For now, we'll use dummy data
      setPostData({
        title: "My Journey With Sustainable Gardening",
        content: "How I transformed my garden into a sustainable ecosystem that supports local wildlife and reduces water consumption. The journey began three years ago when I realized the impact of traditional gardening on our environment...",
        coverImage: "https://images.unsplash.com/photo-1466692476655-ab0c26c69cbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "gardening"
      });
    }
  }, [location]);

  const handleBackClick = () => {
    navigate("/blog/my-posts");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    // For now, we'll just set a placeholder image
    setPostData(prev => ({
      ...prev,
      coverImage: "https://images.unsplash.com/photo-1466692476655-ab0c26c69cbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    }));
    
    toast({
      title: "Image Uploaded",
      description: "Cover image has been added to your post",
    });
  };

  const handleSavePost = () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: isEditing ? "Post Updated" : "Post Published",
      description: isEditing 
        ? "Your post has been updated successfully" 
        : "Your post has been published successfully",
    });
    
    navigate("/blog/my-posts");
  };

  const handleRemoveImage = () => {
    setPostData(prev => ({
      ...prev,
      coverImage: null
    }));
  };

  if (!isAuthenticated) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">
            {isEditing ? "Edit Post" : "Write New Post"}
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-wayscanner-blue"
            onClick={handleSavePost}
          >
            <Save className="h-4 w-4 mr-1" />
            {isEditing ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="mb-4">
            <Label htmlFor="title">Post Title</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Enter a captivating title..." 
              value={postData.title}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={postData.category}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="gardening">Gardening</option>
              <option value="sustainability">Sustainability</option>
              <option value="food">Food & Nutrition</option>
              <option value="diy">DIY & Crafts</option>
              <option value="pets">Pets & Animals</option>
              <option value="travel">Travel</option>
            </select>
          </div>
          
          {postData.coverImage ? (
            <div className="mb-4 relative">
              <img 
                src={postData.coverImage} 
                alt="Cover" 
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="w-full h-24 border-dashed flex flex-col items-center justify-center"
                onClick={handleImageUpload}
              >
                <Image className="h-8 w-8 mb-2 text-gray-400" />
                <span>Add Cover Image</span>
              </Button>
            </div>
          )}
          
          <div className="mb-4">
            <Label htmlFor="content">Post Content</Label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="Write your post content here..." 
              value={postData.content}
              onChange={handleInputChange}
              className="mt-1 min-h-[200px]"
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start">
            <FileQuestion className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Writing Tips:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Use a clear and engaging title</li>
                <li>Add relevant images to make your post visually appealing</li>
                <li>Break your content into sections for better readability</li>
                <li>Check your spelling and grammar before publishing</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mb-10">
          <Button 
            variant="outline" 
            onClick={handleBackClick}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSavePost}
            className="bg-wayscanner-blue"
          >
            <Save className="h-4 w-4 mr-1" />
            {isEditing ? "Update Post" : "Publish Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WritePostPage;
