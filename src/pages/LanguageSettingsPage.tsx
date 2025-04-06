
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

interface Language {
  id: string;
  name: string;
  code: string;
  nativeName: string;
}

const languages: Language[] = [
  {
    id: "en",
    name: "English",
    code: "en",
    nativeName: "English"
  },
  {
    id: "es",
    name: "Spanish",
    code: "es",
    nativeName: "Español"
  },
  {
    id: "fr",
    name: "French",
    code: "fr",
    nativeName: "Français"
  },
  {
    id: "pt",
    name: "Portuguese",
    code: "pt",
    nativeName: "Português"
  }
];

const LanguageSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleSave = () => {
    const language = languages.find(lang => lang.id === selectedLanguage);
    
    toast({
      title: "Language Changed",
      description: `App language has been set to ${language?.name}.`,
    });
    
    navigate("/profile");
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
          <h1 className="text-base font-bold">Language Settings</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-6 flex items-center">
          <div className="bg-blue-50 p-3 rounded-full mr-3">
            <Globe className="h-6 w-6 text-wayscanner-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Select Language</h2>
            <p className="text-gray-500 text-sm">Choose your preferred language</p>
          </div>
        </div>

        <RadioGroup 
          value={selectedLanguage}
          onValueChange={handleLanguageChange}
          className="space-y-3"
        >
          {languages.map((language) => (
            <div 
              key={language.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div className="flex items-center">
                <RadioGroupItem value={language.id} id={language.id} className="mr-3" />
                <Label htmlFor={language.id} className="flex flex-col cursor-pointer">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-sm text-gray-500">{language.nativeName}</span>
                </Label>
              </div>
              {selectedLanguage === language.id && (
                <Check className="h-5 w-5 text-wayscanner-blue" />
              )}
            </div>
          ))}
        </RadioGroup>

        <p className="text-gray-500 text-sm mt-4 mb-6">
          Changing the language will translate the app interface into your selected language.
        </p>

        <Button 
          onClick={handleSave}
          className="w-full bg-wayscanner-blue hover:bg-blue-700"
        >
          Save Language Preference
        </Button>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default LanguageSettingsPage;
