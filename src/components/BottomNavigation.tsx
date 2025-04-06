
import React from "react";
import { 
  MessageCircle, 
  Utensils, 
  User,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

interface BottomNavigationProps {
  activeItem: "home" | "forum" | "recipes" | "shop" | "profile";
  onItemClick: (item: "home" | "forum" | "recipes" | "shop" | "profile") => void;
  onCameraClick: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeItem,
  onItemClick,
  onCameraClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === "/profile" || 
                       location.pathname.includes("/bookmarks") || 
                       location.pathname.includes("/favorites") || 
                       location.pathname.includes("/cart") || 
                       location.pathname.includes("/orders") || 
                       location.pathname.includes("/purchases") || 
                       location.pathname.includes("/addresses") || 
                       location.pathname.includes("/payment-methods");
  const isRecipesPage = location.pathname.includes("/recipes");
  const isMarketplacePage = location.pathname.includes("/marketplace") || location.pathname.includes("/add-listing");

  const handleRecipesClick = () => {
    navigate("/recipes");
    onItemClick("recipes");
  };

  const handleShopClick = () => {
    navigate("/marketplace");
    onItemClick("shop");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    onItemClick("profile");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-between px-4 z-10">
      <NavItem
        icon={<HomeIcon filled={false} />}
        activeIcon={<HomeIcon filled={true} />}
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
        isActive={activeItem === "recipes" || isRecipesPage}
        onClick={handleRecipesClick}
      />
      <NavItem
        icon={<ShopIcon filled={false} />}
        activeIcon={<ShopIcon filled={true} />}
        label="Shop"
        isActive={activeItem === "shop" || isMarketplacePage}
        onClick={handleShopClick}
      />
      <NavItem
        icon={<User size={24} />}
        activeIcon={<User size={24} fill="currentColor" />}
        label="Profile"
        isActive={activeItem === "profile" || isProfilePage}
        onClick={handleProfileClick}
      />
      <button
        className="flex items-center justify-center"
        onClick={onCameraClick}
        type="button"
      >
        <div className="bg-wayscanner-blue text-white rounded-full w-12 h-12 flex items-center justify-center">
          <Camera size={24} color="white" />
        </div>
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

const HomeIcon = ({ filled, size = 24 }: { filled: boolean; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M300 50C280 50 260 60 246 73L76 243C63 256 56 273 56 290V500C56 533 83 560 116 560H206C222.6 560 236 546.6 236 530V390C236 373.4 249.4 360 266 360H334C350.6 360 364 373.4 364 390V530C364 546.6 377.4 560 394 560H484C517 560 544 533 544 500V290C544 273 537 256 524 243L354 73C340 60 320 50 300 50Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="16"
      />
    </svg>
  );
};

const ShopIcon = ({ filled, size = 24 }: { filled: boolean; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 7V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.0001 7L19.2276 14.1521C19.0801 15.8831 17.6022 17.2176 15.8638 17.2176H8.13633C6.39786 17.2176 4.92002 15.8831 4.77251 14.1521L4.00006 7"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BottomNavigation;
