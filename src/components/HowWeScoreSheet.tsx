
import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

interface HowWeScoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowWeScoreSheet: React.FC<HowWeScoreSheetProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-auto">
        <div className="bg-wayscanner-blue text-white py-4 px-4 flex items-center">
          <button 
            onClick={() => onOpenChange(false)}
            className="p-1.5"
          >
            <ChevronLeft className="h-5 w-5" color="white" />
          </button>
          <h1 className="text-[20px] font-medium ml-4">How do we score food?</h1>
        </div>
        
        <div className="p-4 space-y-6 pb-20">
          <p className="text-[15px]">
            We utilize a rigorous, science-based approach, validated by leading health organizations, to evaluate the healthfulness of food. This methodology aligns with the most current nutritional science and uses comprehensive scoring criteria for packaged and processed foods:
          </p>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📦</span>
              <h3 className="text-lg font-semibold">Packaged Foods</h3>
            </div>
            <p className="text-[15px] ml-8">
              We assess their content of energy, saturated fat, sugar, sodium, protein, and fiber.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏭</span>
              <h3 className="text-lg font-semibold">Processed Foods</h3>
            </div>
            <p className="text-[15px] ml-8">
              In addition to the above metrics, we also examine the estimated level of processing, the quality of fiber and protein, fat composition, and glycemic load.
            </p>
          </div>

          <p className="text-[15px]">
            Furthermore, we include the percentage of fruits, vegetables, and nuts in our evaluations.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-3">Scoring Levels</h3>
            <p className="text-[15px] mb-4">
              Each product is rated on a 100-point scale and categorized into one of four groups to signify its overall healthfulness:
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-teal-500 h-6 w-6" />
                <div>
                  <span className="font-semibold">Green (76-100): </span>
                  <span className="font-bold">Excellent</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-yellow-500 h-6 w-6" />
                <div>
                  <span className="font-semibold">Yellow (51-75): </span>
                  <span className="font-bold">Good</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-orange-500 h-6 w-6" />
                <div>
                  <span className="font-semibold">Orange (26-50): </span>
                  <span className="font-bold">Not great</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-red-500 h-6 w-6" />
                <div>
                  <span className="font-semibold">Red (1-25): </span>
                  <span className="font-bold">Bad</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-[15px]">
                  Products lacking essential nutritional information will be marked as "Not scored."
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-[15px]">
                  We do not score alcoholic beverages.
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-[15px]">
                  Our scoring method is designed to enhance your ability to make healthier food choices by
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-[15px]">
                  We maintain neutrality in our assessments, as we do not collaborate with any brands or products, ensuring our scores remain impartial.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Disclaimer</h3>
            <p className="text-[15px] mb-4">
              We operate as a food checker mobile app, and all content and information we offer are intended solely for educational and general informational purposes. Our app is not designed to replace professional health consultations with healthcare providers such as nutritionists or doctors. The content and information provided through our app should not be considered professional advice, diagnosis, or treatment, nor should it substitute for professional healthcare consultations. The information we present is derived from our interpretation of trusted sources, which are listed below:
            </p>
            
            <div className="space-y-3">
              <button className="bg-gray-100 w-full rounded-lg p-4 flex justify-between items-center">
                <span className="font-semibold">The World Health Organization</span>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
              
              <button className="bg-gray-100 w-full rounded-lg p-4 flex justify-between items-center">
                <span className="font-semibold">IARC - Cancer Research</span>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
              
              <button className="bg-gray-100 w-full rounded-lg p-4 flex justify-between items-center">
                <span className="font-semibold">Global Nutrition Guidelines</span>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HowWeScoreSheet;
