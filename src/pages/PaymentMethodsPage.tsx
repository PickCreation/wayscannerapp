import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Plus, Edit, Trash2, CreditCard, 
  CheckCircle2, DollarSign, CircleDollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import CameraSheet from "@/components/CameraSheet";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "payoneer";
  isDefault: boolean;
  cardInfo?: {
    name: string;
    number: string;
    expiry: string;
    last4: string;
    cardType: "visa" | "mastercard" | "amex" | "discover";
  };
  paypalInfo?: {
    email: string;
  };
  payoneerInfo?: {
    email: string;
  };
}

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      isDefault: true,
      cardInfo: {
        name: "John Doe",
        number: "4111111111111111",
        expiry: "12/25",
        last4: "1111",
        cardType: "visa"
      }
    },
    {
      id: "2",
      type: "paypal",
      isDefault: false,
      paypalInfo: {
        email: "johndoe@example.com"
      }
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [currentType, setCurrentType] = useState<"card" | "paypal" | "payoneer">("card");
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

  const handleAddPaymentMethod = (type: "card" | "paypal" | "payoneer") => {
    setCurrentType(type);
    setShowAddForm(true);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast({
      title: "Payment Method Deleted",
      description: "Your payment method has been deleted successfully."
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated."
    });
  };

  const handleSavePaymentMethod = (paymentMethod: any) => {
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: currentType,
      isDefault: paymentMethods.length === 0,
      ...paymentMethod
    };
    
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setShowAddForm(false);
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully."
    });
  };
  
  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  const filteredPaymentMethods = activeTab === "all" 
    ? paymentMethods 
    : paymentMethods.filter(method => method.type === activeTab);

  const renderPaymentMethodCard = (method: PaymentMethod) => {
    if (method.type === "card" && method.cardInfo) {
      return (
        <div className="flex items-center mb-2">
          <div className="rounded-md bg-white p-1 mr-3">
            <CreditCard className="h-5 w-5 text-wayscanner-blue" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {method.cardInfo.cardType.charAt(0).toUpperCase() + method.cardInfo.cardType.slice(1)} •••• {method.cardInfo.last4}
            </p>
            <p className="text-sm text-gray-500">Expires {method.cardInfo.expiry}</p>
            <p className="text-xs text-gray-500">{method.cardInfo.name}</p>
          </div>
        </div>
      );
    } else if (method.type === "paypal" && method.paypalInfo) {
      return (
        <div className="flex items-center mb-2">
          <div className="rounded-md bg-white p-1 mr-3">
            <CircleDollarSign className="h-5 w-5 text-[#0070BA]" />
          </div>
          <div>
            <p className="font-semibold text-sm">PayPal</p>
            <p className="text-sm text-gray-500">{method.paypalInfo.email}</p>
          </div>
        </div>
      );
    } else if (method.type === "payoneer" && method.payoneerInfo) {
      return (
        <div className="flex items-center mb-2">
          <div className="rounded-md bg-white p-1 mr-3">
            <DollarSign className="h-5 w-5 text-[#FF4800]" />
          </div>
          <div>
            <p className="font-semibold text-sm">Payoneer</p>
            <p className="text-sm text-gray-500">{method.payoneerInfo.email}</p>
          </div>
        </div>
      );
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
          <h1 className="text-base font-bold">Payment Methods</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="card">Cards</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="payoneer">Payoneer</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Button 
            onClick={() => handleAddPaymentMethod("card")}
            className="bg-wayscanner-blue py-5 rounded-lg flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            <span className="font-semibold">Add Credit Card</span>
          </Button>
          <Button 
            onClick={() => handleAddPaymentMethod("paypal")}
            className="bg-[#0070BA] py-5 rounded-lg flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            <span className="font-semibold">Add PayPal</span>
          </Button>
          <Button 
            onClick={() => handleAddPaymentMethod("payoneer")}
            className="bg-[#FF4800] py-5 rounded-lg flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            <span className="font-semibold">Add Payoneer</span>
          </Button>
        </div>

        {filteredPaymentMethods.length > 0 ? (
          <div className="space-y-4">
            {filteredPaymentMethods.map((method) => (
              <div 
                key={method.id} 
                className="border rounded-lg p-4 relative"
              >
                {method.isDefault && (
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Default
                  </div>
                )}
                {renderPaymentMethodCard(method)}
                <div className="flex justify-between mt-3">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="text-xs"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-xs flex items-center text-red-500 border-red-200 hover:bg-red-50 ml-auto"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-gray-600 font-medium">No Payment Methods</h3>
            <p className="text-gray-500 text-sm">Add a payment method to make checkout easier</p>
          </div>
        )}
      </div>

      <Drawer open={showAddForm} onOpenChange={setShowAddForm}>
        <DrawerContent className="px-4">
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {currentType === "card" ? "Add Credit Card" : 
               currentType === "paypal" ? "Add PayPal Account" : 
               "Add Payoneer Account"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2 pb-10">
            <PaymentMethodForm type={currentType} onSubmit={handleSavePaymentMethod} onCancel={() => setShowAddForm(false)} />
          </div>
        </DrawerContent>
      </Drawer>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default PaymentMethodsPage;
