
import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NutrientInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define proper TypeScript interfaces for our nutrient items
interface BaseNutrientItem {
  name: string;
  icon: string;
  description: string;
  goodAmount: string;
}

interface MacroMicroNutrientItem extends BaseNutrientItem {
  excessRisks: string;
  deficiencyRisks: string;
}

interface QuestionableIngredientItem extends BaseNutrientItem {
  whyBad: string;
  foundIn: string;
}

type NutrientItem = MacroMicroNutrientItem | QuestionableIngredientItem;

interface NutrientCategory {
  category: string;
  items: NutrientItem[];
}

// Educational content about nutrients and ingredients
const nutrientEducation: NutrientCategory[] = [
  {
    category: "Macronutrients",
    items: [
      {
        name: "Protein",
        icon: "⚡",
        description: "Essential for building muscle, repairing tissue, and making enzymes and hormones. Good sources include meat, fish, eggs, dairy, legumes, and nuts.",
        goodAmount: "0.8-1.2g per kg of body weight daily",
        excessRisks: "Kidney strain in some people, potential calcium loss",
        deficiencyRisks: "Muscle loss, weakened immunity, growth issues"
      },
      {
        name: "Carbohydrates",
        icon: "🍚",
        description: "Your body's main source of energy. Complex carbs (whole grains) provide sustained energy, while simple carbs (sugars) provide quick energy.",
        goodAmount: "45-65% of daily calories",
        excessRisks: "Weight gain, blood sugar issues, increased triglycerides",
        deficiencyRisks: "Fatigue, poor cognitive function, muscle breakdown"
      },
      {
        name: "Fats",
        icon: "🫒",
        description: "Essential for hormone production, brain health, and absorption of fat-soluble vitamins. Unsaturated fats are healthier than saturated fats.",
        goodAmount: "20-35% of daily calories",
        excessRisks: "Weight gain, cardiovascular issues (with unhealthy fats)",
        deficiencyRisks: "Vitamin deficiencies, hormone imbalances, dry skin"
      },
      {
        name: "Fiber",
        icon: "🌿",
        description: "Promotes digestive health, helps control blood sugar, and keeps you feeling full longer. Found in fruits, vegetables, whole grains, and legumes.",
        goodAmount: "25-30g daily",
        excessRisks: "Bloating, gas, reduced mineral absorption if extremely high",
        deficiencyRisks: "Constipation, higher risk of heart disease and diabetes"
      }
    ]
  },
  {
    category: "Micronutrients",
    items: [
      {
        name: "Sodium",
        icon: "🧂",
        description: "Regulates fluid balance and blood pressure, and is needed for nerve and muscle function. Most people consume too much sodium from processed foods.",
        goodAmount: "Less than 2,300mg daily",
        excessRisks: "High blood pressure, kidney disease, stroke risk",
        deficiencyRisks: "Hyponatremia, muscle cramps, confusion (rare from diet)"
      },
      {
        name: "Calcium",
        icon: "🥛",
        description: "Important for bone and teeth health, muscle function, nerve signaling, and blood clotting. Found in dairy products, leafy greens, and fortified foods.",
        goodAmount: "1,000-1,200mg daily for adults",
        excessRisks: "Kidney stones, impaired absorption of other minerals",
        deficiencyRisks: "Osteoporosis, rickets in children, muscle cramps"
      },
      {
        name: "Vitamin D",
        icon: "☀️",
        description: "Helps your body absorb calcium, supports immune function, and reduces inflammation. Your body produces it when skin is exposed to sunlight.",
        goodAmount: "600-800 IU daily",
        excessRisks: "Hypercalcemia, kidney issues (from supplements)",
        deficiencyRisks: "Bone pain, muscle weakness, increased risk of fractures"
      },
      {
        name: "Iron",
        icon: "🍷",
        description: "Essential for hemoglobin production, which carries oxygen in the blood. Found in red meat, spinach, beans, and fortified cereals.",
        goodAmount: "8-18mg daily (varies by sex and age)",
        excessRisks: "Organ damage, hemochromatosis in susceptible individuals",
        deficiencyRisks: "Anemia, fatigue, weakened immunity"
      },
      {
        name: "Potassium",
        icon: "🍌",
        description: "Regulates fluid balance, muscle contractions, and nerve signals. Found in bananas, potatoes, spinach, and yogurt.",
        goodAmount: "3,500-4,700mg daily",
        excessRisks: "Hyperkalemia, heart arrhythmias (usually from supplements)",
        deficiencyRisks: "Hypokalemia, muscle weakness, heart rhythm issues"
      }
    ]
  },
  {
    category: "Questionable Ingredients",
    items: [
      {
        name: "Added Sugars",
        icon: "🍬",
        description: "Added to foods during processing, providing calories with little nutritional value. Can be listed under many names like high-fructose corn syrup, dextrose, etc.",
        goodAmount: "Less than 25g (6 tsp) for women, 36g (9 tsp) for men daily",
        whyBad: "Contributes to weight gain, inflammation, and increased risk of type 2 diabetes, heart disease, and dental issues.",
        foundIn: "Soft drinks, candy, baked goods, breakfast cereals, flavored yogurts"
      },
      {
        name: "Trans Fats",
        icon: "🍟",
        description: "Created through hydrogenation, which turns liquid oils into solid fats. Listed as 'partially hydrogenated oils' on ingredient lists.",
        goodAmount: "As close to 0g as possible",
        whyBad: "Raises LDL (bad) cholesterol, lowers HDL (good) cholesterol, increases risk of heart disease and stroke.",
        foundIn: "Some fried foods, baked goods, margarine, microwave popcorn"
      },
      {
        name: "Artificial Colors",
        icon: "🎨",
        description: "Synthetic chemicals used to enhance or add color to foods. Examples include Red 40, Yellow 5, and Blue 1.",
        goodAmount: "Best to minimize or avoid",
        whyBad: "May cause hyperactivity in some children; some studies suggest potential links to allergic reactions and behavioral issues.",
        foundIn: "Candy, soda, baked goods, breakfast cereals, sports drinks"
      },
      {
        name: "MSG (Monosodium Glutamate)",
        icon: "🍜",
        description: "Flavor enhancer commonly added to foods to enhance savory or umami taste.",
        goodAmount: "Moderate consumption (no specific limit)",
        whyBad: "Some people report sensitivity with symptoms like headaches, flushing, and sweating, though research is mixed.",
        foundIn: "Processed meats, canned soups, fast food, savory snacks"
      },
      {
        name: "Artificial Sweeteners",
        icon: "🧪",
        description: "Non-nutritive sweeteners used as sugar substitutes. Examples include aspartame, sucralose, and saccharin.",
        goodAmount: "Moderate consumption within acceptable daily intake levels",
        whyBad: "May disrupt gut bacteria and potentially affect glucose metabolism; research on long-term effects is ongoing.",
        foundIn: "Diet sodas, sugar-free desserts, low-calorie products, chewing gum"
      }
    ]
  }
];

