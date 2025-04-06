
import React from "react";
import { Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Recipe {
  id: string;
  title: string;
  time: string;
  rating: number;
  reviews: number;
  image: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <Card className="overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow mb-2" onClick={onClick}>
      <div className="flex h-28">
        <div className="w-1/3">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="w-2/3 p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-1 text-gray-800">{recipe.title}</h3>
          <div className="flex items-center text-xs text-gray-600">
            <Clock size={14} className="mr-1" />
            <span className="mr-3">{recipe.time}</span>
            <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
            <span>{recipe.rating} <span className="text-xs">({recipe.reviews})</span></span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
