
import React, { useState } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";

type Diet = "Vegan" | "Vegetarian" | null;
type Allergy = "Sesame" | "Peanuts" | "Eggs" | "Shellfish" | "Lactose" | "Soy" | "Nuts" | "Fish" | "Milk" | "Gluten";

interface EditPreferencesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (diet: Diet, allergies: Allergy[]) => void;
  initialDiet?: Diet;
  initialAllergies?: Allergy[];
}

const EditPreferencesSheet: React.FC<EditPreferencesSheetProps> = ({
  open,
  onOpenChange,
  onSave,
  initialDiet = null,
  initialAllergies = []
}) => {
  const [selectedDiet, setSelectedDiet] = useState<Diet>(initialDiet);
  const [selectedAllergies, setSelectedAllergies] = useState<Allergy[]>(initialAllergies);

  const handleDietSelection = (diet: Diet) => {
    setSelectedDiet(diet === selectedDiet ? null : diet);
  };

  const handleAllergySelection = (allergy: Allergy) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleSave = () => {
    onSave(selectedDiet, selectedAllergies);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <div className="p-4 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Preferences</h2>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Diets</h3>
              <div className="flex flex-wrap gap-2">
                {["Vegan", "Vegetarian"].map((diet) => (
                  <button
                    key={diet}
                    className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${
                      selectedDiet === diet 
                        ? "border-wayscanner-blue bg-blue-50 text-blue-800" 
                        : "border-gray-300"
                    }`}
                    onClick={() => handleDietSelection(diet as Diet)}
                  >
                    {diet === "Vegan" && <span>🌱</span>}
                    {diet === "Vegetarian" && <span>🥦</span>}
                    <span>{diet}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {["Sesame", "Peanuts", "Eggs", "Shellfish", "Lactose"].map((allergy) => (
                  <button
                    key={allergy}
                    className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${
                      selectedAllergies.includes(allergy as Allergy) 
                        ? "border-wayscanner-blue bg-blue-50 text-blue-800" 
                        : "border-gray-300"
                    }`}
                    onClick={() => handleAllergySelection(allergy as Allergy)}
                  >
                    {allergy === "Sesame" && <span>🌰</span>}
                    {allergy === "Peanuts" && <span>🥜</span>}
                    {allergy === "Eggs" && <span>🥚</span>}
                    {allergy === "Shellfish" && <span>🦞</span>}
                    {allergy === "Lactose" && <span>🧀</span>}
                    <span>{allergy}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Soy", "Nuts", "Fish", "Milk", "Gluten"].map((allergy) => (
                  <button
                    key={allergy}
                    className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${
                      selectedAllergies.includes(allergy as Allergy) 
                        ? "border-wayscanner-blue bg-blue-50 text-blue-800" 
                        : "border-gray-300"
                    }`}
                    onClick={() => handleAllergySelection(allergy as Allergy)}
                  >
                    {allergy === "Soy" && <span>🌱</span>}
                    {allergy === "Nuts" && <span>🌰</span>}
                    {allergy === "Fish" && <span>🐟</span>}
                    {allergy === "Milk" && <span>🥛</span>}
                    {allergy === "Gluten" && <span>🌾</span>}
                    <span>{allergy}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 pb-10">
            <button
              className="w-full py-3 bg-wayscanner-blue text-white rounded-lg font-semibold"
              onClick={handleSave}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditPreferencesSheet;
