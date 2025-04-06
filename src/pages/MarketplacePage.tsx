
import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { Badge } from "@/components/ui/badge";
import FilterBottomSheet, { FilterOptions } from "@/components/FilterBottomSheet";

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
  { id: "all", name: "All", color: "#2196F3", bgColor: "#E3F2FD", icon: "📦" },
  { id: "decor", name: "Decor", color: "#FF9800", bgColor: "#FFF3E0", icon: "🏠" },
  { id: "animal-accessories", name: "Animal Accessories", color: "#4CAF50", bgColor: "#E8F5E9", icon: "🐾" },
  { id: "plants", name: "Plants", color: "#9C27B0", bgColor: "#F3E5F5", icon: "🌿" },
  { id: "plants-accessories", name: "Plants Accessories", color: "#E91E63", bgColor: "#FCE4EC", icon: "🪴" },
  { id: "kitchen-essentials", name: "Kitchen Essentials", color: "#3F51B5", bgColor: "#E8EAF6", icon: "🍽️" },
];

const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

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

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleFilterClick = () => {
    setShowFilterSheet(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    console.log("Applied filters:", filters);
  };

  const filteredProducts = products.filter(product => {
    // Filter by category
    const matchesCategory = activeCategory === "all" || 
                           product.category.toLowerCase() === activeCategory.replace("-", " ");
    
    // Filter by search term
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If no additional filters applied, just use category and search
    if (!appliedFilters) {
      return matchesCategory && matchesSearch;
    }
    
    // Filter by price range
    const matchesPrice = product.price >= appliedFilters.priceRange[0] && 
                         product.price <= (appliedFilters.priceRange[1] === 100 ? Number.MAX_SAFE_INTEGER : appliedFilters.priceRange[1]);
    
    // Basic filtering - in a real app, these would be proper properties of the product
    // Currently just using these as example filters
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products based on applied filters
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!appliedFilters || appliedFilters.sortBy === "Relevance") {
      return 0;
    }
    
    switch (appliedFilters.sortBy) {
      case "Recent":
        // In a real app, we'd use a timestamp property
        return b.id - a.id;
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Most Reviews":
        return b.reviews - a.reviews;
      case "Highest Rated":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Marketplace</h1>
        <button className="p-2 relative" onClick={() => navigate('/cart')}>
          <ShoppingCart size={24} className="text-white" fill="white" />
          {cartCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
              {cartCount}
            </Badge>
          )}
        </button>
      </header>

      <div className="px-4 py-4 bg-gray-50">
        <div className="relative mb-4">
          <Input
            placeholder="Search products..."
            className="pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:border-wayscanner-blue focus:ring-1 focus:ring-wayscanner-blue shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <button 
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleFilterClick}
          >
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="mt-4">
          <h2 className="text-base font-bold mb-3 text-gray-800 text-[16px]">Categories</h2>
          <div className="flex space-x-3 overflow-x-auto py-2 px-2 no-scrollbar">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center cursor-pointer transition-transform duration-200 ${activeCategory === category.id ? 'scale-105' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${activeCategory === category.id ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} 
                  style={{ backgroundColor: category.bgColor }}
                >
                  <span className="text-lg" style={{ color: category.color }}>{category.icon}</span>
                </div>
                <span className={`text-xs ${activeCategory === category.id ? 'font-bold text-blue-500' : 'text-gray-700'}`}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === "all" ? "All Products" : 
            categories.find(cat => cat.id === activeCategory)?.name || "Products"}
        </h2>
        
        {/* Applied Filters Section (if any) */}
        {appliedFilters && (
          <div className="mb-4 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Filters:</span>
            {appliedFilters.sortBy !== "Relevance" && (
              <Badge variant="outline" className="mr-2 bg-gray-100">
                {appliedFilters.sortBy}
              </Badge>
            )}
            {appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 100 && (
              <Badge variant="outline" className="mr-2 bg-gray-100">
                ${appliedFilters.priceRange[0]}-${appliedFilters.priceRange[1] === 100 ? '100+' : appliedFilters.priceRange[1]}
              </Badge>
            )}
            {appliedFilters.condition !== "Any" && (
              <Badge variant="outline" className="mr-2 bg-gray-100">
                {appliedFilters.condition}
              </Badge>
            )}
            {appliedFilters.inStock && (
              <Badge variant="outline" className="mr-2 bg-gray-100">
                In Stock
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-blue-500 h-7 px-2"
              onClick={() => setAppliedFilters(null)}
            >
              Clear All
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {sortedProducts.map(product => (
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
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
      
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
      
      <FilterBottomSheet 
        open={showFilterSheet} 
        onOpenChange={setShowFilterSheet}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default MarketplacePage;
