
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const colorMap = {
    red: "bg-wayscanner-red",
    green: "bg-wayscanner-green",
    yellow: "bg-wayscanner-yellow", 
    purple: "bg-wayscanner-purple",
  };

  const handleClick = () => {
    // Navigate to the scan page with the appropriate tab selected
    let tabValue = "food";
    if (title === "Food Scan") tabValue = "food";
    else if (title === "Plant Scan") tabValue = "plants";
    else if (title === "Animal Scan") tabValue = "animals";
    
    navigate(`/scan?tab=${tabValue}`);
    
    // Also call the original onClick if provided
    if (onClick) onClick();
  };

  return (
    <div 
      className="relative rounded-xl p-4 bg-gray-300 cursor-pointer shadow-md h-40"
      onClick={handleClick}
    >
      {/* Icon container at top-left */}
      <div className={cn("absolute top-4 left-4 rounded-2xl p-3 w-12 h-12 flex items-center justify-center", colorMap[color])}>
        {icon}
      </div>
      
      {/* Placeholder image in the middle */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-200/50 p-1.5 rounded-md">
        <div className="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16" />
          </svg>
        </div>
      </div>
      
      {/* Text at the bottom */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-lg font-semibold mb-0.5">{title}</h3>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
};

export default ScannerCard;
