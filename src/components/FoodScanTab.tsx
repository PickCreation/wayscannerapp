
import React from 'react';
import { Info, Edit, Settings, CircleAlert, AlertTriangle, Eye, CreditCard, Ellipsis } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      nutrition: {
        calories: 80,
        protein: '3g',
        fiber: '2g',
      }
    },
    {
      id: '2',
      name: 'Doritos Chips',
      brand: 'Frito-Lay',
      score: 74,
      imageUrl: '/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png',
      nutrition: {
        calories: 210,
        protein: '2g',
        fiber: '1g',
      }
    },
    {
      id: '3',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      score: 50,
      imageUrl: '/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png',
      nutrition: {
        calories: 130,
        protein: '15g',
        fiber: '0g',
      }
    },
    {
      id: '4',
      name: 'Chocolate Bar',
      brand: 'Hershey\'s',
      score: 23,
      imageUrl: '/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png',
      nutrition: {
        calories: 210,
        protein: '3g',
        fiber: '2g',
      }
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-500";
    if (score >= 60) return "bg-purple-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Not great";
    return "Bad";
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="p-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
          <h3 className="text-base font-semibold">Tools</h3>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2">
          <button 
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 border border-gray-200"
            onClick={onEditPreferences}
          >
            <Edit size={16} className="text-wayscanner-blue" />
            <span className="text-sm font-medium">Edit Preferences</span>
          </button>
          <button 
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 border border-gray-200"
            onClick={onHowWeScore}
          >
            <Info size={16} className="text-wayscanner-blue" />
            <span className="text-sm font-medium">How We Score</span>
          </button>
          <button className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 border border-gray-200">
            <Settings size={16} className="text-wayscanner-blue" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 border border-gray-200">
            <CircleAlert size={16} className="text-wayscanner-blue" />
            <span className="text-sm font-medium">Report Issues</span>
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="p-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
          <h3 className="text-base font-semibold">Recent Scans</h3>
          <button className="text-xs text-wayscanner-blue font-medium">See All</button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {scanResults.map((item) => (
            <div key={item.id} className="p-3 flex items-center hover:bg-gray-50" onClick={() => navigate(`/food/${item.id}`)}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 mr-3">
                <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.brand}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-600">{item.nutrition.calories} cal</span>
                  <span className="text-xs text-gray-600">{item.nutrition.protein} protein</span>
                </div>
              </div>
              
              <div className={`${getScoreColor(item.score)} text-white px-2 py-0.5 rounded-full text-xs flex items-center`}>
                <span className="font-bold mr-0.5">{item.score}</span>
                <span>{getScoreText(item.score)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="p-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
          <h3 className="text-base font-semibold">Food Alerts</h3>
          <button className="text-xs text-wayscanner-blue font-medium">Settings</button>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="p-3 flex items-start">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <AlertTriangle size={16} className="text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">High sugar content detected</h4>
              <p className="text-xs text-gray-600 mt-0.5">Your recent scans show you're consuming foods with high sugar content.</p>
            </div>
          </div>
          
          <div className="p-3 flex items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Eye size={16} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Scan your beverages too</h4>
              <p className="text-xs text-gray-600 mt-0.5">Don't forget to scan your drinks - they can contain hidden calories!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodScanTab;
