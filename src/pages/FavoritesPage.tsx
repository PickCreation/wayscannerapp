
import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart, ShoppingCart, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(items);
    setLoading(false);
  }, []);

  const handleRemoveFromFavorites = (id: number) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    toast({
      title: "Removed from Favorites",
      description: "The item has been removed from your favorites",
    });
  };

  const handleAddToCart = (product: any) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    toast({
      title: "Added to Cart",
      description: `${product.title} added to your cart`,
    });
  };

  const handleItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveItem(item);
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

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">My Favorites</h1>
        <button className="p-2" onClick={() => navigate('/cart')}>
          <ShoppingCart size={24} color="white" fill="white" />
        </button>
      </header>

      {favorites.length > 0 ? (
        <div className="p-4 grid grid-cols-1 gap-4">
          {favorites.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <button 
                      onClick={() => handleRemoveFromFavorites(item.id)}
                      className="text-red-500"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-1">Category: {item.category}</p>
                  <p className="font-semibold text-wayscanner-blue">${item.price.toFixed(2)}</p>
                  
                  <div className="flex mt-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/marketplace/product/${item.id}`)}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-wayscanner-blue text-white hover:bg-blue-700 text-xs"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh] p-4">
          <Heart size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-500 text-center mb-6">Browse the marketplace and heart items you like</p>
          <Button 
            className="bg-wayscanner-blue text-white hover:bg-blue-700"
            onClick={() => navigate('/marketplace')}
          >
            Go to Marketplace
          </Button>
        </div>
      )}

      <BottomNavigation
        activeItem={activeItem}
        onItemClick={handleItemClick}
        onCameraClick={handleCameraClick}
      />
      
      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
    </div>
  );
};

export default FavoritesPage;
