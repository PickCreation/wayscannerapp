
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[600px] overflow-auto">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="mb-4">
            <DrawerTitle className="text-xl flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-green-500" />
              Environmental Information
            </DrawerTitle>
            <DrawerDescription>
              Storage tips for {currentFood?.name || "this food"}
            </DrawerDescription>
            <DrawerClose className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </DrawerClose>
          </DrawerHeader>
          
          <div className="px-4 mb-5">
            <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-4">
              <h3 className="font-semibold text-green-700 mb-1 flex items-center text-sm">
                <Leaf className="mr-2 h-4 w-4" />
                Sustainability Tip
              </h3>
              <p className="text-xs text-gray-700">
                Proper food storage reduces waste and greenhouse gas emissions from landfills.
              </p>
            </div>
          </div>
          
          <div className="px-4">
            <h3 className="font-semibold text-md mb-2">Storage Guide</h3>
            
            <Accordion type="single" collapsible className="mb-4">
              <AccordionItem value="refrigeration">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Refrigerator className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm">Refrigeration</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pl-6">
                    <p className="text-xs text-gray-700">
                      Store at 34-40°F (1-4°C) in airtight containers.
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mt-1">
                      <span className="font-semibold">Tip:</span> Middle shelves maintain most consistent temperature.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="pantry">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4 text-orange-500" />
                    <span className="text-sm">Pantry Storage</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pl-6">
                    <p className="text-xs text-gray-700">
                      Keep in cool, dry place (50-70°F) away from sunlight in airtight containers.
                    </p>
                    <div className="bg-orange-50 p-2 rounded text-xs text-orange-700 mt-1">
                      <span className="font-semibold">Tip:</span> Label with purchase date.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="freezer">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Thermometer className="mr-2 h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Freezer Storage</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pl-6">
                    <p className="text-xs text-gray-700">
                      Store at 0°F (-18°C) in freezer-safe containers with air removed.
                    </p>
                    <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-700 mt-1">
                      <span className="font-semibold">Tip:</span> Label with contents and date. Best quality: 3-6 months.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="humidity">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Droplets className="mr-2 h-4 w-4 text-teal-500" />
                    <span className="text-sm">Humidity Guide</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pl-6">
                    <p className="text-xs text-gray-700">
                      High humidity: leafy greens, berries. Low humidity: onions, garlic, potatoes.
                    </p>
                    <div className="bg-teal-50 p-2 rounded text-xs text-teal-700 mt-1">
                      <span className="font-semibold">Tip:</span> Use crisper drawer settings to control humidity.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <h3 className="font-semibold text-md mb-2">Environmental Impact</h3>
            
            <div className="space-y-3 mb-4 pb-6">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">Reducing Food Waste</h4>
                <p className="text-xs text-gray-700">
                  Proper storage prevents food waste which reduces methane emissions from landfills.
                </p>
                <ul className="text-xs text-gray-700 list-disc pl-4 mt-1 space-y-0.5">
                  <li>Plan meals to use perishables promptly</li>
                  <li>Freeze excess food before spoiling</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">Packaging Tips</h4>
                <p className="text-xs text-gray-700">
                  Choose products with minimal or recyclable packaging. Reuse containers when possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EnvironmentSheet;
