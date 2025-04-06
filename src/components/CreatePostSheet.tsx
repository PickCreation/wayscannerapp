
import React, { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Image, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostSheet = ({ open, onOpenChange }: CreatePostSheetProps) => {
  const [postContent, setPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [postImage, setPostImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmitPost = () => {
    if (!postContent.trim()) {
      toast({
        title: "Empty Post",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new post object
    const newPost = {
      id: `p${Date.now()}`, // Generate a unique ID
      author: {
        name: user?.name || "You",
        avatar: user?.avatar || "/placeholder.svg",
      },
      timeAgo: "Just now",
      category: selectedCategory,
      content: postContent.trim(),
      imageUrl: postImage,
      likes: 0,
      comments: 0,
      bookmarked: false,
      liked: false,
      commentsArray: []
    };
    
    // Create and dispatch a custom event to notify the forum page
    const event = new CustomEvent('addNewPost', { detail: newPost });
    window.dispatchEvent(event);
    
    // Clear the form
    setPostContent("");
    setSelectedCategory("General");
    setPostImage(null);
    
    // Close the sheet
    onOpenChange(false);
    
    toast({
      title: "Post Created",
      description: "Your post has been published successfully.",
    });
  };
  
  // Listen for captured images from CameraSheet
  useEffect(() => {
    const handleImageCapture = (event: CustomEvent) => {
      const capturedImage = event.detail.imageUrl;
      if (capturedImage) {
        setPostImage(capturedImage);
      }
    };
    
    window.addEventListener('imageCaptured', handleImageCapture as EventListener);
    
    return () => {
      window.removeEventListener('imageCaptured', handleImageCapture as EventListener);
    };
  }, []);
  
  // Available categories
  const categories = [
    "General", "Plants", "Gardening", "Nature", "Food", "Healthy Recipes", 
    "Nutrition Tips", "Cooking", "Kitchen", "Animals & Pets", "DIY", 
    "Home", "Decor", "Travel", "Questions", "Product Talk"
  ];
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80%] sm:max-w-full p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>Create Post</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="rounded-full h-8 w-8"
            >
              <X size={18} />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="p-4 flex-1 overflow-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Content
            </label>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px]"
            />
          </div>
          
          {postImage && (
            <div className="mb-4 relative">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={postImage} 
                  alt="Post" 
                  className="w-full h-auto max-h-[200px] object-contain"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => setPostImage(null)}
              >
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              const event = new Event('openCamera');
              window.dispatchEvent(event);
            }}
          >
            <Image size={18} />
            Add Image
          </Button>
          
          <Button 
            className="gap-2 bg-wayscanner-blue"
            onClick={handleSubmitPost}
            disabled={!postContent.trim()}
          >
            <Send size={18} />
            Post
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreatePostSheet;
