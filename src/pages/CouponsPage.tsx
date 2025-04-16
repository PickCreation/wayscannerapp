
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CouponCard from '@/components/CouponCard';
import { Coupon, getCoupons, seedCoupons } from '@/lib/couponService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { BottomNavigation } from '@/components/BottomNavigation';

const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "Failed to load coupons. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Seed coupons first time, then fetch
    seedCoupons().then(fetchCoupons);
  }, []);
  
  const activeCoupons = coupons.filter(coupon => coupon.isActive);
  const expiredCoupons = coupons.filter(coupon => !coupon.isActive);
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-6 mb-16">
        <h1 className="text-2xl font-bold mb-2">My Coupons</h1>
        <p className="text-gray-500 mb-6">View and manage your available discounts</p>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active ({activeCoupons.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expiredCoupons.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading coupons...</p>
              </div>
            ) : activeCoupons.length > 0 ? (
              <div className="grid gap-4">
                {activeCoupons.map(coupon => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No active coupons</h3>
                <p className="text-gray-500 mt-2 mb-4">Check back later for new deals</p>
                <Button onClick={fetchCoupons}>Refresh</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="expired">
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading coupons...</p>
              </div>
            ) : expiredCoupons.length > 0 ? (
              <div className="grid gap-4">
                {expiredCoupons.map(coupon => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No expired coupons</h3>
                <p className="text-gray-500 mt-2">Your coupon history will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </Layout>
  );
};

export default CouponsPage;
