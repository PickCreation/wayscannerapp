import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  LayoutDashboard,
  Store,
  CreditCard,
  Package,
  FileText,
  Settings,
  BarChart3,
  Users,
  MessageSquare,
  ChevronRight,
  Bell,
  Trash2,
  Eye,
  DollarSign,
  AlertTriangle,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Eco-friendly Water Bottle",
      price: "$24.99",
      stock: 15,
      image: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Bamboo Cutlery Set",
      price: "$19.99",
      stock: 8,
      image: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Reusable Grocery Bags (3pk)",
      price: "$15.99",
      stock: 22,
      image: "/placeholder.svg"
    },
    {
      id: "4",
      name: "Solar-Powered Charger",
      price: "$45.99",
      stock: 4,
      image: "/placeholder.svg"
    }
  ]);
  const [shopSettings, setShopSettings] = useState({
    shopName: "My Eco Shop",
    shopDescription: "Selling eco-friendly products for a sustainable lifestyle."
  });
  const [sellerMessages, setSellerMessages] = useState<any[]>([]);
  const [salesData, setSalesData] = useState({
    totalEarnings: 1243,
    ordersCount: 32,
    rating: 4.8,
    followers: 0,
    salesCount: 0,
    reviewCount: 0
  });
  const [escrowBalance, setEscrowBalance] = useState({
    pendingBalance: 450,
    availableBalance: 793
  });
  const [orders, setOrders] = useState([
    {
      id: "2345",
      orderNumber: "WS-2345",
      product: "Eco-friendly Water Bottle",
      customer: "Sarah Johnson",
      date: new Date("2025-04-06"),
      status: "Processing",
      amount: 24.99,
      shippingDeadline: new Date(new Date("2025-04-06").getTime() + (5 * 24 * 60 * 60 * 1000)),
      isPastDeadline: false,
      trackingNumber: "",
      trackingUrl: ""
    },
    {
      id: "2344",
      orderNumber: "WS-2344",
      product: "Bamboo Cutlery Set",
      customer: "Michael Chen",
      date: new Date("2025-04-05"),
      status: "Shipped",
      amount: 19.99,
      shippingDeadline: new Date(new Date("2025-04-05").getTime() + (5 * 24 * 60 * 60 * 1000)),
      isPastDeadline: false,
      trackingNumber: "USPS12345678",
      trackingUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels="
    },
    {
      id: "2343",
      orderNumber: "WS-2343",
      product: "Reusable Grocery Bags (3pk)",
      customer: "Emily Wilson",
      date: new Date("2025-04-03"),
      status: "Delivered",
      amount: 15.99,
      shippingDeadline: new Date(new Date("2025-04-03").getTime() + (5 * 24 * 60 * 60 * 1000)),
      isPastDeadline: false,
      trackingNumber: "FEDEX87654321",
      trackingUrl: "https://www.fedex.com/fedextrack/?trknbr="
    },
    {
      id: "2342",
      orderNumber: "WS-2342",
      product: "Solar-Powered Charger",
      customer: "James Thompson",
      date: new Date("2025-04-02"),
      status: "Delivered",
      amount: 45.99,
      shippingDeadline: new Date(new Date("2025-04-02").getTime() + (5 * 24 * 60 * 60 * 1000)),
      isPastDeadline: false,
      trackingNumber: "UPS98765432",
      trackingUrl: "https://www.ups.com/track?tracknum="
    }
  ]);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingCarrierInput, setTrackingCarrierInput] = useState("usps");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  
  const carrierOptions = [
    // North America
    { id: "usps", name: "USPS (USA)", url: "https://tools.usps.com/go/TrackConfirmAction?tLabels=", continent: "North America" },
    { id: "fedex", name: "FedEx (USA)", url: "https://www.fedex.com/fedextrack/?trknbr=", continent: "North America" },
    { id: "ups", name: "UPS (USA)", url: "https://www.ups.com/track?tracknum=", continent: "North America" },
    { id: "canadapost", name: "Canada Post", url: "https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=", continent: "North America" },
    { id: "purolator", name: "Purolator (Canada)", url: "https://www.purolator.com/en/shipping/tracker?pin=", continent: "North America" },
    { id: "mexicopost", name: "Correos de México", url: "https://www.correosdemexico.com.mx/Paginas/GuiaRastreo.aspx?numero=", continent: "North America" },
    
    // South America
    { id: "correiosb", name: "Correios (Brazil)", url: "https://www2.correios.com.br/sistemas/rastreamento/default.cfm?objetos=", continent: "South America" },
    { id: "correoarg", name: "Correo Argentino", url: "https://www.correoargentino.com.ar/formularios/e-pack?tracking_id=", continent: "South America" },
    { id: "serpost", name: "Serpost (Peru)", url: "https://www.serpost.com.pe/tracking?numero=", continent: "South America" },
    
    // Europe
    { id: "royalmail", name: "Royal Mail (UK)", url: "https://www.royalmail.com/track-your-item#/tracking-results/", continent: "Europe" },
    { id: "dhl", name: "DHL (Germany)", url: "https://www.dhl.com/en/express/tracking.html?AWB=", continent: "Europe" },
    { id: "laposte", name: "La Poste (France)", url: "https://www.laposte.fr/outils/suivre-vos-envois?code=", continent: "Europe" },
    { id: "posteitaliane", name: "Poste Italiane", url: "https://www.poste.it/cerca/index.html#/risultati-spedizioni/", continent: "Europe" },
    
    // Asia
    { id: "japanpost", name: "Japan Post", url: "https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=", continent: "Asia" },
    { id: "chinapost", name: "China Post", url: "https://track-chinapost.com/?p=", continent: "Asia" },
    { id: "singpost", name: "Singapore Post", url: "https://www.singpost.com/track-items?item_number=", continent: "Asia" },
    { id: "indiapost", name: "India Post", url: "https://www.indiapost.gov.in/vas/Pages/trackingMobile.aspx?prid=", continent: "Asia" },
    
    // Africa
    { id: "sapost", name: "South African Post", url: "https://tracking.postoffice.co.za/TrackNTrace/TrackNTrace.aspx?id=", continent: "Africa" },
    { id: "egyptpost", name: "Egypt Post", url: "https://egyptpost.org/en/track-and-trace?code=", continent: "Africa" },
    { id: "nigeriapost", name: "Nigeria Post (NIPOST)", url: "https://www.nipost.gov.ng/Track_Trace?trackingNumber=", continent: "Africa" },
    
    // Oceania
    { id: "auspost", name: "Australia Post", url: "https://auspost.com.au/mypost/track/#/details/", continent: "Oceania" },
    { id: "nzpost", name: "New Zealand Post", url: "https://www.nzpost.co.nz/tools/tracking/item/", continent: "Oceania" },
    { id: "fijpost", name: "Post Fiji", url: "https://www.postfiji.com.fj/track-trace/?tracking-number=", continent: "Oceania" },
    
    // International
    { id: "dhlexpress", name: "DHL Express (International)", url: "https://www.dhl.com/en/express/tracking.html?AWB=", continent: "International" },
    { id: "fedexint", name: "FedEx International", url: "https://www.fedex.com/fedextrack/?trknbr=", continent: "International" },
    { id: "upsint", name: "UPS International", url: "https://www.ups.com/track?tracknum=", continent: "International" },
  ];
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access your seller dashboard",
      });
      navigate("/profile");
    }

    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    const savedShopSettings = localStorage.getItem('shopSettings');
    if (savedShopSettings) {
      setShopSettings(JSON.parse(savedShopSettings));
    }

    const messages = JSON.parse(localStorage.getItem("sellerMessages") || "[]");
    if (messages && messages.length > 0) {
      setSellerMessages(messages);
    }
    
    const shopSalesData = JSON.parse(localStorage.getItem('shopSalesData') || '{}');
    if (shopSettings && shopSalesData[shopSettings.shopName]) {
      setSalesData(prev => ({
        ...prev,
        salesCount: shopSalesData[shopSettings.shopName].salesCount || 0,
        reviewCount: shopSalesData[shopSettings.shopName].reviewCount || 0
      }));
    }
    
    const storeFollowers = JSON.parse(localStorage.getItem('storeFollowers') || '{}');
    if (shopSettings && storeFollowers[shopSettings.shopName]) {
      setSalesData(prev => ({
        ...prev,
        followers: storeFollowers[shopSettings.shopName] || 0
      }));
    }
    
    if (shopSettings && shopSettings.shopName && !shopSalesData[shopSettings.shopName]) {
      shopSalesData[shopSettings.shopName] = {
        messageCount: messages.length,
        salesCount: 15,
        reviewCount: 32
      };
      
      localStorage.setItem('shopSalesData', JSON.stringify(shopSalesData));
      
      setSalesData(prev => ({
        ...prev,
        salesCount: 15,
        reviewCount: 32
      }));
    }
    
    if (user) {
      const userProfileStats = JSON.parse(localStorage.getItem('userProfileStats') || '{}');
      if (!userProfileStats[user.id]) {
        userProfileStats[user.id] = {
          followers: storeFollowers[shopSettings.shopName] || 0,
          sales: shopSalesData[shopSettings.shopName]?.salesCount || 15,
          reviews: shopSalesData[shopSettings.shopName]?.reviewCount || 32
        };
        
        localStorage.setItem('userProfileStats', JSON.stringify(userProfileStats));
      }
    }
    
    // Check for shipping deadlines
    const updatedOrders = orders.map(order => {
      const now = new Date();
      const isPastDeadline = order.status === "Processing" && now > order.shippingDeadline;
      return { ...order, isPastDeadline };
    });
    setOrders(updatedOrders);
    
    // Load escrow balance data
    const savedEscrowBalance = localStorage.getItem('escrowBalance');
    if (savedEscrowBalance) {
      setEscrowBalance(JSON.parse(savedEscrowBalance));
    } else {
      // Initialize with default values if not found
      const defaultBalance = {
        pendingBalance: 450,
        availableBalance: 793
      };
      localStorage.setItem('escrowBalance', JSON.stringify(defaultBalance));
    }
    
    // Check for orders past deadline - auto cancel them
    const now = new Date();
    const ordersToUpdate = updatedOrders.map(order => {
      if (order.status === "Processing" && now > order.shippingDeadline) {
        // Auto-cancel the order and refund
        return {
          ...order,
          status: "Cancelled",
          isPastDeadline: false
        };
      }
      return order;
    });
    
    if (JSON.stringify(ordersToUpdate) !== JSON.stringify(updatedOrders)) {
      setOrders(ordersToUpdate);
      
      // Update escrow balance when orders are auto-cancelled
      const newBalance = { ...escrowBalance };
      ordersToUpdate.forEach((order, index) => {
        if (order.status === "Cancelled" && updatedOrders[index].status === "Processing") {
          newBalance.pendingBalance -= order.amount;
        }
      });
      
      setEscrowBalance(newBalance);
      localStorage.setItem('escrowBalance', JSON.stringify(newBalance));
      
      toast({
        title: "Orders Auto-Cancelled",
        description: "Some orders past their shipping deadline have been automatically cancelled and refunded.",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, navigate, toast, user, shopSettings, orders]);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleAddNewProduct = () => {
    navigate("/add-listing");
  };

  const handleViewAllProducts = () => {
    setActiveTab("products");
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your shop.",
    });
  };

  const handleViewStore = () => {
    navigate(`/store/${user?.id || 'default'}`);
  };

  const handleEditShop = () => {
    navigate("/seller-dashboard/settings");
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/marketplace/product/${productId}`);
  };

  const handleViewAllMessages = () => {
    navigate("/profile/messages");
  };

  const handleViewMessagesTab = () => {
    navigate("/profile/messages");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  const handleWithdrawFunds = () => {
    const paymentMethod = JSON.parse(localStorage.getItem('sellerPaymentMethod') || '{"method": "bank"}');
    
    if (escrowBalance.availableBalance <= 0) {
      toast({
        title: "No funds to withdraw",
        description: "You don't have any available balance to withdraw.",
      });
      return;
    }
    
    toast({
      title: "Withdrawal Initiated",
      description: `$${escrowBalance.availableBalance.toFixed(2)} will be sent to your ${paymentMethod.method} account within 1-3 business days.`,
    });
    
    // Reset available balance after withdrawal
    const newBalance = {
      pendingBalance: escrowBalance.pendingBalance,
      availableBalance: 0
    };
    setEscrowBalance(newBalance);
    localStorage.setItem('escrowBalance', JSON.stringify(newBalance));
  };

  const handleShipOrder = (orderId: string) => {
    // Just mark as shipped without tracking
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "Shipped", isPastDeadline: false } 
        : order
    );
    setOrders(updatedOrders);
    
    // When an order is shipped, move part of its value from pending to available
    const shippedOrder = orders.find(order => order.id === orderId);
    if (shippedOrder) {
      const newBalance = {
        pendingBalance: Math.max(0, escrowBalance.pendingBalance - shippedOrder.amount),
        availableBalance: escrowBalance.availableBalance + shippedOrder.amount
      };
      setEscrowBalance(newBalance);
      localStorage.setItem('escrowBalance', JSON.stringify(newBalance));
    }
    
    toast({
      title: "Order Shipped",
      description: `Order #${orderId} has been marked as shipped.`,
    });
  };
  
  const handleAddTracking = (orderId: string) => {
    setSelectedOrderId(orderId);
    setTrackingInput("");
    setTrackingCarrierInput("usps");
    setShowTrackingDialog(true);
  };
  
  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelDialog(true);
  };
  
  const confirmAddTracking = () => {
    if (!trackingInput.trim()) {
      toast({
        title: "Tracking number required",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }
    
    const selectedCarrier = carrierOptions.find(c => c.id === trackingCarrierInput);
    
    if (!selectedCarrier) {
      toast({
        title: "Invalid carrier",
        description: "Please select a valid shipping carrier",
        variant: "destructive",
      });
      return;
    }
    
    const updatedOrders = orders.map(order => 
      order.id === selectedOrderId 
        ? { 
            ...order, 
            status: "Shipped", 
            isPastDeadline: false,
            trackingNumber: trackingInput,
            trackingUrl: selectedCarrier.url
          } 
        : order
    );
    setOrders(updatedOrders);
    
    // When an order is shipped, move part of its value from pending to available
    const shippedOrder = orders.find(order => order.id === selectedOrderId);
    if (shippedOrder) {
      const newBalance = {
        pendingBalance: Math.max(0, escrowBalance.pendingBalance - shippedOrder.amount),
        availableBalance: escrowBalance.availableBalance + shippedOrder.amount
      };
      setEscrowBalance(newBalance);
      localStorage.setItem('escrowBalance', JSON.stringify(newBalance));
      
      // Save updated orders to localStorage
      localStorage.setItem('sellerOrders', JSON.stringify(updatedOrders));
    }
    
    toast({
      title: "Order Shipped with Tracking",
      description: `Order #${selectedOrderId} has been marked as shipped with tracking information.`,
    });
    
    setShowTrackingDialog(false);
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
    
    const cancelledOrder = orders.find(order => order.id === selectedOrderId);
    
    if (cancelledOrder) {
      // Update order status
      const updatedOrders = orders.map(order => 
        order.id === selectedOrderId 
          ? { ...order, status: "Cancelled" } 
          : order
      );
      setOrders(updatedOrders);
      
      // Refund the order amount from pending balance
      const newBalance = {
        pendingBalance: Math.max(0, escrowBalance.pendingBalance - cancelledOrder.amount),
        availableBalance: escrowBalance.availableBalance
      };
      setEscrowBalance(newBalance);
      localStorage.setItem('escrowBalance', JSON.stringify(newBalance));
      
      // Save updated orders to localStorage
      localStorage.setItem('sellerOrders', JSON.stringify(updatedOrders));
      
      toast({
        title: "Order Cancelled",
        description: `Order #${selectedOrderId} has been cancelled and the buyer has been refunded.`,
      });
    }
    
    setShowCancelDialog(false);
  };

  const handleAddDemoSale = () => {
    setSalesData(prev => ({
      ...prev,
      totalEarnings: prev.totalEarnings + Math.floor(Math.random() * 30) + 10,
      ordersCount: prev.ordersCount + 1,
      salesCount: prev.salesCount + 1
    }));
    
    const shopSalesData = JSON.parse(localStorage.getItem('shopSalesData') || '{}');
    if (!shopSalesData[shopSettings.shopName]) {
      shopSalesData[shopSettings.shopName] = {
        messageCount: sellerMessages.length,
        salesCount: 0,
        reviewCount: 0
      };
    }
    
    shopSalesData[shopSettings.shopName].salesCount = (shopSalesData[shopSettings.shopName].salesCount || 0) + 1;
    localStorage.setItem('shopSalesData', JSON.stringify(shopSalesData));
    
    if (user) {
      const userProfileStats = JSON.parse(localStorage.getItem('userProfileStats') || '{}');
      if (!userProfileStats[user.id]) {
        userProfileStats[user.id] = { followers: 0, sales: 0, reviews: 0 };
      }
      
      userProfileStats[user.id].sales = (userProfileStats[user.id].sales || 0) + 1;
      localStorage.setItem('userProfileStats', JSON.stringify(userProfileStats));
    }
    
    // Add new order
    const newOrderId = String(2345 + orders.length);
    const orderAmount = Math.floor(Math.random() * 30) + 10;
    const newOrder = {
      id: newOrderId,
      orderNumber: `WS-${newOrderId}`,
      product: "New Demo Product",
      customer: "Demo Customer",
      date: new Date(),
      status: "Processing",
      amount: orderAmount,
      shippingDeadline: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)),
      isPastDeadline: false,
      trackingNumber: "",
      trackingUrl: ""
    };
    
    setOrders([newOrder, ...orders]);
    
    // Update escrow balance
    const newBalance = {
      pendingBalance: escrowBalance.pendingBalance + orderAmount,
      availableBalance: escrowBalance.availableBalance
    };
    setEscrowBalance(newBalance);
    localStorage.setItem('escrowBalance', JSON.stringify(newBalance));
    
    toast({
      title: "New Sale!",
      description: "You've made a new sale. Congratulations!",
    });
  };

  const handleAddDemoReview = () => {
    setSalesData(prev => ({
      ...prev,
      reviewCount: prev.reviewCount + 1
    }));
    
    const shopSalesData = JSON.parse(localStorage.getItem('shopSalesData') || '{}');
    if (!shopSalesData[shopSettings.shopName]) {
      shopSalesData[shopSettings.shopName] = {
        messageCount: sellerMessages.length,
        salesCount: 0,
        reviewCount: 0
      };
    }
    
    shopSalesData[shopSettings.shopName].reviewCount = (shopSalesData[shopSettings.shopName].reviewCount || 0) + 1;
    localStorage.setItem('shopSalesData', JSON.stringify(shopSalesData));
    
    if (user) {
      const userProfileStats = JSON.parse(localStorage.getItem('userProfileStats') || '{}');
      if (!userProfileStats[user.id]) {
        userProfileStats[user.id] = { followers: 0, sales: 0, reviews: 0 };
      }
      
      userProfileStats[user.id].reviews = (userProfileStats[user.id].reviews || 0) + 1;
      localStorage.setItem('userProfileStats', JSON.stringify(userProfileStats));
    }
    
    toast({
      title: "New Review!",
      description: "You've received a new 5-star review!",
    });
  };

  const getTrackingUrl = (order: any) => {
    if (order.trackingNumber && order.trackingUrl) {
      return `${order.trackingUrl}${order.trackingNumber}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Seller Dashboard</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <Avatar className="w-20 h-20 border-2 border-wayscanner-blue mb-2">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt="User" />
                  ) : (
                    <AvatarFallback className="bg-wayscanner-blue text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <div className="font-medium">{user?.name || "Admin"}</div>
                  <div className="text-xs text-gray-500 mt-2">Joined: {currentDate}</div>
                  <div className="text-xs text-gray-500">{products.length} Products</div>
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{shopSettings.shopName}</h2>
                <p className="text-gray-600 mb-4">{shopSettings.shopDescription}</p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-center"
                    onClick={handleEditShop}
                  >
                    Edit Shop
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-center"
                    onClick={handleViewStore}
                  >
                    View Store
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <Card className="bg-white">
          <CardContent className="p-3 flex flex-col items-center">
            <h3 className="text-xl font-bold text-wayscanner-blue">${salesData.totalEarnings}</h3>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-3 flex flex-col items-center">
            <h3 className="text-xl font-bold text-wayscanner-blue">{salesData.ordersCount}</h3>
            <p className="text-sm text-gray-500">Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-3 flex flex-col items-center">
            <h3 className="text-xl font-bold text-wayscanner-blue">{products.length}</h3>
            <p className="text-sm text-gray-500">Products</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-3 flex flex-col items-center">
            <h3 className="text-xl font-bold text-wayscanner-blue">{salesData.rating}/5</h3>
            <p className="text-sm text-gray-500">Rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-gray-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="messages" onClick={() => handleViewMessagesTab()}>Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <OverviewTab 
              onAddNewProduct={handleAddNewProduct} 
              onViewAllProducts={handleViewAllProducts} 
              products={products} 
              onDeleteProduct={handleDeleteProduct} 
              onViewProduct={handleViewProduct}
              messages={sellerMessages}
              onViewAllMessages={handleViewAllMessages}
              onAddDemoSale={handleAddDemoSale}
              onAddDemoReview={handleAddDemoReview}
              salesData={salesData}
              escrowBalance={escrowBalance}
              onWithdrawFunds={handleWithdrawFunds}
            />
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <ProductsTab products={products} onAddNewProduct={handleAddNewProduct} onDeleteProduct={handleDeleteProduct} onViewProduct={handleViewProduct} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-4">
            <OrdersTab 
              orders={orders} 
              onShipOrder={handleShipOrder} 
              onAddTracking={handleAddTracking}
              onCancelOrder={handleCancelOrder}
              getTrackingUrl={getTrackingUrl}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Redirecting to messages page...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex justify-around">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setActiveTab("overview")} active={activeTab === "overview"} />
        <NavItem icon={<Package size={20} />} label="Products" onClick={() => setActiveTab("products")} active={activeTab === "products"} />
        <NavItem icon={<FileText size={20} />} label="Orders" onClick={() => setActiveTab("orders")} active={activeTab === "orders"} />
        <NavItem icon={<MessageSquare size={20} />} label="Messages" onClick={handleViewMessagesTab} active={activeTab === "messages"} />
      </div>

      {/* Add Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tracking Information</DialogTitle>
            <DialogDescription>
              Enter tracking details for this order. The buyer will be able to track the package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="carrier" className="text-sm font-medium">Shipping Carrier by Region</label>
              <select 
                id="carrier"
                className="w-full p-2 border rounded-md"
                value={trackingCarrierInput}
                onChange={(e) => setTrackingCarrierInput(e.target.value)}
              >
                <optgroup label="North America">
                  {carrierOptions.filter(c => c.continent === "North America").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
                <optgroup label="South America">
                  {carrierOptions.filter(c => c.continent === "South America").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Europe">
                  {carrierOptions.filter(c => c.continent === "Europe").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Asia">
                  {carrierOptions.filter(c => c.continent === "Asia").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Africa">
                  {carrierOptions.filter(c => c.continent === "Africa").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Oceania">
                  {carrierOptions.filter(c => c.continent === "Oceania").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
                <optgroup label="International">
                  {carrierOptions.filter(c => c.continent === "International").map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="tracking" className="text-sm font-medium">Tracking Number</label>
              <Input
                id="tracking"
                placeholder="Enter tracking number"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmAddTracking} className="bg-wayscanner-blue">Add Tracking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? The customer will receive a full refund.
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
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
}

const NavItem = ({ icon, label, onClick, active }: NavItemProps) => {
  return (
    <button
      className={`flex flex-col items-center ${active ? "text-wayscanner-blue" : "text-gray-500"}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

interface OverviewTabProps {
  onAddNewProduct: () => void;
  onViewAllProducts: () => void;
  products: any[];
  onDeleteProduct: (id: string) => void;
  onViewProduct: (id: string) => void;
  messages: any[];
  onViewAllMessages: () => void;
  onAddDemoSale: () => void;
  onAddDemoReview: () => void;
  salesData: {
    totalEarnings: number;
    ordersCount: number;
    rating: number;
    followers: number;
    salesCount: number;
    reviewCount: number;
  };
  escrowBalance: {
    pendingBalance: number;
    availableBalance: number;
  };
  onWithdrawFunds: () => void;
}

const OverviewTab = ({ 
  onAddNewProduct, 
  onViewAllProducts, 
  products, 
  onDeleteProduct, 
  onViewProduct,
  messages,
  onViewAllMessages,
  onAddDemoSale,
  onAddDemoReview,
  salesData,
  escrowBalance,
  onWithdrawFunds
}: OverviewTabProps) => {
  const recentMessages = messages
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const unreadMessageCount = messages.filter(msg => !msg.read && !msg.isFromBuyer).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem
              icon={<Package className="text-green-500" />}
              title="New Order #2345"
              description="Eco-friendly Water Bottle"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<MessageSquare className="text-blue-500" />}
              title="New Review"
              description="⭐⭐⭐⭐⭐ on Bamboo Cutlery Set"
              time="5 hours ago"
            />
            <ActivityItem
              icon={<CreditCard className="text-purple-500" />}
              title="Payment Received"
              description="$34.99 for Order #2342"
              time="Yesterday"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="w-1/2" onClick={onAddDemoSale}>
              Simulate Sale
            </Button>
            <Button variant="outline" className="w-1/2" onClick={onAddDemoReview}>
              Simulate Review
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Statistics</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-wayscanner-blue">{salesData.followers}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-wayscanner-blue">{salesData.salesCount}</p>
              <p className="text-xs text-gray-500">Sales</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-wayscanner-blue">{salesData.reviewCount}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Escrow Balance card - updated layout with money below labels */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Escrow Balance</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border rounded-lg p-4 bg-yellow-50 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-sm">Pending</span>
              </div>
              <p className="text-yellow-500 font-bold text-xl mt-1">${escrowBalance.pendingBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Funds held in escrow until orders are shipped
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-medium text-sm">Available</span>
              </div>
              <p className="text-green-500 font-bold text-xl mt-1">${escrowBalance.availableBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Ready to withdraw
              </p>
            </div>
          </div>
          <Button 
            variant="default" 
            className="w-full bg-wayscanner-blue" 
            disabled={escrowBalance.availableBalance <= 0}
            onClick={onWithdrawFunds}
          >
            Withdraw Funds
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">My Products</h3>
            <Button variant="outline" size="sm" className="text-xs">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">
                    {product.price} • {product.stock} in stock
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="text-gray-500 hover:text-blue-500"
                    onClick={() => onViewProduct(product.id)}
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onViewAllProducts}
            >
              View All Products
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Performance</h3>
            <select className="text-xs border rounded p-1">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
            <p className="text-gray-500 text-sm">Sales chart will appear here</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <h3 className="font-bold text-lg">Recent Messages</h3>
              {unreadMessageCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadMessageCount} new
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={onViewAllMessages}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <MessageSquare className={msg.read ? "text-blue-500" : "text-red-500"} size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className={`font-medium ${!msg.read && !msg.isFromBuyer ? "text-black" : "text-gray-700"}`}>
                        {msg.isFromBuyer ? "Your Reply" : "From Customer"}
                      </h4>
                      <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm ${!msg.read && !msg.isFromBuyer ? "text-black font-medium" : "text-gray-500"} line-clamp-1`}>{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent messages</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ icon, title, description, time }: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-gray-100 p-2 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{title}</h4>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

interface ProductsTabProps {
  products: any[];
  onAddNewProduct: () => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct: (id: string) => void;
}

const ProductsTab = ({ products, onAddNewProduct, onDeleteProduct, onViewProduct }: ProductsTabProps) => {
  return (
    <div className="space-y-4">
      <Button 
        className="w-full bg-wayscanner-blue"
        onClick={onAddNewProduct}
      >
        Add New Product
      </Button>
      
      {products.length > 0 ? (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500 mt-1">Price: {product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-blue-500"
                  onClick={() => onViewProduct(product.id)}
                >
                  <Eye size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => onDeleteProduct(product.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-gray-600 font-medium mb-1">No Products Yet</h3>
          <p className="text-gray-500 text-sm">Start adding products to your shop</p>
        </div>
      )}
    </div>
  );
};

interface OrdersTabProps {
  orders: any[];
  onShipOrder: (id: string) => void;
  onAddTracking: (id: string) => void;
  onCancelOrder: (id: string) => void;
  getTrackingUrl: (order: any) => string | null;
}

const OrdersTab = ({ orders, onShipOrder, onAddTracking, onCancelOrder, getTrackingUrl }: OrdersTabProps) => {
  const getStatusColor = (status: string, isPastDeadline: boolean) => {
    if (isPastDeadline) return "bg-red-100 text-red-800";
    
    switch (status) {
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg bg-white overflow-hidden">
              <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, order.isPastDeadline)}`}>
                  {order.isPastDeadline ? "Ship Now!" : order.status}
                </div>
              </div>
              
              <div className="p-3">
                <div className="mb-3">
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-gray-500">Customer: {order.customer}</p>
                  <p className="text-sm font-medium mt-1">${order.amount.toFixed(2)}</p>
                </div>
                
                {order.trackingNumber && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-blue-500 mr-2" />
                        <p className="text-xs text-blue-700 font-medium">
                          Tracking: {order.trackingNumber}
                        </p>
                      </div>
                      <a 
                        href={getTrackingUrl(order)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:underline"
                      >
                        Track <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>
                )}
                
                {order.status === "Processing" && (
                  <div className="mb-3">
                    {order.isPastDeadline ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <p className="text-xs text-red-700 font-medium">Shipping deadline passed!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                          <p className="text-xs text-yellow-700 font-medium">
                            Ship by: {formatDate(order.shippingDeadline)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full bg-wayscanner-blue flex items-center justify-center"
                        onClick={() => onAddTracking(order.id)}
                      >
                        <Truck size={14} className="mr-1" /> Add Tracking
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onCancelOrder(order.id)}
                      >
                        <XCircle size={14} className="mr-1" /> Cancel Order
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-gray-600 font-medium mb-1">No Orders Yet</h3>
          <p className="text-gray-500 text-sm">Orders will appear here once customers make purchases</p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
