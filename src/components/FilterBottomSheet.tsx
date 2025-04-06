
import React, { useState } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        <ScrollArea className="h-full max-h-[calc(85vh-130px)] overflow-y-auto">
          <DrawerHeader className="flex items-center justify-between px-4">
            <DrawerTitle className="text-xl font-semibold">Filters</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </DrawerHeader>
          
          <div className="space-y-6 px-4 pb-2">
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
              <div className="grid grid-cols-2 gap-2 pb-10">
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
              <div className="grid grid-cols-2 gap-2 pb-10">
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
            
            {/* Color Section - Now using dropdown */}
            <div>
              <h3 className="font-medium mb-3">Color</h3>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center">
                      {color !== "any" && (
                        <span className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: colors.find(c => c.value === color)?.color }}></span>
                      )}
                      {colors.find(c => c.value === color)?.label || "Any"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center">
                        <span 
                          className={`h-4 w-4 rounded-full mr-2 ${c.value === "white" ? "border border-gray-200" : ""}`} 
                          style={{ backgroundColor: c.color }}
                        ></span>
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Country Section */}
            <div>
              <h3 className="font-medium mb-3">Ship From</h3>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue>{country}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="px-4 pt-2 pb-4">
          <div className="flex gap-2 pb-10">
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
