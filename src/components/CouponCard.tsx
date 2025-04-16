
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, Copy, X } from 'lucide-react';
import { Coupon } from '@/lib/couponService';
import { useToast } from '@/hooks/use-toast';

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code)
      .then(() => {
        setCopied(true);
        toast({
          title: "Code Copied",
          description: `${coupon.code} has been copied to clipboard`,
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        toast({
          title: "Failed to copy",
          description: "Please try copying manually",
          variant: "destructive"
        });
      });
  };
  
  // Generate gradient based on active status
  const gradientClass = coupon.isActive
    ? "bg-gradient-to-r from-black via-blue-950 to-blue-600"
    : "bg-gradient-to-r from-black via-red-950 to-red-600";
  
  return (
    <Card className={`${gradientClass} text-white rounded-xl overflow-hidden p-5 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold">{coupon.merchant}</h3>
        <Badge className={coupon.isActive 
          ? "bg-blue-600 hover:bg-blue-700" 
          : "bg-black hover:bg-black/90"}>
          {coupon.isActive ? (
            <span className="flex items-center">
              <Check size={14} className="mr-1" />
              ACTIVE
            </span>
          ) : (
            <span className="flex items-center">
              <X size={14} className="mr-1" />
              EXPIRED
            </span>
          )}
        </Badge>
      </div>
      
      <h2 className="text-3xl font-extrabold mt-4">{coupon.discount}</h2>
      <p className="text-lg mb-4">{coupon.description}</p>
      
      <div className="w-full h-px bg-white/30 my-4"></div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-white/70">CODE</p>
          <div className="flex items-center">
            <span className="text-xl font-mono font-bold">{coupon.code}</span>
            <button 
              onClick={handleCopyCode} 
              className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/70">
            {coupon.isActive ? 'VALID UNTIL' : 'EXPIRED ON'}
          </p>
          <p className="text-xl font-bold">{formatDate(coupon.validUntil)}</p>
        </div>
      </div>
    </Card>
  );
};

export default CouponCard;
