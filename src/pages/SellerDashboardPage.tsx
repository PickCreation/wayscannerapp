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
  Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

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
  
  // Get current date for display
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

    // Load profile image from localStorage
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    // Load shop settings from localStorage
    const savedShopSettings = localStorage.getItem('shopSettings');
    if (savedShopSettings) {
      setShopSettings(JSON.parse(savedShopSettings));
    }
  }, [isAuthenticated, navigate, toast]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Seller Dashboard</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Seller info card - Redesigned as per the image */}
      <div className="p-4">
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex">
              {/* Left side - Avatar and joined info */}
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
              
              {/* Right side - Shop info and buttons */}
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

      {/* Dashboard stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <Card className="bg-white">
          <CardContent className="p-3 flex flex-col items-center">
            <h3 className="text-xl font-bold text-wayscanner-blue">$1,243</h3>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-3 flex flex-col items-center">
            <h3 className="text-xl font-bold text-wayscanner-blue">32</h3>
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
            <h3 className="text-xl font-bold text-wayscanner-blue">4.8/5</h3>
            <p className="text-sm text-gray-500">Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard tabs */}
      <div className="px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <OverviewTab onAddNewProduct={handleAddNewProduct} onViewAllProducts={handleViewAllProducts} products={products} onDeleteProduct={handleDeleteProduct} onViewProduct={handleViewProduct} />
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <ProductsTab products={products} onAddNewProduct={handleAddNewProduct} onDeleteProduct={handleDeleteProduct} onViewProduct={handleViewProduct} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-4">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex justify-around">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setActiveTab("overview")} active={activeTab === "overview"} />
        <NavItem icon={<Package size={20} />} label="Products" onClick={() => setActiveTab("products")} active={activeTab === "products"} />
        <NavItem icon={<FileText size={20} />} label="Orders" onClick={() => setActiveTab("orders")} active={activeTab === "orders"} />
        <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => navigate("/seller-dashboard/settings")} active={false} />
      </div>
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

// Tab components
interface OverviewTabProps {
  onAddNewProduct: () => void;
  onViewAllProducts: () => void;
  products: any[];
  onDeleteProduct: (id: string) => void;
  onViewProduct: (id: string) => void;
}

const OverviewTab = ({ onAddNewProduct, onViewAllProducts, products, onDeleteProduct, onViewProduct }: OverviewTabProps) => {
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
      
      <Button 
        className="w-full bg-wayscanner-blue" 
        onClick={onAddNewProduct}
      >
        Add New Product
      </Button>
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
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">My Products ({products.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={onAddNewProduct}
        >
          Add New
        </Button>
      </div>
      
      <div className="space-y-3">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            image={product.image}
            onDelete={onDeleteProduct}
            onView={onViewProduct}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any products yet</p>
          <Button onClick={onAddNewProduct}>Add Your First Product</Button>
        </div>
      )}
    </div>
  );
};

const OrdersTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Recent Orders</h3>
        <select className="text-xs border rounded p-1">
          <option>All Orders</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>
      
      <div className="space-y-3">
        <OrderItem
          orderNumber="2345"
          product="Eco-friendly Water Bottle"
          customer="Sarah Johnson"
          date="Apr 6, 2025"
          status="Processing"
          amount="$24.99"
        />
        <OrderItem
          orderNumber="2344"
          product="Bamboo Cutlery Set"
          customer="Michael Chen"
          date="Apr 5, 2025"
          status="Shipped"
          amount="$19.99"
        />
        <OrderItem
          orderNumber="2343"
          product="Reusable Grocery Bags (3pk)"
          customer="Emily Wilson"
          date="Apr 3, 2025"
          status="Delivered"
          amount="$15.99"
        />
        <OrderItem
          orderNumber="2342"
          product="Solar-Powered Charger"
          customer="James Thompson"
          date="Apr 2, 2025"
          status="Delivered"
          amount="$45.99"
        />
      </div>
      
      <Button variant="outline" className="w-full">
        View All Orders
      </Button>
    </div>
  );
};

// Helper components
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ icon, title, description, time }: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
      <div className="bg-gray-100 p-2 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
};

interface ProductItemProps {
  id: string;
  name: string;
  price: string;
  stock: number;
  image: string;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ProductItem = ({ id, name, price, stock, image, onDelete, onView }: ProductItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
      <img src={image} alt={name} className="w-12 h-12 object-cover rounded" />
      <div className="flex-1">
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-gray-500">
          {price} • {stock} in stock
        </p>
      </div>
      <div className="flex gap-2">
        <button 
          className="text-gray-500 hover:text-blue-500" 
          onClick={() => onView(id)}
        >
          <Eye size={18} />
        </button>
        <button 
          className="text-gray-500 hover:text-red-500" 
          onClick={() => onDelete(id)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

interface OrderItemProps {
  orderNumber: string;
  product: string;
  customer: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  amount: string;
}

const OrderItem = ({ orderNumber, product, customer, date, status, amount }: OrderItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-3 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Order #{orderNumber}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <p className="text-sm">{product}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">{customer} • {date}</p>
        <p className="font-medium">{amount}</p>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
