import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star, ChevronDown, Filter, Store, MessageCircle, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import ProductCard from "@/components/ProductCard";
import MessageSellerDialog from "@/components/MessageSellerDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
}

interface ShopSalesData {
  messageCount: number;
  salesCount: number;
  reviewCount: number;
}

const StoreFrontPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [shopBanner, setShopBanner] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [shopSalesData, setShopSalesData] = useState<ShopSalesData>({
    messageCount: 0,
    salesCount: 0,
    reviewCount: 0
  });
  
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
    shopPolicy: "All sales are final. Returns accepted within 30 days with receipt."
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Eco-friendly Water Bottle",
      price: "$24.99",
      rating: 4.8,
      reviews: 156,
      image: "/placeholder.svg",
      category: "kitchen"
    },
    {
      id: "2",
      name: "Bamboo Cutlery Set",
      price: "$19.99",
      rating: 4.7,
      reviews: 89,
      image: "/placeholder.svg",
      category: "kitchen"
    },
    {
      id: "3",
      name: "Reusable Grocery Bags (3pk)",
      price: "$15.99",
      rating: 4.5,
      reviews: 220,
      image: "/placeholder.svg",
      category: "decor"
    },
    {
      id: "4",
      name: "Solar-Powered Charger",
      price: "$45.99",
      rating: 4.6,
      reviews: 72,
      image: "/placeholder.svg",
      category: "electronics"
    }
  ]);

  useEffect(() => {
    const savedShopSettings = localStorage.getItem('shopSettings');
    if (savedShopSettings) {
      setShopSettings(JSON.parse(savedShopSettings));
    }
    
    const savedShopLogo = localStorage.getItem('shopLogo');
    if (savedShopLogo) {
      setShopLogo(savedShopLogo);
    }
    
    const savedShopBanner = localStorage.getItem('shopBanner');
    if (savedShopBanner) {
      setShopBanner(savedShopBanner);
    }
    
    if (user && storeId) {
      const followedStores = JSON.parse(localStorage.getItem('followedStores') || '{}');
      const storeFollowers = JSON.parse(localStorage.getItem('storeFollowers') || '{}');
      
      const userFollowedStores = followedStores[user.id] || [];
      setIsFollowing(userFollowedStores.includes(storeId));
      
      const storeFollowerCount = storeFollowers[storeId] || 0;
      setFollowCount(storeFollowerCount);
    }
    
    const salesData = JSON.parse(localStorage.getItem('shopSalesData') || '{}');
    if (salesData && storeId && salesData[shopSettings.shopName]) {
      setShopSalesData(salesData[shopSettings.shopName]);
    }
  }, [storeId, user, shopSettings.shopName]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/marketplace/product/${productId}`);
  };

  const handleCameraClick = () => {
    navigate("/scan");
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    toast({
      title: "Sorting updated",
      description: `Products sorted by ${value}`,
    });
  };

  const handleMessageSeller = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to message sellers",
        variant: "destructive",
      });
      return;
    }
    setMessageDialogOpen(true);
  };

  const handleFollowToggle = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to follow stores",
        variant: "destructive",
      });
      return;
    }

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    
    const followedStores = JSON.parse(localStorage.getItem('followedStores') || '{}');
    const storeFollowers = JSON.parse(localStorage.getItem('storeFollowers') || '{}');
    
    const userFollowedStores = followedStores[user.id] || [];
    
    if (isFollowing) {
      const updatedFollowedStores = userFollowedStores.filter((id: string) => id !== storeId);
      followedStores[user.id] = updatedFollowedStores;
      
      storeFollowers[storeId] = Math.max((storeFollowers[storeId] || 0) - 1, 0);
      setFollowCount(prev => Math.max(prev - 1, 0));
      
      storeFollowers[shopSettings.shopName] = Math.max((storeFollowers[shopSettings.shopName] || 0) - 1, 0);
      
      toast({
        title: "Unfollowed",
        description: `You have unfollowed ${shopSettings.shopName}`,
      });
    } else {
      followedStores[user.id] = [...userFollowedStores, storeId];
      
      storeFollowers[storeId] = (storeFollowers[storeId] || 0) + 1;
      setFollowCount(prev => prev + 1);
      
      storeFollowers[shopSettings.shopName] = (storeFollowers[shopSettings.shopName] || 0) + 1;
      
      toast({
        title: "Following",
        description: `You are now following ${shopSettings.shopName}`,
      });
    }
    
    localStorage.setItem('followedStores', JSON.stringify(followedStores));
    localStorage.setItem('storeFollowers', JSON.stringify(storeFollowers));
    
    updateUserProfileStats(user.id, newIsFollowing);
  };
  
  const updateUserProfileStats = (userId: string, isNewFollow: boolean) => {
    const userStats = JSON.parse(localStorage.getItem('userProfileStats') || '{}');
    
    if (!userStats[userId]) {
      userStats[userId] = {
        followers: 0,
        sales: 0,
        reviews: 0
      };
    }
    
    if (isNewFollow) {
      userStats[userId].followers = (userStats[userId].followers || 0) + 1;
    } else {
      userStats[userId].followers = Math.max((userStats[userId].followers || 0) - 1, 0);
    }
    
    localStorage.setItem('userProfileStats', JSON.stringify(userStats));
  };

  const adaptProductForCard = (product: Product) => ({
    id: parseInt(product.id),
    title: product.name,
    price: parseFloat(product.price.replace('$', '')),
    image: product.image,
    rating: product.rating,
    reviews: product.reviews
  });

  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("Featured");

  const getSortedProducts = (productList: Product[]) => {
    const filtered = productList.filter(p => activeTab === "all" || p.category === activeTab);
    
    switch (sortBy) {
      case "Recent":
        return [...filtered].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      case "Price: Low to High":
        return [...filtered].sort((a, b) => 
          parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
        );
      case "Price: High to Low":
        return [...filtered].sort((a, b) => 
          parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
        );
      default:
        return filtered;
    }
  };

  const sortedProducts = getSortedProducts(products);
  
  const totalReviews = products.reduce((total, product) => total + product.reviews, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-semibold">Store Page</h1>
          <button className="p-2">
            <ShoppingBag size={22} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          className="h-32 bg-cover bg-center" 
          style={{ 
            backgroundImage: shopBanner ? `url(${shopBanner})` : 'linear-gradient(to right, #4f46e5, #3b82f6)' 
          }}
        ></div>
        
        <div className="absolute -bottom-12 left-4 border-4 border-white rounded-full bg-white">
          <Avatar className="w-24 h-24">
            {shopLogo ? (
              <AvatarImage src={shopLogo} alt="Shop Logo" />
            ) : (
              <AvatarFallback className="bg-gray-200">
                <Store size={40} className="text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      <div className="mt-14 px-4">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{shopSettings.shopName}</h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                  4.8
                </span>
                <span className="mx-2">•</span>
                <span>{products.length} Products</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {followCount} Followers
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>{shopSalesData.salesCount || 0} Sales</span>
                <span className="mx-2">•</span>
                <span>{totalReviews} Reviews</span>
              </div>
            </div>
          </div>
          
          <div className="flex mt-3 gap-2">
            <Button 
              variant={isFollowing ? "default" : "outline"} 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleFollowToggle}
            >
              <UserPlus size={16} />
              {isFollowing ? "Following" : "Follow"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleMessageSeller}
            >
              <MessageCircle size={16} />
              Message Seller
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mt-3 mb-5">
            {shopSettings.shopDescription}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4">
          <TabsList className="w-full flex items-center justify-start bg-transparent h-auto border-b border-gray-200 gap-2 p-0">
            <TabsTrigger 
              value="all" 
              className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue rounded-none data-[state=active]:shadow-none h-10"
            >
              All
            </TabsTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-white">
                <DropdownMenuItem onClick={() => setActiveTab("decor")}>
                  Decor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("kitchen")}>
                  Kitchen Essentials
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("furniture")}>
                  Furniture
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("plants")}>
                  Plants
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("plants-accessories")}>
                  Plant Accessories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("animal-accessories")}>
                  Animal Accessories
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsList>
        </div>

        <div className="flex justify-between px-4 py-3 border-b border-gray-200">
          <button className="flex items-center text-sm text-gray-600">
            <Filter size={16} className="mr-1" />
            Filter
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm text-gray-600">
                Sort By: {sortBy}
                <ChevronDown size={16} className="ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => handleSortChange("Featured")}>
                Featured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("Recent")}>
                Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("Price: Low to High")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("Price: High to Low")}>
                Price: High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <TabsContent value="all" className="px-4 py-4 m-0">
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...adaptProductForCard(product)}
              />
            ))}
          </div>
        </TabsContent>
        
        {["Decor", "Kitchen Essentials", "Furniture", "Plants", "Plants Accessories", "Animal Accessories"].map((category) => (
          <TabsContent key={category} value={category} className="px-4 py-4 m-0">
            <div className="grid grid-cols-2 gap-3">
              {sortedProducts.filter(p => p.category === category).map((product) => (
                <ProductCard
                  key={product.id}
                  {...adaptProductForCard(product)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <MessageSellerDialog 
        open={messageDialogOpen} 
        onOpenChange={setMessageDialogOpen} 
        shopName={shopSettings.shopName} 
      />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default StoreFrontPage;
