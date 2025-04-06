
import React from "react";
import { Home, MessageCircle, Utensils, ShoppingBag, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeItem: "home" | "forum" | "recipes" | "shop";
  onItemClick: (item: "home" | "forum" | "recipes" | "shop") => void;
  onCameraClick: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeItem,
  onItemClick,
  onCameraClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-between px-4 z-10">
      <NavItem
        icon={<Home size={24} />}
        label="Home"
        isActive={activeItem === "home"}
        onClick={() => onItemClick("home")}
      />
      <NavItem
        icon={<MessageCircle size={24} />}
        label="Forum"
        isActive={activeItem === "forum"}
        onClick={() => onItemClick("forum")}
      />
      <div className="relative -mt-10">
        <button
          className="bg-wayscanner-blue text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={onCameraClick}
        >
          <Camera size={24} />
        </button>
      </div>
      <NavItem
        icon={<Utensils size={24} />}
        label="Recipes"
        isActive={activeItem === "recipes"}
        onClick={() => onItemClick("recipes")}
      />
      <NavItem
        icon={<ShoppingBag size={24} />}
        label="Shop"
        isActive={activeItem === "shop"}
        onClick={() => onItemClick("shop")}
      />
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      className="flex flex-col items-center justify-center w-16"
      onClick={onClick}
    >
      <div
        className={cn(
          "mb-1",
          isActive ? "text-wayscanner-blue" : "text-gray-400"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-xs",
          isActive ? "text-wayscanner-blue font-medium" : "text-gray-400"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default BottomNavigation;
