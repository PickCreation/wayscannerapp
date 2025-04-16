
import React from "react";
import { Clock, LightbulbIcon, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Recipe {
  id: string;
  title: string;
  time: string;
  rating: number;
  reviews?: number;
  image: string;
  author?: string;
  difficulty?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  showBookmarkButton?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick,
  showBookmarkButton = true 
}) => {
  // Determine rating label based on rating value
  const getRatingLabel = (rating: number): string => {
    if (rating > 4) return "Delicious";
    if (rating > 3) return "Tasty";
    if (rating > 2) return "Just Okay";
    return "Not Great";
  };

  // Determine difficulty label color
  const getDifficultyColor = (difficulty?: string): string => {
    if (!difficulty) return "";
    
    switch(difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow mb-2" onClick={onClick}>
      <div className="flex h-28">
        <div className="w-1/3">
          <img 
            src={recipe.image || "https://via.placeholder.com/800x600?text=No+Image"} 
            alt={recipe.title} 
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="w-2/3 p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg line-clamp-1 text-gray-800">{recipe.title}</h3>
            {recipe.difficulty && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>
          
          {recipe.author && (
            <div className="text-xs text-gray-500 mb-1">By: {recipe.author}</div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center">
              <LightbulbIcon size={16} className="mr-1 text-yellow-500" />
              <span>{getRatingLabel(recipe.rating)}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
