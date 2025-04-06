
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface FoodScanTabProps {
  onEditPreferences?: () => void;
  onHowWeScore?: () => void;
}

const FoodScanTab: React.FC<FoodScanTabProps> = ({ onEditPreferences, onHowWeScore }) => {
  const navigate = useNavigate();

  // Sample food scan results 
  const scanResults = [
    {
      id: '1',
      name: 'Whole Wheat Bread',
      brand: "Nature's Own",
      score: 81,
      imageUrl: '/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png',
    },
    {
      id: '2',
      name: 'Doritos Chips',
      brand: 'Frito-Lay',
      score: 74,
      imageUrl: '/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png',
    },
    {
      id: '3',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      score: 50,
      imageUrl: '/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png',
    },
    {
      id: '4',
      name: 'Chocolate Bar',
      brand: 'Hershey\'s',
      score: 23,
      imageUrl: '/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png',
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-500";
    if (score >= 60) return "bg-purple-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };
  
  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return "border-teal-300";
    if (score >= 60) return "border-purple-300";
    if (score >= 40) return "border-orange-300";
    return "border-red-300";
  };

  const getCardBorderColor = (score: number) => {
    if (score >= 80) return "border-teal-200";
    if (score >= 60) return "border-purple-200";
    if (score >= 40) return "border-orange-200";
    return "border-red-200";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Not great";
    return "Bad";
  };

  return (
    <div className="space-y-3">
      {scanResults.map((item) => (
        <div 
          key={item.id} 
          className={`p-3 rounded-xl border shadow-sm bg-white flex items-center justify-between cursor-pointer ${getCardBorderColor(item.score)}`}
          onClick={() => navigate(`/food/${item.id}`)}
        >
          <div className="h-14 w-14 mr-3 flex-shrink-0 rounded-xl overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <p className="text-md text-blue-500">{item.brand}</p>
            <div className={`${getScoreColor(item.score)} text-white px-4 py-1 rounded-full text-md inline-flex items-center mt-2 border-2 ${getScoreBorderColor(item.score)}`}>
              <span className="font-bold mr-1">{item.score}</span>
              <span>{getScoreText(item.score)}</span>
            </div>
          </div>
          <ChevronRight className="text-gray-400 h-5 w-5" />
        </div>
      ))}
    </div>
  );
};

export default FoodScanTab;
