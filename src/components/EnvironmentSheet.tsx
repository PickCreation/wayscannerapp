
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { X, Leaf, Refrigerator, Sun, Droplets, Thermometer } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface EnvironmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFood?: {
    name: string;
    brand: string;
  };
}

const EnvironmentSheet: React.FC<EnvironmentSheetProps> = ({
  open,
  onOpenChange,
  currentFood
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-auto">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-xl flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-green-500" />
            Environmental Information
          </SheetTitle>
          <SheetDescription>
            Proper storage and sustainability information for {currentFood?.name || "this food"}
          </SheetDescription>
          <SheetClose className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </SheetClose>
        </SheetHeader>
        
        <div className="mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center">
              <Leaf className="mr-2 h-5 w-5" />
              Sustainability Impact
            </h3>
            <p className="text-sm text-gray-700">
              Making informed choices about food storage not only keeps your food fresh longer
              but also helps reduce food waste, which is a significant contributor to greenhouse gas emissions.
            </p>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-3">Storage Recommendations</h3>
        
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="refrigeration">
            <AccordionTrigger className="py-3">
              <div className="flex items-center">
                <Refrigerator className="mr-2 h-5 w-5 text-blue-500" />
                <span>Refrigeration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-gray-700">
                  Store in refrigerator at 34-40°F (1-4°C) for optimal freshness.
                </p>
                <p className="text-sm text-gray-700">
                  Keep in original packaging or transfer to an airtight container to prevent odor transfer.
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mt-2">
                  <span className="font-semibold">Tip:</span> Store on middle or upper shelves, not in the door where temperature fluctuates.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="pantry">
            <AccordionTrigger className="py-3">
              <div className="flex items-center">
                <Sun className="mr-2 h-5 w-5 text-orange-500" />
                <span>Pantry Storage</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-gray-700">
                  Store in a cool, dry place away from direct sunlight at 50-70°F (10-21°C).
                </p>
                <p className="text-sm text-gray-700">
                  Keep in airtight containers to maintain freshness and prevent pest infestation.
                </p>
                <div className="bg-orange-50 p-2 rounded text-xs text-orange-700 mt-2">
                  <span className="font-semibold">Tip:</span> Label containers with purchase date to track freshness.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="freezer">
            <AccordionTrigger className="py-3">
              <div className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-indigo-500" />
                <span>Freezer Storage</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-gray-700">
                  Store at 0°F (-18°C) or below for long-term preservation.
                </p>
                <p className="text-sm text-gray-700">
                  Use freezer-safe containers or heavy-duty freezer bags with air removed before sealing.
                </p>
                <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-700 mt-2">
                  <span className="font-semibold">Tip:</span> Label with contents and date frozen. Most foods maintain quality for 3-6 months.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="humidity">
            <AccordionTrigger className="py-3">
              <div className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-teal-500" />
                <span>Humidity Considerations</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-gray-700">
                  Some produce retains freshness better in high humidity (leafy greens, berries).
                </p>
                <p className="text-sm text-gray-700">
                  Others benefit from low humidity (onions, garlic, potatoes).
                </p>
                <div className="bg-teal-50 p-2 rounded text-xs text-teal-700 mt-2">
                  <span className="font-semibold">Tip:</span> Use the crisper drawer settings in your refrigerator to control humidity levels.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <h3 className="font-semibold text-lg mb-3">Environmental Impact</h3>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Reducing Food Waste</h4>
            <p className="text-sm text-gray-700">
              Proper storage extends the life of your food and reduces waste. Food waste in landfills produces methane, a potent greenhouse gas.
            </p>
            <ul className="text-sm text-gray-700 list-disc pl-5 mt-2 space-y-1">
              <li>Plan your meals to use perishable items promptly</li>
              <li>Freeze excess food before it spoils</li>
              <li>Learn to properly interpret date labels on packaging</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Packaging Considerations</h4>
            <p className="text-sm text-gray-700">
              When possible, choose products with minimal or recyclable packaging. Properly recycle or reuse food packaging.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnvironmentSheet;
