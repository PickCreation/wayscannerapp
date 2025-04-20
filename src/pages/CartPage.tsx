
import React, { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { useAuth } from "@/hooks/use-auth";
import LoginDialog from "@/components/LoginDialog";
import { getCartItems, removeCartItem, updateCartItemQuantity } from "@/lib/cartService";
import { CartItem } from "@/lib/cartService";

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated, user } = useAuth();

  console.log("CartPage rendering, loading state:", loading);
  console.log("Authentication state:", { isAuthenticated, userId: user?.id });

  useEffect(() => {
    const loadCartItems = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Loading cart items...");
        let items: CartItem[] = [];
        
        if (isAuthenticated && user) {
          // Get cart items from Firebase
          console.log("Loading cart items from Firebase for user:", user.id);
          items = await getCartItems(user.id);
        } else {
          // Fall back to localStorage
          console.log("Loading cart items from localStorage");
          const localItems = localStorage.getItem('cartItems');
          items = localItems ? JSON.parse(localItems) : [];
        }
        
        console.log("Loaded cart items:", items);
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart items:", error);
        setError("Failed to load cart items. Please refresh the page.");
        toast({
          title: "Error",
          description: "Failed to load cart items. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartItems();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated, user, toast]);

  const handleRemoveItem = async (id: string) => {
    try {
      if (isAuthenticated && user) {
        // Remove from Firebase
        await removeCartItem(user.id, id);
      } else {
        // Remove from localStorage only
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      if (isAuthenticated && user) {
        // Update in Firebase
        await updateCartItemQuantity(user.id, id, newQuantity);
      }
      
      // Update local state
      const updatedCart = cartItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      setCartItems(updatedCart);
      
      // Update localStorage as fallback
      if (!isAuthenticated || !user) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToProduct = (id: string) => {
    navigate(`/marketplace/product/${id}`);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }
    
    navigate("/checkout");
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

  const handleBackClick = () => {
    navigate("/marketplace");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wayscanner-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-wayscanner-blue text-white hover:bg-blue-700"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={handleBackClick}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">My Cart</h1>
        <div className="w-10"></div>
      </header>

      {cartItems.length > 0 ? (
        <div className="pb-16">
          <div className="p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-3">
                  <div 
                    className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                    onClick={() => navigateToProduct(item.id)}
                  >
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 
                        className="font-medium cursor-pointer hover:text-wayscanner-blue"
                        onClick={() => navigateToProduct(item.id)}
                      >
                        {item.title}
                      </h3>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      <p className="font-semibold text-wayscanner-blue">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg" style={{ bottom: '64px' }}>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-wayscanner-blue">${calculateSubtotal()}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-wayscanner-blue text-white hover:bg-blue-700" 
              onClick={handleCheckout}
            >
              <ShoppingBag className="mr-2" size={18} />
              Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh] p-4">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center mb-6">Browse the marketplace and add items to your cart</p>
          <Button 
            className="bg-wayscanner-blue text-white hover:bg-blue-700"
            onClick={() => navigate('/marketplace')}
          >
            Go to Marketplace
          </Button>
        </div>
      )}

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <BottomNavigation
        activeItem={activeItem}
        onItemClick={handleItemClick}
        onCameraClick={handleCameraClick}
      />
      
      <CameraSheet open={cameraSheetOpen} onOpenChange={setCameraSheetOpen} />
    </div>
  );
};

export default CartPage;
