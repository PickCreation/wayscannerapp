
import React from 'react';
import { Info, Edit, Settings, CircleAlert } from 'lucide-react';

interface FoodScanTabProps {
  onEditPreferences?: () => void;
  onHowWeScore?: () => void;
}

const FoodScanTab: React.FC<FoodScanTabProps> = ({ onEditPreferences, onHowWeScore }) => {
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
    </div>
  );
};

export default FoodScanTab;
