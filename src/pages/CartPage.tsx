
import React, { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
    setLoading(false);
  }, []);

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart",
    });
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon",
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
    navigate("/scan");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">My Cart</h1>
        <div className="w-10"></div>
      </header>

      {cartItems.length > 0 ? (
        <div>
          <div className="p-4 space-y-4">
            {cartItems.map((item) => (
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
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                    
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

      <BottomNavigation
        activeItem={activeItem}
        onItemClick={handleItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default CartPage;
