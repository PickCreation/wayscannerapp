
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star, ChevronDown, Filter, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
}

const StoreFrontPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [shopBanner, setShopBanner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  
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
    // Load shop settings from localStorage
    const savedShopSettings = localStorage.getItem('shopSettings');
    if (savedShopSettings) {
      setShopSettings(JSON.parse(savedShopSettings));
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
  }, [storeId]);

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

  // Helper function to convert product item for the ProductCard component
  const adaptProductForCard = (product: Product) => ({
    id: parseInt(product.id),
    title: product.name,
    price: parseFloat(product.price.replace('$', '')),
    image: product.image,
    rating: product.rating,
    reviews: product.reviews
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top navigation bar */}
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

      {/* Store banner and info */}
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
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-1">Follow</Button>
        </div>
        
        <p className="text-sm text-gray-600 mt-3 mb-5">
          {shopSettings.shopDescription}
        </p>
      </div>

      {/* Product categories tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4">
          <TabsList className="w-full grid grid-cols-4 bg-transparent h-auto border-b border-gray-200 gap-2 p-0">
            <TabsTrigger value="all" className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue rounded-none data-[state=active]:shadow-none h-10">
              All
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue rounded-none data-[state=active]:shadow-none h-10">
              Kitchen
            </TabsTrigger>
            <TabsTrigger value="decor" className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue rounded-none data-[state=active]:shadow-none h-10">
              Decor
            </TabsTrigger>
            <TabsTrigger value="electronics" className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue rounded-none data-[state=active]:shadow-none h-10">
              Electronics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filter and sort bar */}
        <div className="flex justify-between px-4 py-3 border-b border-gray-200">
          <button className="flex items-center text-sm text-gray-600">
            <Filter size={16} className="mr-1" />
            Filter
          </button>
          <button className="flex items-center text-sm text-gray-600">
            Sort By: Featured
            <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
        
        <TabsContent value="all" className="px-4 py-4 m-0">
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...adaptProductForCard(product)}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="kitchen" className="px-4 py-4 m-0">
          <div className="grid grid-cols-2 gap-3">
            {products.filter(p => p.category === "kitchen").map((product) => (
              <ProductCard
                key={product.id}
                {...adaptProductForCard(product)}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="decor" className="px-4 py-4 m-0">
          <div className="grid grid-cols-2 gap-3">
            {products.filter(p => p.category === "decor").map((product) => (
              <ProductCard
                key={product.id}
                {...adaptProductForCard(product)}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="electronics" className="px-4 py-4 m-0">
          <div className="grid grid-cols-2 gap-3">
            {products.filter(p => p.category === "electronics").map((product) => (
              <ProductCard
                key={product.id}
                {...adaptProductForCard(product)}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default StoreFrontPage;
