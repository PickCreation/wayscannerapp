
import React from "react";
import { cn } from "@/lib/utils";

interface ScannerCardProps {
  title: string;
  description: string;
  color: "red" | "green" | "yellow" | "purple";
  icon: React.ReactNode;
  onClick?: () => void;
}

const ScannerCard: React.FC<ScannerCardProps> = ({
  title,
  description,
  color,
  icon,
  onClick,
}) => {
  const colorMap = {
    red: "bg-wayscanner-red",
    green: "bg-wayscanner-green",
    yellow: "bg-wayscanner-yellow", 
    purple: "bg-wayscanner-purple",
  };

  return (
    <div 
      className="relative rounded-xl p-6 bg-gray-300 cursor-pointer shadow-md h-64"
      onClick={onClick}
    >
      {/* Icon container at top-left */}
      <div className={cn("absolute top-6 left-6 rounded-xl p-3 w-16 h-16 flex items-center justify-center", colorMap[color])}>
        {icon}
      </div>
      
      {/* Placeholder image in the middle */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-200/50 p-2 rounded-md">
        <div className="w-8 h-8 border-2 border-gray-400 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16" />
          </svg>
        </div>
      </div>
      
      {/* Text at the bottom */}
      <div className="absolute bottom-6 left-6 right-6 text-white">
        <h3 className="text-2xl font-semibold mb-1">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ScannerCard;
