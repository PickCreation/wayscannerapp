import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Purchase {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const samplePurchases: Purchase[] = [
  {
    id: "1",
    orderNumber: "WS-12345",
    date: "2025-04-01",
    total: 129.99,
    status: "delivered",
    items: [
      {
        id: "item1",
        name: "Eco-friendly Water Bottle",
        quantity: 2,
        price: 24.99,
        image: "/placeholder.svg"
      },
      {
        id: "item2",
        name: "Organic Cotton T-shirt",
        quantity: 1,
        price: 79.99,
        image: "/placeholder.svg"
      }
    ]
  },
  {
    id: "2",
    orderNumber: "WS-12346",
    date: "2025-03-15",
    total: 49.99,
    status: "shipped",
    items: [
      {
        id: "item3",
        name: "Recycled Notebook",
        quantity: 1,
        price: 14.99,
        image: "/placeholder.svg"
      },
      {
        id: "item4",
        name: "Bamboo Toothbrush Set",
        quantity: 1,
        price: 34.99,
        image: "/placeholder.svg"
      }
    ]
  },
  {
    id: "3",
    orderNumber: "WS-12347",
    date: "2025-02-28",
    total: 199.99,
    status: "delivered",
    items: [
      {
        id: "item5",
        name: "Solar Powered Charger",
        quantity: 1,
        price: 199.99,
        image: "/placeholder.svg"
      }
    ]
  }
];

const PurchasesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [purchases] = useState<Purchase[]>(samplePurchases);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("recipes");

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    }
  };

  const handleViewPurchase = (purchaseId: string) => {
    toast({
      title: "Coming Soon",
      description: "Purchase details view is under development."
    });
  };

  const filteredPurchases = activeTab === "all" 
    ? purchases 
    : purchases.filter(purchase => purchase.status === activeTab);

  const getStatusColor = (status: Purchase["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">My Purchases</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max border-b bg-transparent p-0">
              <TabsTrigger value="all" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">All</TabsTrigger>
              <TabsTrigger value="pending" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Pending</TabsTrigger>
              <TabsTrigger value="processing" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Processing</TabsTrigger>
              <TabsTrigger value="shipped" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Shipped</TabsTrigger>
              <TabsTrigger value="delivered" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Cancelled</TabsTrigger>
            </TabsList>
          </ScrollArea>
        </Tabs>

        {filteredPurchases.length > 0 ? (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div 
                key={purchase.id} 
                className="border rounded-lg overflow-hidden"
                onClick={() => handleViewPurchase(purchase.id)}
              >
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order #{purchase.orderNumber}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm">{formatDate(purchase.date)}</p>
                    </div>
                  </div>
                  <div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="flex items-center py-2">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Total: ${purchase.total.toFixed(2)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-wayscanner-blue flex items-center"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-gray-600 font-medium">No Purchases Yet</h3>
            <p className="text-gray-500 text-sm">Once you make purchases, they will appear here</p>
            <Button 
              className="mt-4 bg-wayscanner-blue"
              onClick={() => navigate("/marketplace")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={() => {}}
      />
    </div>
  );
};

export default PurchasesPage;
