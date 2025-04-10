
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface PlantRequirementsProps {
  plant: any; // This would ideally be typed properly based on your plant data structure
}

const PlantRequirements: React.FC<PlantRequirementsProps> = ({ plant }) => {
  const [openPot, setOpenPot] = React.useState(false);
  const [openSoil, setOpenSoil] = React.useState(false);
  const [openLighting, setOpenLighting] = React.useState(false);
  const [openHumidity, setOpenHumidity] = React.useState(false);
  const [openHardinessZone, setOpenHardinessZone] = React.useState(false);
  const [openTemperature, setOpenTemperature] = React.useState(false);

  // Sample data - in a real app, this would come from your plant data
  const requirements = {
    pot: "Choose a pot with drainage holes that is 1-2 inches larger than the plant's root ball.",
    soil: "Well-draining potting mix with some perlite or sand for improved drainage.",
    lighting: "Bright, indirect light. Avoid direct sunlight which can scorch the leaves.",
    humidity: "Medium to high humidity. Consider using a humidifier or pebble tray.",
    hardinessZone: "USDA Zones 9-11. Not frost tolerant.",
    temperature: "65-80°F (18-27°C). Keep away from cold drafts and heat sources."
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-left">Plant Requirements</h2>
      <div className="space-y-2">
        {/* Pot */}
        <Collapsible open={openPot} onOpenChange={setOpenPot} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" align="left" className="w-full flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>Pot</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p>{requirements.pot}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Soil */}
        <Collapsible open={openSoil} onOpenChange={setOpenSoil} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" align="left" className="w-full flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>Soil</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p>{requirements.soil}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Lighting */}
        <Collapsible open={openLighting} onOpenChange={setOpenLighting} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" align="left" className="w-full flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>Lighting</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p>{requirements.lighting}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Humidity */}
        <Collapsible open={openHumidity} onOpenChange={setOpenHumidity} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" align="left" className="w-full flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>Humidity</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p>{requirements.humidity}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Hardiness Zone */}
        <Collapsible open={openHardinessZone} onOpenChange={setOpenHardinessZone} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" align="left" className="w-full flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>Hardiness Zone</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p>{requirements.hardinessZone}</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Temperature */}
        <Collapsible open={openTemperature} onOpenChange={setOpenTemperature} className="border rounded-md overflow-hidden">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" align="left" className="w-full flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>Temperature</span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <p>{requirements.temperature}</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default PlantRequirements;
