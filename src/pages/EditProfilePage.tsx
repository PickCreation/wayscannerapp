
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, UserCircle, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { useAuth } from "@/hooks/use-auth";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const { user, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || "John Doe",
    email: user?.email || "johndoe@example.com",
    phone: user?.phone || "+1 555-123-4567",
    bio: user?.bio || "Nature enthusiast and eco-friendly lifestyle advocate.",
  });
  
  const [profileImage, setProfileImage] = useState<string>(user?.avatar || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserProfile({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      avatar: profileImage
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    navigate("/profile");
  };

  const handleProfilePhotoChange = () => {
    // Directly open the camera sheet which will immediately trigger the file picker
    setShowCameraSheet(true);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
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
    setShowCameraSheet(true);
  };
  
  useEffect(() => {
    const handleImageCapture = (event: CustomEvent) => {
      const capturedImage = event.detail.imageUrl;
      if (capturedImage) {
        setProfileImage(capturedImage);
      }
    };
    
    window.addEventListener('imageCaptured', handleImageCapture as EventListener);
    
    return () => {
      window.removeEventListener('imageCaptured', handleImageCapture as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Edit Profile</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              {profileImage ? (
                <AvatarImage src={profileImage} />
              ) : (
                <AvatarFallback className="bg-gray-200 text-gray-400">
                  <UserCircle size={60} />
                </AvatarFallback>
              )}
            </Avatar>
            <button 
              type="button"
              className="absolute bottom-0 right-0 bg-wayscanner-blue text-white rounded-full p-2"
              onClick={handleProfilePhotoChange}
            >
              <Camera size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-500">Tap to change profile photo</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write something about yourself"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-wayscanner-blue hover:bg-blue-700 mt-6"
          >
            Save Changes
          </Button>
        </div>
      </form>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default EditProfilePage;
