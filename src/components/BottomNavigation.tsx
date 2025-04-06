
import React from "react";
import { 
  Home, 
  MessageCircle, 
  Utensils, 
  ShoppingBag, 
  Camera,
  HomeIcon,
  MessageCircleIcon,
  UtensilsIcon,
  ShoppingBagIcon
} from "lucide-react";
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
        activeIcon={<Home size={24} fill="currentColor" />}
        label="Home"
        isActive={activeItem === "home"}
        onClick={() => onItemClick("home")}
      />
      <NavItem
        icon={<MessageCircle size={24} />}
        activeIcon={<MessageCircle size={24} fill="currentColor" />}
        label="Forum"
        isActive={activeItem === "forum"}
        onClick={() => onItemClick("forum")}
      />
      <NavItem
        icon={<Utensils size={24} />}
        activeIcon={<Utensils size={24} fill="currentColor" />}
        label="Recipes"
        isActive={activeItem === "recipes"}
        onClick={() => onItemClick("recipes")}
      />
      <NavItem
        icon={<ShoppingBag size={24} />}
        activeIcon={<ShoppingBag size={24} fill="currentColor" />}
        label="Shop"
        isActive={activeItem === "shop"}
        onClick={() => onItemClick("shop")}
      />
      <button
        className="flex flex-col items-center justify-center w-16"
        onClick={onCameraClick}
      >
        <div className="mb-1 text-wayscanner-blue">
          <Camera size={24} />
        </div>
        <span className="text-xs text-wayscanner-blue font-medium">
          Camera
        </span>
      </button>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  activeIcon,
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
        {isActive ? activeIcon : icon}
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
