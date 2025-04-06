
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
      className="relative rounded-3xl p-5 bg-gradient-to-b from-wayscanner-gray to-wayscanner-darkgray cursor-pointer shadow-md"
      onClick={onClick}
    >
      <div className={cn("absolute top-5 left-5 rounded-xl p-3", colorMap[color])}>
        {icon}
      </div>
      <div className="absolute top-32 left-5 right-5">
        <div className="bg-black/20 aspect-square rounded-xl mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)"/>
          </svg>
        </div>
        <h3 className="text-white text-2xl font-semibold mb-1">{title}</h3>
        <p className="text-white text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ScannerCard;
