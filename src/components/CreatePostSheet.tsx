
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Image } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostSheet: React.FC<CreatePostSheetProps> = ({ open, onOpenChange }) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something in your post",
        variant: "destructive",
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the post to an API
    
    toast({
      title: "Post Created",
      description: "Your post has been published successfully",
    });
    
    // Reset form
    setContent("");
    setCategory("");
    setImage(null);
    setImagePreview(null);
    
    // Close the sheet
    onOpenChange(false);
  };
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-center text-[16px]">Create Post</DrawerTitle>
          <DrawerDescription className="sr-only">Create a new forum post</DrawerDescription>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>
        
        <div className="mt-4">
          {/* User info */}
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Your Name</h3>
              <span className="text-sm text-gray-500">Posting publicly</span>
            </div>
          </div>
          
          {/* Category selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plants">Plants</SelectItem>
                <SelectItem value="Gardening">Gardening</SelectItem>
                <SelectItem value="Nature">Nature</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Animals">Animals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Post content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What's on your mind?
            </label>
            <Textarea
              placeholder="Write your post here..."
              className="min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          {/* Image upload */}
          {imagePreview ? (
            <div className="relative mb-4 border rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full h-auto" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add an Image
              </label>
              <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-[120px]">
                <div className="text-center">
                  <Image className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Click to upload image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
          
          {/* Submit button */}
          <Button
            className="w-full bg-wayscanner-blue hover:bg-blue-700 py-6 text-[16px] font-medium"
            onClick={handleSubmit}
            type="button"
          >
            Post
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreatePostSheet;
