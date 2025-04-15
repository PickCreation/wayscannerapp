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
import { useToast } from "@/hooks/use-toast";
import { getAllProducts, Product } from "@/lib/marketplaceService";
import { seedMarketplace, seedLocalStorage } from '@/utils/marketplaceSeed';

const categories = [
  { id: "all", name: "All", color: "#2196F3", bgColor: "#E3F2FD", icon: "📦" },
  { id: "decor", name: "Decor", color: "#FF9800", bgColor: "#FFF3E0", icon: "🏠" },
  { id: "animal-accessories", name: "Animal Accessories", color: "#4CAF50", bgColor: "#E8F5E9", icon: "🐾" },
  { id: "plants", name: "Plants", color: "#9C27B0", bgColor: "#F3E5F5", icon: "🌿" },
  { id: "plants-accessories", name: "Plants Accessories", color: "#E91E63", bgColor: "#FCE4EC", icon: "🪴" },
  { id: "kitchen-essentials", name: "Kitchen Essentials", color: "#3F51B5", bgColor: "#E8EAF6", icon: "🍽️" },
  { id: "furniture", name: "Furniture", color: "#9b87f5", bgColor: "#E5DEFF", icon: "🪑" },
];

const MarketplacePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const savedProducts = localStorage.getItem('products');
        
        if (!savedProducts || JSON.parse(savedProducts).length === 0) {
          try {
            await seedMarketplace();
          } catch (firebaseError) {
            console.error("Firebase seeding failed, using local fallback:", firebaseError);
            seedLocalStorage();
          }
        }

        try {
          const fetchedProducts = await getAllProducts();
          if (fetchedProducts && fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
          } else {
            const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
            if (localProducts.length > 0) {
              setProducts(localProducts);
            } else {
              const seededProducts = seedLocalStorage();
              setProducts(seededProducts);
            }
          }
        } catch (fetchError) {
          console.error("Error fetching products from Firebase:", fetchError);
          const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
          if (localProducts.length > 0) {
            setProducts(localProducts);
          } else {
            const seededProducts = seedLocalStorage();
            setProducts(seededProducts);
          }
        }
      } catch (error) {
        console.error("Fatal error fetching products:", error);
        const seededProducts = seedLocalStorage();
        setProducts(seededProducts);
        toast({
          title: "Using local data",
          description: "Connected to local storage instead of Firebase.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

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
    const matchesCategory = activeCategory === "all" || 
                           product.category.toLowerCase() === activeCategory.replace("-", " ");
    
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!appliedFilters) {
      return matchesCategory && matchesSearch;
    }
    
    const matchesPrice = product.price >= appliedFilters.priceRange[0] && 
                         product.price <= (appliedFilters.priceRange[1] === 100 ? Number.MAX_SAFE_INTEGER : appliedFilters.priceRange[1]);
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!appliedFilters || appliedFilters.sortBy === "Relevance") {
      return 0;
    }
    
    switch (appliedFilters.sortBy) {
      case "Recent":
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Most Reviews":
        return (b.reviews || 0) - (a.reviews || 0);
      case "Highest Rated":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="pb-20 bg-white min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10" style={{ backgroundColor: "#034AFF" }}>
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

      <div className="px-4 py-4 bg-gray-50 pt-20">
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
          <div className="flex space-x-4 overflow-x-auto py-2 no-scrollbar pl-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center cursor-pointer transition-transform duration-200 ${activeCategory === category.id ? 'scale-105' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${activeCategory === category.id ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`} 
                  style={{ backgroundColor: category.bgColor }}
                >
                  <span className="text-lg" style={{ color: category.color }}>{category.icon}</span>
                </div>
                <span className={`text-sm ${activeCategory === category.id ? 'font-bold text-blue-500' : 'text-gray-700'}`}>
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
        
        {appliedFilters && (
          <div className="mb-4 flex items-center overflow-x-auto no-scrollbar">
            <span className="text-sm text-gray-500 mr-2 whitespace-nowrap">Filters:</span>
            {appliedFilters.sortBy !== "Relevance" && (
              <Badge variant="outline" className="mr-2 bg-gray-100 whitespace-nowrap">
                {appliedFilters.sortBy}
              </Badge>
            )}
            {appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 100 && (
              <Badge variant="outline" className="mr-2 bg-gray-100 whitespace-nowrap">
                ${appliedFilters.priceRange[0]}-${appliedFilters.priceRange[1] === 100 ? '100+' : appliedFilters.priceRange[1]}
              </Badge>
            )}
            {appliedFilters.condition !== "Any" && (
              <Badge variant="outline" className="mr-2 bg-gray-100 whitespace-nowrap">
                {appliedFilters.condition}
              </Badge>
            )}
            {appliedFilters.inStock && (
              <Badge variant="outline" className="mr-2 bg-gray-100 whitespace-nowrap">
                In Stock
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-blue-500 h-7 px-2 whitespace-nowrap"
              onClick={() => setAppliedFilters(null)}
            >
              Clear All
            </Button>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white">
                <div className="h-40 bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                id={parseInt(product.id) || Math.floor(Math.random() * 1000)}
                title={product.title}
                price={product.price}
                image={product.image || "/placeholder.svg"}
                rating={product.rating || 0}
                reviews={product.reviews || 0}
              />
            ))}
          </div>
        )}
        
        {!isLoading && sortedProducts.length === 0 && (
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
