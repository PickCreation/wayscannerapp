
import React, { useState } from "react";
import { Tag, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface VariationOption {
  id: string;
  value: string;
}

export interface VariationType {
  id: string;
  name: string;
  options: VariationOption[];
}

interface ProductVariationsSectionProps {
  variations: VariationType[];
  setVariations: React.Dispatch<React.SetStateAction<VariationType[]>>;
}

const PREDEFINED_VARIATION_TYPES = [
  { label: "Color", value: "color" },
  { label: "Size", value: "size" },
  { label: "Material", value: "material" },
  { label: "Style", value: "style" },
  { label: "Weight", value: "weight" },
];

const ProductVariationsSection: React.FC<ProductVariationsSectionProps> = ({ variations, setVariations }) => {
  const { toast } = useToast();
  const [enableVariations, setEnableVariations] = useState(false);
  const [customVariationName, setCustomVariationName] = useState("");
  
  const handleAddPredefinedVariation = (variationType: string) => {
    // Check if this variation type already exists
    if (variations.some(v => v.name.toLowerCase() === variationType.toLowerCase())) {
      toast({
        title: "Variation already exists",
        description: `${variationType} variation is already added`,
        variant: "destructive",
      });
      return;
    }
    
    const newVariation: VariationType = {
      id: Date.now().toString(),
      name: variationType.charAt(0).toUpperCase() + variationType.slice(1),
      options: [],
    };
    
    setVariations([...variations, newVariation]);
  };
  
  const handleAddCustomVariation = () => {
    if (!customVariationName.trim()) {
      toast({
        title: "Invalid variation name",
        description: "Please enter a valid variation name",
        variant: "destructive",
      });
      return;
    }
    
    const formattedName = customVariationName.trim();
    
    // Check if this variation type already exists
    if (variations.some(v => v.name.toLowerCase() === formattedName.toLowerCase())) {
      toast({
        title: "Variation already exists",
        description: `${formattedName} variation is already added`,
        variant: "destructive",
      });
      return;
    }
    
    const newVariation: VariationType = {
      id: Date.now().toString(),
      name: formattedName,
      options: [],
    };
    
    setVariations([...variations, newVariation]);
    setCustomVariationName("");
  };
  
  const handleRemoveVariation = (variationId: string) => {
    setVariations(variations.filter(v => v.id !== variationId));
  };
  
  const handleAddOption = (variationId: string, optionValue: string) => {
    if (!optionValue.trim()) return;
    
    setVariations(variations.map(variation => {
      if (variation.id === variationId) {
        // Check if option already exists
        if (variation.options.some(opt => opt.value.toLowerCase() === optionValue.trim().toLowerCase())) {
          toast({
            title: "Option already exists",
            description: `${optionValue} is already added to ${variation.name}`,
            variant: "destructive",
          });
          return variation;
        }
        
        return {
          ...variation,
          options: [
            ...variation.options,
            { id: Date.now().toString(), value: optionValue.trim() }
          ]
        };
      }
      return variation;
    }));
  };
  
  const handleRemoveOption = (variationId: string, optionId: string) => {
    setVariations(variations.map(variation => {
      if (variation.id === variationId) {
        return {
          ...variation,
          options: variation.options.filter(opt => opt.id !== optionId)
        };
      }
      return variation;
    }));
  };
  
  return (
    <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-5 w-5 text-wayscanner-blue" />
        <h3 className="text-lg font-semibold">Product Variations</h3>
      </div>
      
      <p className="text-gray-600 mb-3">
        Add variations like size, color or material for customers to choose from
      </p>
      
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={enableVariations}
          onCheckedChange={setEnableVariations}
          className="data-[state=checked]:bg-wayscanner-blue"
        />
        <label className="font-medium">Enable product variations</label>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Toggle this option to add different variations of your product such as sizes, colors, or materials
      </p>
      
      {enableVariations && (
        <>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Quick add variation type:</h4>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_VARIATION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant="outline"
                  className="bg-white"
                  onClick={() => handleAddPredefinedVariation(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Add custom variation type</h4>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. Finish, Pattern, Edition"
                value={customVariationName}
                onChange={e => setCustomVariationName(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddCustomVariation}
                className="bg-wayscanner-blue hover:bg-blue-700"
              >
                Add
              </Button>
            </div>
          </div>
          
          {variations.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded mt-6 p-4 text-center text-gray-500">
              Add at least one variation type to get started
            </div>
          )}
          
          {variations.length > 0 && (
            <div className="mt-6 space-y-4">
              {variations.map(variation => (
                <div key={variation.id} className="border rounded-md p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">{variation.name}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariation(variation.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X size={16} className="text-gray-500" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {variation.options.map(option => (
                      <div key={option.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                        <span>{option.value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(variation.id, option.id)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder={`Add ${variation.name.toLowerCase()} option`}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          handleAddOption(variation.id, input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        handleAddOption(variation.id, input.value);
                        input.value = '';
                      }}
                      className="bg-wayscanner-blue hover:bg-blue-700"
                    >
                      <Plus size={16} /> Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductVariationsSection;