const NutrientInfoSheet: React.FC<NutrientInfoSheetProps> = ({
  open,
  onOpenChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  const handleExpandItem = (name: string) => {
    if (expandedItem === name) {
      setExpandedItem(null);
    } else {
      setExpandedItem(name);
    }
  };

  const filteredCategories = nutrientEducation.map(category => {
    const filteredItems = category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      ...category,
      items: filteredItems
    };
  }).filter(category => category.items.length > 0);

  // Helper function to determine if an item is a MacroMicroNutrient
  const isMacroMicroNutrient = (item: NutrientItem): item is MacroMicroNutrientItem => {
    return 'excessRisks' in item && 'deficiencyRisks' in item;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0 flex flex-col">
        <div className="bg-white z-10 p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Nutrition Education</h2>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100">
              <X size={20} />
            </SheetClose>
          </div>

          <div className="relative mt-4">
            <Input
              placeholder="Search nutrients or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-4 px-4">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-lg font-semibold mb-3">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <Card 
                      key={itemIndex}
                      className={`overflow-hidden transition-all ${expandedItem === item.name ? 'border-blue-300' : ''}`}
                      onClick={() => handleExpandItem(item.name)}
                    >
                      <CardContent className="p-0">
                        <div className="p-3">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{item.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                          
                          {expandedItem === item.name && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="mb-2">
                                <span className="text-sm font-semibold">Recommended amount: </span>
                                <span className="text-sm">{item.goodAmount}</span>
                              </div>
                              
                              {isMacroMicroNutrient(item) ? (
                                <>
                                  <div className="mb-2">
                                    <span className="text-sm font-semibold">Risks of excess: </span>
                                    <span className="text-sm">{item.excessRisks}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold">Risks of deficiency: </span>
                                    <span className="text-sm">{item.deficiencyRisks}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="mb-2">
                                    <span className="text-sm font-semibold">Why it's concerning: </span>
                                    <span className="text-sm">{item.whyBad}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold">Commonly found in: </span>
                                    <span className="text-sm">{item.foundIn}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          
                          {expandedItem !== item.name && (
                            <p className="text-xs text-blue-500 mt-1">Tap to learn more</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {categoryIndex < filteredCategories.length - 1 && (
                  <Separator className="my-5" />
                )}
              </div>
            ))}
            
            {filteredCategories.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No matching nutrients found</p>
              </div>
            )}
            
            {/* Add bottom padding for scrolling */}
            <div className="h-4"></div>
          </div>
        </ScrollArea>
        
        <div className="bg-blue-50 p-3 border-t mt-auto">
          <p className="text-sm text-blue-800">
            This information is for educational purposes only. Consult a healthcare professional for personalized nutrition advice.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NutrientInfoSheet;
