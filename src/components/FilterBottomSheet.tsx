
import React, { useState } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: [number, number];
  condition: string;
  sortBy: string;
  inStock: boolean;
  color: string;
  country: string;
}

const colors = [
  { value: "any", label: "Any", color: "#E0E0E0" },
  { value: "Red", label: "Red", color: "#F44336" },
  { value: "Gold", label: "Gold", color: "#FFD700" },
  { value: "Pink", label: "Pink", color: "#FFC0CB" },
  { value: "Orange", label: "Orange", color: "#FF9800" },
  { value: "Grey", label: "Grey", color: "#9E9E9E" },
  { value: "Brown", label: "Brown", color: "#795548" },
  { value: "Navy blue", label: "Navy Blue", color: "#000080" },
  { value: "Yellow", label: "Yellow", color: "#FFEB3B" },
  { value: "Black", label: "Black", color: "#000000" },
  { value: "Green", label: "Green", color: "#4CAF50" },
  { value: "Maroon", label: "Maroon", color: "#800000" },
  { value: "Silver", label: "Silver", color: "#C0C0C0" },
  { value: "Turquoise", label: "Turquoise", color: "#40E0D0" },
  { value: "Purple", label: "Purple", color: "#9C27B0" },
  { value: "Teal", label: "Teal", color: "#008080" },
  { value: "Blue", label: "Blue", color: "#2196F3" }
];

const countries = ["Any", "United States", "Canada", "United Kingdom", "Germany", "France", "Japan", "Australia"];
const conditions = ["Any", "New", "Open Box", "Like New", "Used", "Refurbished"];
const sortOptions = ["Relevance", "Recent", "Price: Low to High", "Price: High to Low", "Most Reviews", "Highest Rated"];

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ open, onOpenChange, onApplyFilters }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [condition, setCondition] = useState("Any");
  const [sortBy, setSortBy] = useState("Relevance");
  const [inStock, setInStock] = useState(false);
  const [color, setColor] = useState("any");
  const [country, setCountry] = useState("Any");

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleReset = () => {
    setPriceRange([0, 100]);
    setCondition("Any");
    setSortBy("Relevance");
    setInStock(false);
    setColor("any");
    setCountry("Any");
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      condition,
      sortBy,
      inStock,
      color,
      country,
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-4 max-h-[90vh] overflow-y-auto">
        <DrawerHeader className="flex items-center justify-between px-0">
          <DrawerTitle className="text-xl font-semibold">Filters</DrawerTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </DrawerHeader>
        
        <div className="space-y-6 my-4">
          {/* Price Range Section */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <Slider 
              defaultValue={[priceRange[0], priceRange[1]]} 
              max={100} 
              step={1} 
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>

          {/* Sort By Section */}
          <div>
            <h3 className="font-medium mb-3">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option}
                  variant={sortBy === option ? "default" : "outline"}
                  className="justify-start text-sm h-auto py-2"
                  onClick={() => setSortBy(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Condition Section */}
          <div>
            <h3 className="font-medium mb-3">Condition</h3>
            <div className="grid grid-cols-2 gap-2">
              {conditions.map((c) => (
                <Button
                  key={c}
                  variant={condition === c ? "default" : "outline"}
                  className="justify-start text-sm h-auto py-2"
                  onClick={() => setCondition(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          {/* In Stock Section */}
          <div className="flex items-center justify-between">
            <Label htmlFor="in-stock" className="font-medium">In Stock Only</Label>
            <Switch 
              id="in-stock" 
              checked={inStock} 
              onCheckedChange={setInStock} 
            />
          </div>
          
          {/* Color Section */}
          <div>
            <h3 className="font-medium mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    color === c.value ? "ring-2 ring-wayscanner-blue ring-offset-2" : ""
                  } ${c.value === "white" ? "border border-gray-200" : ""}`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          
          {/* Country Section */}
          <div>
            <h3 className="font-medium mb-3">Ship From</h3>
            <div className="grid grid-cols-2 gap-2">
              {countries.map((c) => (
                <Button
                  key={c}
                  variant={country === c ? "default" : "outline"}
                  className="justify-start text-sm h-auto py-2"
                  onClick={() => setCountry(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-0 pt-2">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button className="flex-1 bg-wayscanner-blue" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterBottomSheet;
