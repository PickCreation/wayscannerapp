
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Flower2, Leaf, Sun, Droplets, Thermometer, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RequirementItem {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const PlantRequirements = () => {
  const requirements: RequirementItem[] = [
    {
      icon: <Flower2 />,
      title: "Pot",
      content: "Use a pot that is 1-2 inches larger than the root ball with good drainage holes. Terracotta pots are ideal as they allow soil to dry between waterings."
    },
    {
      icon: <Leaf />,
      title: "Soil",
      content: "Well-draining potting mix with perlite or sand. A mix designed for indoor plants or succulents works well for most houseplants."
    },
    {
      icon: <Sun />,
      title: "Lighting",
      content: "Bright, indirect light is best. Avoid direct sunlight which can scorch leaves. Some varieties can tolerate lower light conditions."
    },
    {
      icon: <Droplets />,
      title: "Humidity",
      content: "Moderate to high humidity (40-60%). Increase humidity by misting, using a humidifier, or placing on a pebble tray with water."
    },
    {
      icon: <MapPin />,
      title: "Hardiness Zone",
      content: "USDA Zones 9-11 for outdoor growing. Keep indoors in temperatures below 50°F (10°C)."
    },
    {
      icon: <Thermometer />,
      title: "Temperature",
      content: "Ideal range is 65-80°F (18-27°C). Avoid cold drafts and sudden temperature changes."
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Plant Requirements</h2>
      <div className="space-y-2">
        {requirements.map((item, index) => (
          <Collapsible key={index} className="border rounded-md">
            <CollapsibleTrigger className="w-full p-3">
              <Button 
                variant="ghost" 
                align="left" 
                className="w-full flex items-center gap-2 text-left"
              >
                {item.icon}
                <span>{item.title}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3 pt-0 text-sm">
              {item.content}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default PlantRequirements;
