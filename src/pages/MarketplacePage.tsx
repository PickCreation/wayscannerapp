import React, { useState } from "react";
import { ChevronLeft, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

const products = [
  {
    id: 1,
    title: "Modern Plant Pot",
    price: 29.99,
    category: "Plants Accessories",
    image: "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    rating: 4.5,
    reviews: 124,
  },
  {
    id: 2,
    title: "Ceramic Dog Bowl",
    price: 19.99,
    category: "Animal Accessories",
    image: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
    rating: 4.2,
    reviews: 89,
  },
  {
    id: 3,
    title: "Monstera Plant",
    price: 34.99,
    category: "Plants",
    image: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    rating: 4.8,
    reviews: 215,
  },
  {
    id: 4,
    title: "Bamboo Cutting Board",
    price: 24.99,
    category: "Kitchen Essentials",
    image: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 5,
    title: "Macrame Wall Hanging",
    price: 39.99,
    category: "Decor",
    image: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 6,
    title: "Cat Climbing Tree",
    price: 89.99,
    category: "Animal Accessories",
    image: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
    rating: 4.3,
    reviews: 92,
  },
];

const categories = [
  "All",
  "Decor",
  "Animal Accessories",
  "Plants",
  "Plants Accessories",
  "Kitchen Essentials",
];

const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const navigate = useNavigate();

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">Marketplace</h1>
        <button className="p-2">
          <ShoppingCart size={24} color="white" />
        </button>
      </header>

      {/* Search and Categories */}
      <div className="px-4 py-4 bg-wayscanner-blue bg-opacity-10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-white rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 overflow-x-auto no-scrollbar">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="bg-transparent h-auto p-0 w-max">
              {categories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === category
                      ? "bg-wayscanner-blue text-white"
                      : "bg-white text-gray-600"
                  } mr-2 whitespace-nowrap`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === "All" ? "All Products" : activeCategory}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              rating={product.rating}
              reviews={product.reviews}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
      
      {/* Camera Options Sheet */}
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
    </div>
  );
};

export default MarketplacePage;
