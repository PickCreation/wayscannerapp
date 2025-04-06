
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
    // Map titles to tab values
    let tabValue = "";
    if (title === "Food Scan") tabValue = "food";
    else if (title === "Plant Scan") tabValue = "plants";
    else if (title === "Animal Scan") tabValue = "animals";
    else if (title === "Marketplace") {
      navigate("/marketplace");
      // Call the original onClick if provided
      if (onClick) onClick();
      return;
    }
    
    // Only navigate if we have a valid tab
    if (tabValue) {
      navigate(`/scan?tab=${tabValue}`);
    }
    
    // Also call the original onClick if provided
    if (onClick) onClick();
  };

  return (
    <div 
      className="relative rounded-xl p-4 bg-gray-800 cursor-pointer shadow-md h-36"
      onClick={handleClick}
    >
      {/* Icon container at top-left */}
      <div className={cn("absolute top-4 left-4 rounded-2xl p-3 w-10 h-10 flex items-center justify-center", colorMap[color])}>
        {icon}
      </div>
      
      {/* Text at the bottom */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
};

export default ScannerCard;
