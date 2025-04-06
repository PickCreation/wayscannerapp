
import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleClick = () => {
    navigate(`/marketplace/product/${id}`);
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
      </div>
    </div>
  );
};

export default ProductCard;
