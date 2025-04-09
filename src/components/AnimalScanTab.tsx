
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Define the animal scan result interface
interface AnimalScanResult {
  id: string;
  name: string;
  scientificName: string;
  riskLevel: "High" | "Moderate" | "Low";
  imageUrl: string;
  timestamp: Date;
}

// Mock data for animal scan results
const animalScanResults: AnimalScanResult[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png",
    timestamp: new Date("2025-04-08T15:30:00")
  },
  {
    id: "2",
    name: "Gray Wolf",
    scientificName: "Canis lupus",
    riskLevel: "Moderate",
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    timestamp: new Date("2025-04-07T10:15:00")
  },
  {
    id: "3",
    name: "Labrador Retriever",
    scientificName: "Canis lupus familiaris",
    riskLevel: "Low",
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    timestamp: new Date("2025-04-05T09:45:00")
  }
];

const AnimalScanTab: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [scanResults, setScanResults] = React.useState<AnimalScanResult[]>([]);
  
  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setScanResults(animalScanResults);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAnimalClick = (animalId: string) => {
    navigate(`/animal/${animalId}`);
  };
  
  const getRiskColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "bg-red-500 text-white";
    if (risk === "Moderate") return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleScanNewAnimal = () => {
    navigate('/scan-camera', { state: { scanType: 'animal' } });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 border border-gray-200 rounded-lg p-3">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={handleScanNewAnimal}
          className="w-full py-3 px-4 bg-wayscanner-blue text-white rounded-lg font-medium flex items-center justify-center"
        >
          <span className="mr-2">Scan New Animal</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {scanResults.length === 0 ? (
          <div className="text-center py-10 border border-gray-200 rounded-lg">
            <p className="text-gray-500">No animal scans yet.</p>
            <p className="text-gray-400 text-sm mt-1">Tap the button above to scan an animal.</p>
          </div>
        ) : (
          scanResults.map((animal) => (
            <div 
              key={animal.id} 
              className="flex items-center space-x-4 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => handleAnimalClick(animal.id)}
            >
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <img 
                  src={animal.imageUrl} 
                  alt={animal.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{animal.name}</h3>
                <p className="text-sm text-gray-500">{animal.scientificName}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className={`px-2 py-0.5 rounded-full text-xs flex items-center ${getRiskColor(animal.riskLevel)}`}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>{animal.riskLevel} Risk</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(animal.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnimalScanTab;
