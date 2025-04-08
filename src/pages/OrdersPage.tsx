
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, ChevronRight, ExternalLink, Search, Clock, CheckCircle, Truck, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  isPaid: boolean;
  shippingDeadline: string;
  escrowStatus: "held" | "released" | "refunded";
  trackingNumber?: string;
  trackingUrl?: string;
  seller?: string;
}

const sampleOrders: Order[] = [
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
    ],
    isPaid: true,
    shippingDeadline: "2025-04-06",
    escrowStatus: "released",
    trackingNumber: "USPS12345678",
    trackingUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels=",
    seller: "EcoStore"
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
    ],
    isPaid: true,
    shippingDeadline: "2025-03-20",
    escrowStatus: "held",
    trackingNumber: "FEDEX87654321",
    trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=",
    seller: "BambooLife"
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
    ],
    isPaid: true,
    shippingDeadline: "2025-03-05",
    escrowStatus: "released",
    seller: "GreenTech"
  },
  {
    id: "4",
    orderNumber: "WS-12348",
    date: "2025-02-15",
    total: 89.99,
    status: "pending",
    items: [
      {
        id: "item6",
        name: "Recycled Plastic Backpack",
        quantity: 1,
        price: 89.99,
        image: "/placeholder.svg"
      }
    ],
    isPaid: true,
    shippingDeadline: "2025-02-20",
    escrowStatus: "held",
    seller: "EcoFashion"
  }
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    // Load saved orders from localStorage if they exist
    const savedOrders = localStorage.getItem('buyerOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    
    // Check for auto-cancellation of orders past their deadline
    const now = new Date();
    const updatedOrders = orders.map(order => {
      const deadline = new Date(order.shippingDeadline);
      if (order.status === "pending" && now > deadline) {
        // Auto-cancel the order and mark as refunded
        return {
          ...order,
          status: "cancelled",
          escrowStatus: "refunded"
        };
      }
      return order;
    });
    
    if (JSON.stringify(updatedOrders) !== JSON.stringify(orders)) {
      setOrders(updatedOrders);
      localStorage.setItem('buyerOrders', JSON.stringify(updatedOrders));
      
      toast({
        title: "Orders Auto-Cancelled",
        description: "Some orders past their shipping deadline have been automatically cancelled and refunded.",
        variant: "destructive"
      });
    }
  }, []);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    } else if (item === "profile") {
      navigate("/profile");
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "Coming Soon",
      description: "Order details view is under development."
    });
  };
  
  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelDialog(true);
  };
  
  const confirmCancelOrder = () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }
    
    const updatedOrders = orders.map(order => 
      order.id === selectedOrderId 
        ? { ...order, status: "cancelled", escrowStatus: "refunded" } 
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('buyerOrders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled and a refund has been initiated.",
    });
    
    setShowCancelDialog(false);
  };

  const filteredOrders = orders
    .filter(order => {
      // Filter by search query
      if (searchQuery) {
        return (
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      return true;
    })
    .filter(order => {
      // Filter by tab
      return activeTab === "all" ? true : order.status === activeTab;
    });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
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
  
  const getShippingDeadlineStatus = (order: Order) => {
    // If already shipped or delivered, no need to show deadline
    if (order.status === "shipped" || order.status === "delivered" || order.status === "cancelled") {
      return null;
    }
    
    const deadlineDate = new Date(order.shippingDeadline);
    const currentDate = new Date();
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        label: "Shipping overdue",
        color: "text-red-600",
        progress: 100
      };
    } else if (diffDays === 0) {
      return {
        label: "Shipping due today",
        color: "text-orange-600",
        progress: 80
      };
    } else if (diffDays <= 2) {
      return {
        label: `${diffDays} day${diffDays !== 1 ? 's' : ''} until shipping deadline`,
        color: "text-orange-600",
        progress: 60
      };
    } else {
      return {
        label: `Seller has ${diffDays} days to ship`,
        color: "text-blue-600",
        progress: 30
      };
    }
  };
  
  const getEscrowStatus = (order: Order) => {
    switch (order.escrowStatus) {
      case "held":
        return {
          label: "Payment in escrow",
          description: "Will be released to seller after shipping",
          icon: <Clock className="h-4 w-4 text-blue-500" />
        };
      case "released":
        return {
          label: "Payment released to seller",
          description: "Transaction complete",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        };
      case "refunded":
        return {
          label: "Payment refunded",
          description: "Transaction cancelled",
          icon: <ArrowLeft className="h-4 w-4 text-red-500" />
        };
      default:
        return null;
    }
  };
  
  const getTrackingUrl = (order: Order) => {
    if (order.trackingNumber && order.trackingUrl) {
      return `${order.trackingUrl}${order.trackingNumber}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">My Orders</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-24">
        <div className="mb-4 relative">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max border-b bg-transparent p-0">
              <TabsTrigger value="all" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">All</TabsTrigger>
              <TabsTrigger value="pending" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Pending</TabsTrigger>
              <TabsTrigger value="shipped" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Shipped</TabsTrigger>
              <TabsTrigger value="delivered" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-wayscanner-blue">Cancelled</TabsTrigger>
            </TabsList>
          </ScrollArea>
        </Tabs>

        <div className="overflow-y-auto pb-16">
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="border rounded-lg overflow-hidden"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Seller: {order.seller || "Unknown Seller"}
                    </p>
                    
                    {order.items.map((item) => (
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
                    
                    {/* Tracking Number Section */}
                    {order.trackingNumber && (
                      <div className="mb-3 bg-blue-50 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 text-blue-500 mr-2" />
                            <div>
                              <p className="text-xs font-medium text-blue-700">Tracking: {order.trackingNumber}</p>
                            </div>
                          </div>
                          {getTrackingUrl(order) && (
                            <a 
                              href={getTrackingUrl(order) || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-blue-600 flex items-center hover:underline"
                            >
                              Track <ExternalLink size={12} className="ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Shipping Deadline Section */}
                    {getShippingDeadlineStatus(order) && (
                      <div className="mb-3 bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center mb-1">
                          <Truck className="h-4 w-4 mr-1" />
                          <p className={`text-xs font-medium ${getShippingDeadlineStatus(order)?.color}`}>
                            {getShippingDeadlineStatus(order)?.label}
                          </p>
                        </div>
                        <Progress 
                          value={getShippingDeadlineStatus(order)?.progress} 
                          className="h-1.5" 
                        />
                      </div>
                    )}
                    
                    {/* Escrow Status Section */}
                    {getEscrowStatus(order) && (
                      <div className="mb-3 bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          {getEscrowStatus(order)?.icon}
                          <div className="ml-2">
                            <p className="text-xs font-medium">{getEscrowStatus(order)?.label}</p>
                            <p className="text-xs text-gray-500">{getEscrowStatus(order)?.description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order.id);
                            }}
                          >
                            <XCircle size={14} className="mr-1" /> Cancel
                          </Button>
                        )}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-gray-600 font-medium">No Orders Found</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery 
                  ? "We couldn't find any orders matching your search."
                  : "You haven't placed any orders yet."}
              </p>
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
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? You will receive a full refund.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Cancellation Reason</label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep Order</Button>
            </DialogClose>
            <Button onClick={confirmCancelOrder} variant="destructive">Cancel Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default OrdersPage;
