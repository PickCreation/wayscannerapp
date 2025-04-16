
import React, { useState } from "react";
import { Copy, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Coupon } from "@/lib/couponService";

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast({
      title: "Code Copied!",
      description: `${coupon.code} has been copied to clipboard`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return format(date, "MMM d, yyyy");
  };

  return (
    <div 
      className={`rounded-2xl p-5 my-3 relative overflow-hidden ${
        coupon.isActive 
          ? "bg-gradient-to-r from-black to-blue-900 text-white" 
          : "bg-gradient-to-r from-black to-red-900 text-white"
      }`}
    >
      <div className="absolute top-4 right-4">
        {coupon.isActive ? (
          <Badge className="bg-blue-600 text-white font-semibold px-5 py-1 text-sm">
            ACTIVE
          </Badge>
        ) : (
          <Badge className="bg-black text-white font-semibold px-4 py-1 text-sm">
            EXPIRED
          </Badge>
        )}
      </div>

      <h3 className="text-xl font-bold mb-0">{coupon.store}</h3>
      <h2 className="text-3xl font-bold my-2">{coupon.discount}</h2>
      <p className="mb-5">{coupon.description}</p>

      <div className="border-t border-gray-600 pt-4 mt-2 flex justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">CODE</p>
          <div className="flex items-center">
            <p className="font-bold">{coupon.code}</p>
            <button 
              onClick={handleCopyCode} 
              className="ml-2 p-1 text-white hover:text-blue-300 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300 mb-1">
            {coupon.isActive ? "VALID UNTIL" : "EXPIRED ON"}
          </p>
          <div className="flex items-center justify-end">
            <Calendar size={16} className="mr-1" />
            <p className="font-bold">{formatDate(coupon.validUntil)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
