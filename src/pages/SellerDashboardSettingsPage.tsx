
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, CreditCard, Link, MapPin, Camera, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const SellerDashboardSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("shop");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [shopBanner, setShopBanner] = useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  
  const [shopSettings, setShopSettings] = useState({
    shopName: "My Eco Shop",
    shopDescription: "Selling eco-friendly products for a sustainable lifestyle.",
    shopEmail: "",
    shopPhone: "",
    shopAddress: "",
    shopCity: "",
    shopState: "",
    shopZip: "",
    shopCountry: "",
    shopWebsite: "",
    shopPolicy: "All sales are final. Returns accepted within 30 days with receipt.",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolder: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access seller settings",
      });
      navigate("/profile");
    }

    // Set email from user
    if (user?.email) {
      setShopSettings(prev => ({
        ...prev,
        shopEmail: user.email
      }));
    }

    // Load shop logo from localStorage
    const savedShopLogo = localStorage.getItem('shopLogo');
    if (savedShopLogo) {
      setShopLogo(savedShopLogo);
    }

    // Load shop banner from localStorage
    const savedShopBanner = localStorage.getItem('shopBanner');
    if (savedShopBanner) {
      setShopBanner(savedShopBanner);
    }

    // Load shop settings from localStorage
    const savedShopSettings = localStorage.getItem('shopSettings');
    if (savedShopSettings) {
      setShopSettings(JSON.parse(savedShopSettings));
    }
  }, [isAuthenticated, navigate, toast, user]);

  const handleBackClick = () => {
    navigate("/seller-dashboard");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleShopLogoChange = () => {
    if (logoInputRef.current) {
      logoInputRef.current.click();
    }
  };

  const handleShopBannerChange = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setShopLogo(base64String);
        localStorage.setItem('shopLogo', base64String);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Shop Logo Updated",
        description: "Your shop logo has been changed successfully.",
      });
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setShopBanner(base64String);
        localStorage.setItem('shopBanner', base64String);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Shop Banner Updated",
        description: "Your shop banner has been changed successfully.",
      });
    }
  };

  const handleSaveSettings = () => {
    // Save shop settings to localStorage
    localStorage.setItem('shopSettings', JSON.stringify(shopSettings));
    
    toast({
      title: "Settings Saved",
      description: "Your shop settings have been saved successfully.",
    });
  };

  const handleViewStore = () => {
    navigate(`/store/${user?.id || 'default'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Shop Settings</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-white border-white hover:bg-white/20"
            onClick={handleViewStore}
          >
            View Store
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="policy">Policies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shop" className="mt-4">
            <Card className="mb-4">
              <CardContent className="p-4 pt-6">
                <div className="relative mb-6">
                  <div 
                    className="h-32 bg-cover bg-center rounded-lg relative overflow-hidden" 
                    style={{ 
                      backgroundImage: shopBanner ? `url(${shopBanner})` : 'linear-gradient(to right, #4f46e5, #3b82f6)' 
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!shopBanner && (
                        <span className="text-white text-center">
                          <ImageIcon size={30} className="mx-auto mb-1" />
                          <p className="text-sm">Shop Banner</p>
                        </span>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-2"
                      onClick={handleShopBannerChange}
                    >
                      <Camera size={18} />
                    </button>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={bannerInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBannerFileChange}
                  />
                </div>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-4 border-white">
                      {shopLogo ? (
                        <AvatarImage src={shopLogo} alt="Shop Logo" />
                      ) : (
                        <AvatarFallback className="bg-gray-200 text-gray-400">
                          <Store size={40} />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 bg-wayscanner-blue text-white rounded-full p-2"
                      onClick={handleShopLogoChange}
                    >
                      <Camera size={18} />
                    </button>
                    
                    <input 
                      type="file" 
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Tap to change shop logo</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      name="shopName"
                      value={shopSettings.shopName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shopDescription">Shop Description</Label>
                    <textarea
                      id="shopDescription"
                      name="shopDescription"
                      value={shopSettings.shopDescription}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md mt-1 min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shopEmail">Email</Label>
                    <Input
                      id="shopEmail"
                      name="shopEmail"
                      type="email"
                      value={shopSettings.shopEmail}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shopPhone">Phone</Label>
                    <Input
                      id="shopPhone"
                      name="shopPhone"
                      value={shopSettings.shopPhone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shopWebsite">Website (Optional)</Label>
                    <div className="flex mt-1">
                      <div className="bg-gray-100 border border-gray-300 rounded-l-md px-3 flex items-center">
                        <Link size={16} className="text-gray-500" />
                      </div>
                      <Input
                        id="shopWebsite"
                        name="shopWebsite"
                        value={shopSettings.shopWebsite}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mt-6">Shop Address</h3>
                  
                  <div>
                    <Label htmlFor="shopAddress">Address</Label>
                    <Input
                      id="shopAddress"
                      name="shopAddress"
                      value={shopSettings.shopAddress}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="shopCity">City</Label>
                      <Input
                        id="shopCity"
                        name="shopCity"
                        value={shopSettings.shopCity}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shopState">State</Label>
                      <Input
                        id="shopState"
                        name="shopState"
                        value={shopSettings.shopState}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="shopZip">ZIP Code</Label>
                      <Input
                        id="shopZip"
                        name="shopZip"
                        value={shopSettings.shopZip}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shopCountry">Country</Label>
                      <Input
                        id="shopCountry"
                        name="shopCountry"
                        value={shopSettings.shopCountry}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full bg-wayscanner-blue"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </TabsContent>
          
          <TabsContent value="payment" className="mt-4">
            <Card>
              <CardContent className="p-4 pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <CreditCard size={30} className="text-wayscanner-blue" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={shopSettings.bankName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input
                      id="accountHolder"
                      name="accountHolder"
                      value={shopSettings.accountHolder}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={shopSettings.accountNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                      type="password"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      name="routingNumber"
                      value={shopSettings.routingNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Your payment information is securely stored and only used for depositing your earnings.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full mt-4 bg-wayscanner-blue"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </TabsContent>
          
          <TabsContent value="policy" className="mt-4">
            <Card>
              <CardContent className="p-4 pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shopPolicy">Shop Policies</Label>
                    <textarea
                      id="shopPolicy"
                      name="shopPolicy"
                      value={shopSettings.shopPolicy}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md mt-1 min-h-[200px]"
                      placeholder="Enter your shop policies, return policy, shipping information, etc."
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Clear policies help build trust with your customers. Make sure to cover returns, 
                    shipping times, and any other important information.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full mt-4 bg-wayscanner-blue"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboardSettingsPage;
