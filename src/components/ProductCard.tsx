
import React, { useState, useEffect } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  const handleClick = () => {
    navigate(`/marketplace/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsAddingToCart(true);
    
    // Get current cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === id);
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        id,
        title,
        price,
        image,
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    toast({
      title: "Added to Cart",
      description: `${title} added to your cart`,
    });
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
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
        />
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center mt-1">
          <Star size={14} className="text-yellow-500 fill-current" />
          <span className="text-xs text-gray-600 ml-1">{rating}</span>
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
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
