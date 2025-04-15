
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ScannerCardProps {
  title: string;
  description: string;
  color: "red" | "green" | "yellow" | "purple" | "blue" | "neutral";
  icon: React.ReactNode;
  onClick?: () => void;
  showBookmarkIcon?: boolean;
  onBookmarkRemove?: () => void;
}

const ScannerCard: React.FC<ScannerCardProps> = ({
  title,
  description,
  color,
  icon,
  onClick,
  showBookmarkIcon = false,
  onBookmarkRemove,
}) => {
  const navigate = useNavigate();
  const colorMap = {
    red: "bg-wayscanner-red",
    green: "bg-wayscanner-green",
    yellow: "bg-wayscanner-yellow", 
    purple: "bg-wayscanner-purple",
    blue: "bg-wayscanner-blue",
    neutral: "bg-gray-500",
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
    else if (title === "Blog & Articles") {
      navigate("/blogs");
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

  const handleBookmarkRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmarkRemove) {
      onBookmarkRemove();
    }
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
      
      {/* Bookmark remove icon if needed */}
      {showBookmarkIcon && (
        <button 
          onClick={handleBookmarkRemove}
          className="absolute top-4 right-4 text-white hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
      
      {/* Text at the bottom */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
};

export default ScannerCard;
