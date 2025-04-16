import React, { useState, useEffect } from "react";
import { ChevronRight, Droplets, Sun, Flower, Camera, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection, getDocs, query, orderBy, where, serverTimestamp } from "firebase/firestore";

interface PlantItem {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  borderColor: string;
}

const samplePlantItems: PlantItem[] = [
  {
    id: "1",
    name: "Ti Leaf",
    scientificName: "Cordyline fruticosa",
    imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    borderColor: "border-green-100",
  },
  {
    id: "2",
    name: "Monstera",
    scientificName: "Monstera deliciosa",
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    borderColor: "border-blue-100",
  },
  {
    id: "3",
    name: "Pink Roses",
    scientificName: "Rosa gallica",
    imageUrl: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
    borderColor: "border-purple-100",
  },
  {
    id: "4",
    name: "Blue Fern",
    scientificName: "Phlebodium aureum", 
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    borderColor: "border-green-100",
  },
];

const SHOW_WELCOME_SCREEN = false;

const PlantScanTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plantItems, setPlantItems] = useState<PlantItem[]>(samplePlantItems);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  useEffect(() => {
    const loadSavedScans = async () => {
      try {
        const bookmarkedIds: string[] = [];
        for (const item of plantItems) {
          const isBookmarkedItem = await isBookmarked(item.id, 'plants');
          if (isBookmarkedItem) {
            bookmarkedIds.push(item.id);
          }
        }
        setBookmarkedItems(bookmarkedIds);

        const user = auth.currentUser;
        if (user) {
          const scansRef = collection(db, 'users', user.uid, 'scans');
          const q = query(
            scansRef, 
            where('type', '==', 'plants'),
            orderBy('timestamp', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          const savedScans: PlantItem[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data) {
              const sampleItemIds = samplePlantItems.map(item => item.id);
              if (!sampleItemIds.includes(data.id)) {
                savedScans.push({
                  id: data.id,
                  name: data.name,
                  scientificName: data.scientificName,
                  imageUrl: data.imageUrl,
                  borderColor: data.borderColor || 'border-green-100',
                });
              }
            }
          });
          
          setPlantItems([...samplePlantItems, ...savedScans]);
        }
      } catch (error) {
        console.error('Error loading saved scans:', error);
      }
    };
    
    loadSavedScans();
  }, []);

  const handleBookmarkToggle = async (e: React.MouseEvent, item: PlantItem) => {
    e.stopPropagation();
    const isItemBookmarked = bookmarkedItems.includes(item.id);
    
    if (isItemBookmarked) {
      const success = await removeBookmark(item.id, 'plants');
      
      if (success) {
        setBookmarkedItems(prev => prev.filter(id => id !== item.id));
        toast({
          title: "Removed from bookmarks",
          description: `${item.name} has been removed from your bookmarks`,
        });
      }
    } else {
      const bookmarkItem = {
        id: item.id,
        name: item.name,
        scientificName: item.scientificName,
        imageUrl: item.imageUrl,
        borderColor: item.borderColor,
        type: 'plants',
      };
      
      const success = await addBookmark(bookmarkItem, 'plants');
      
      if (success) {
        setBookmarkedItems(prev => [...prev, item.id]);
        toast({
          title: "Added to bookmarks",
          description: `${item.name} has been added to your bookmarks`,
        });
      }
    }
  };

  const saveScanToFirebase = async (item: PlantItem) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        const savedScans = localStorage.getItem('plantScans');
        let scans = savedScans ? JSON.parse(savedScans) : [];
        
        if (!scans.some((scan: PlantItem) => scan.id === item.id)) {
          scans.push(item);
          localStorage.setItem('plantScans', JSON.stringify(scans));
        }
        
        return;
      }
      
      const scanRef = doc(collection(db, 'users', user.uid, 'scans'));
      await setDoc(scanRef, {
        id: item.id,
        name: item.name,
        scientificName: item.scientificName,
        imageUrl: item.imageUrl,
        borderColor: item.borderColor,
        type: 'plants',
        timestamp: serverTimestamp()
      });
      
      toast({
        title: "Scan saved",
        description: `${item.name} has been saved to your account`,
      });
    } catch (error) {
      console.error('Error saving scan:', error);
      toast({
        title: "Error",
        description: "Failed to save scan result",
        variant: "destructive"
      });
    }
  };

  const getBorderColor = (type: string) => {
    if (type.includes("Ti Leaf")) return "border-green-200";
    if (type.includes("Monstera")) return "border-blue-200";
    if (type.includes("Pink")) return "border-purple-200";
    return "border-teal-200";
  };

  const handlePlantClick = (item: PlantItem) => {
    saveScanToFirebase(item);
    navigate(`/plant/${item.id}`);
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
              <Flower size={32} className="text-gray-400" />
            </div>
            <p className="mt-2 text-gray-400">Plants</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plantItems.map((item) => (
        <div 
          key={item.id} 
          className={`p-3 rounded-xl border shadow-sm bg-white flex items-center justify-between cursor-pointer ${getBorderColor(item.name)}`}
          onClick={() => handlePlantClick(item)}
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
            <p className="text-md text-blue-500">{item.scientificName}</p>
            <div className="flex space-x-3 mt-2">
              <Droplets className="text-blue-500" size={18} />
              <Sun className="text-yellow-500" size={18} />
              <Flower className="text-green-500" size={18} />
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={(e) => handleBookmarkToggle(e, item)}
              className="p-2 mr-2 text-gray-500"
              aria-label={bookmarkedItems.includes(item.id) ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark 
                className={`h-6 w-6 ${bookmarkedItems.includes(item.id) ? 'fill-wayscanner-green text-wayscanner-green' : ''}`} 
              />
            </button>
            <ChevronRight className="text-gray-400 h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantScanTab;
