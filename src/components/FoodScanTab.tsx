import React, { useState, useEffect } from 'react';
import { ChevronRight, Camera, Apple, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/firebaseService';

interface FoodScanTabProps {
  onEditPreferences?: () => void;
  onHowWeScore?: () => void;
}

// Set this to false to show food items for testing
const SHOW_WELCOME_SCREEN = false;

const FoodScanTab: React.FC<FoodScanTabProps> = ({ onEditPreferences, onHowWeScore }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  // Sample food scan results with realistic food images
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
      imageUrl: '/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png',
    },
    {
      id: '4',
      name: 'Chocolate Bar',
      brand: 'Hershey\'s',
      score: 23,
      imageUrl: '/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png',
    }
  ];

  // Load bookmarked items from Firebase or localStorage on component mount
  useEffect(() => {
    const loadBookmarks = async () => {
      const bookmarkedIds: string[] = [];
      
      for (const item of scanResults) {
        const isBookmarkedItem = await isBookmarked(item.id, 'food');
        if (isBookmarkedItem) {
          bookmarkedIds.push(item.id);
        }
      }
      
      setBookmarkedItems(bookmarkedIds);
    };
    
    loadBookmarks();
  }, []);

  const handleBookmarkToggle = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation(); // Prevent navigation when clicking the bookmark button
    
    // Check if this item is already bookmarked
    const isItemBookmarked = bookmarkedItems.includes(item.id);
    
    if (isItemBookmarked) {
      // Remove from bookmarks
      const success = await removeBookmark(item.id, 'food');
      
      if (success) {
        setBookmarkedItems(prev => prev.filter(id => id !== item.id));
        toast({
          title: "Removed from bookmarks",
          description: `${item.name} has been removed from your bookmarks`,
        });
      }
    } else {
      // Add to bookmarks - prepare the item with type and data
      const bookmarkItem = {
        id: item.id,
        name: item.name,
        brand: item.brand,
        score: item.score,
        imageUrl: item.imageUrl,
        type: 'food',
      };
      
      const success = await addBookmark(bookmarkItem, 'food');
      
      if (success) {
        setBookmarkedItems(prev => [...prev, item.id]);
        toast({
          title: "Added to bookmarks",
          description: `${item.name} has been added to your bookmarks`,
        });
      }
    }
  };

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

  if (SHOW_WELCOME_SCREEN) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center h-[70vh]">
        <h2 className="text-2xl font-medium text-gray-400 mb-2">Welcome to WayScanner</h2>
        <p className="text-lg text-gray-400 mb-8">Scan an item to learn more!</p>
        
        <div className="border-2 border-gray-300 rounded-3xl p-8 mb-12 w-full max-w-xs flex flex-col items-center">
          <p className="text-3xl text-gray-400 mb-4">Tap</p>
          <Camera size={64} className="text-gray-400 mb-4" />
          <p className="text-3xl text-gray-400">to scan</p>
        </div>
        
        <div className="flex w-full justify-around items-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-4 rounded-full">
              <Apple size={32} className="text-gray-400" />
            </div>
            <p className="mt-2 text-gray-400">Food</p>
          </div>
        </div>
      </div>
    );
  }

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
              className="h-full w-full object-cover rounded-[12px]"
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
          <div className="flex items-center">
            <button 
              onClick={(e) => handleBookmarkToggle(e, item)}
              className="p-2 mr-2 text-gray-500"
              aria-label={bookmarkedItems.includes(item.id) ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark 
                className={`h-6 w-6 ${bookmarkedItems.includes(item.id) ? 'fill-wayscanner-blue text-wayscanner-blue' : ''}`} 
              />
            </button>
            <ChevronRight className="text-gray-400 h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodScanTab;
