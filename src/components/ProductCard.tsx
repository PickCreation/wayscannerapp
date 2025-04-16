
import React, { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveCartItem } from "@/lib/cartService";
import { useAuth } from "@/hooks/use-auth";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  rating,
  reviews,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleClick = () => {
    navigate(`/marketplace/product/${id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsAddingToCart(true);
    
    const cartItem = {
      id: id.toString(),
      title,
      price,
      image,
      quantity: 1
    };
    
    try {
      // First, update localStorage regardless of authentication status
      updateLocalStorageCart(cartItem);
      
      // If user is authenticated, try to save to Firebase as well
      if (isAuthenticated && user) {
        await saveCartItem(user.id, cartItem).catch(error => {
          console.error("Firebase cart update failed, using localStorage only:", error);
          // We already updated localStorage above, so no further action needed
        });
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast({
        title: "Added to Cart",
        description: `${title} added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };

  // Helper function to update localStorage cart
  const updateLocalStorageCart = (item: any) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex((cartItem: any) => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(item);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
            target.onerror = null;
          }}
        />
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center mt-1">
          <Star size={14} className="text-yellow-500 fill-current" />
          <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500 ml-1">({reviews})</span>
        </div>
        <p className="font-bold text-wayscanner-blue mt-2">${price.toFixed(2)}</p>
        
        {/* Add to Cart Button */}
        <Button 
          variant="default" 
          className="w-full mt-2 bg-wayscanner-blue hover:bg-blue-700"
          size="sm"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <ShoppingCart size={14} className="mr-1" />
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
