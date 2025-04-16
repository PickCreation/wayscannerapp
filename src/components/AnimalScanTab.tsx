import React, { useState, useEffect } from "react";
import { ChevronRight, AlertTriangle, Camera, PawPrint, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/firebaseService";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection, getDocs, query, orderBy, where, serverTimestamp } from "firebase/firestore";

interface AnimalItem {
  id: string;
  name: string;
  scientificName: string;
  riskLevel: "High" | "Moderate" | "Low";
  imageUrl: string;
  borderColor: string;
  icon: "mammal" | "bird" | "fish";
  type: string;
  dietary: string;
  behavior: string;
}

const sampleAnimalItems: AnimalItem[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png",
    borderColor: "border-red-200",
    icon: "mammal",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Nocturnal"
  },
  {
    id: "2",
    name: "Gray Wolf",
    scientificName: "Canis lupus",
    riskLevel: "Moderate",
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    borderColor: "border-orange-200",
    icon: "mammal",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Crepuscular"
  },
  {
    id: "3",
    name: "Labrador Retriever",
    scientificName: "Canis lupus familiaris",
    riskLevel: "Low",
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    borderColor: "border-green-200",
    icon: "mammal",
    type: "Mammal",
    dietary: "Omnivore",
    behavior: "Diurnal"
  },
];

const SHOW_WELCOME_SCREEN = false;

const AnimalScanTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animalItems, setAnimalItems] = useState<AnimalItem[]>(sampleAnimalItems);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  
  useEffect(() => {
    const loadSavedScans = async () => {
      try {
        const bookmarkedIds: string[] = [];
        for (const item of animalItems) {
          const isBookmarkedItem = await isBookmarked(item.id, 'animals');
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
            where('type', '==', 'animals'),
            orderBy('timestamp', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          const savedScans: AnimalItem[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data) {
              const sampleItemIds = sampleAnimalItems.map(item => item.id);
              if (!sampleItemIds.includes(data.id)) {
                savedScans.push({
                  id: data.id,
                  name: data.name,
                  scientificName: data.scientificName,
                  riskLevel: data.riskLevel,
                  imageUrl: data.imageUrl,
                  borderColor: data.borderColor,
                  icon: data.icon,
                  type: data.type,
                  dietary: data.dietary,
                  behavior: data.behavior
                });
              }
            }
          });
          
          setAnimalItems([...sampleAnimalItems, ...savedScans]);
        }
      } catch (error) {
        console.error('Error loading saved scans:', error);
      }
    };
    
    loadSavedScans();
  }, []);

  const handleBookmarkToggle = async (e: React.MouseEvent, item: AnimalItem) => {
    e.stopPropagation();
    
    const isItemBookmarked = bookmarkedItems.includes(item.id);
    
    if (isItemBookmarked) {
      const success = await removeBookmark(item.id, 'animals');
      
      if (success) {
        setBookmarkedItems(prev => prev.filter(id => id !== item.id));
        toast({
          title: "Removed from bookmarks",
          description: `${item.name} has been removed from your bookmarks`,
        });
      }
    } else {
      const bookmarkItem = {
        ...item,
        type: 'animals',
      };
      
      const success = await addBookmark(bookmarkItem, 'animals');
      
      if (success) {
        setBookmarkedItems(prev => [...prev, item.id]);
        toast({
          title: "Added to bookmarks",
          description: `${item.name} has been added to your bookmarks`,
        });
      }
    }
  };

  const saveScanToFirebase = async (item: AnimalItem) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        const savedScans = localStorage.getItem('animalScans');
        let scans = savedScans ? JSON.parse(savedScans) : [];
        
        if (!scans.some((scan: AnimalItem) => scan.id === item.id)) {
          scans.push(item);
          localStorage.setItem('animalScans', JSON.stringify(scans));
        }
        
        return;
      }
      
      const scanRef = doc(collection(db, 'users', user.uid, 'scans'));
      await setDoc(scanRef, {
        ...item,
        type: 'animals',
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

  const getRiskColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "bg-red-500";
    if (risk === "Moderate") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getBorderColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "border-red-200";
    if (risk === "Moderate") return "border-orange-200";
    return "border-green-200";
  };

  const handleAnimalClick = (item: AnimalItem) => {
    saveScanToFirebase(item);
    navigate(`/animal/${item.id}`);
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
              <PawPrint size={32} className="text-gray-400" />
            </div>
            <p className="mt-2 text-gray-400">Animals</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {animalItems.map((item) => (
        <div 
          key={item.id} 
          className={`p-3 rounded-xl border-2 ${getBorderColor(item.riskLevel)} shadow-sm bg-white flex items-center justify-between cursor-pointer`}
          onClick={() => handleAnimalClick(item)}
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
            <div className={`${getRiskColor(item.riskLevel)} text-white px-2 py-1 rounded-full inline-flex items-center text-sm mt-2`}>
              <AlertTriangle className="mr-1" size={14} />
              <span>{item.riskLevel} Risk</span>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={(e) => handleBookmarkToggle(e, item)}
              className="p-2 mr-2 text-gray-500"
              aria-label={bookmarkedItems.includes(item.id) ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark 
                className={`h-6 w-6 ${bookmarkedItems.includes(item.id) ? 'fill-wayscanner-red text-wayscanner-red' : ''}`} 
              />
            </button>
            <ChevronRight className="text-gray-400 h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimalScanTab;
