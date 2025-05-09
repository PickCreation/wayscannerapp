import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, UserCircle, Mail } from "lucide-react";
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
  const { user, updateProfileImage } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email
      }));
    }
    
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      const parsedData = JSON.parse(savedProfileData);
      setFormData(prev => ({
        ...prev,
        fullName: user?.name || parsedData.fullName,
        email: user?.email || parsedData.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      const profileData = {
        ...formData,
        fullName: user.name,
        email: user.email,
      };
      
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } else {
      localStorage.setItem('profileData', JSON.stringify(formData));
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    navigate("/profile");
  };

  const handleProfilePhotoChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
        updateProfileImage(base64String);
        
        toast({
          title: "Profile Photo Updated",
          description: "Your profile photo has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
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
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
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
              disabled={user?.isAdmin}
            />
            {user?.isAdmin && (
              <p className="text-xs text-gray-500 mt-1">Admin name cannot be changed</p>
            )}
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
              disabled={user?.isAdmin}
            />
            {user?.isAdmin && (
              <p className="text-xs text-gray-500 mt-1">Admin email cannot be changed</p>
            )}
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
