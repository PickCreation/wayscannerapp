import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CreditCard, MapPin, Package, 
  Check, Edit2, Plus, ChevronRight, ShoppingBag,
  CircleDollarSign, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import AddressForm from "@/components/AddressForm";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import { useAuth } from "@/hooks/use-auth";
import { getCartItems, placeOrder, CartItem } from "@/lib/cartService";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      return JSON.parse(savedAddresses);
    }
    return [
      {
        id: "1",
        name: "Home",
        street: "123 Main St",
        city: "San Francisco",
        state: "California",
        zipCode: "94105",
        country: "United States",
        phone: "+1 (555) 123-4567",
        isDefault: true
      }
    ];
  });
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const savedPaymentMethods = localStorage.getItem('userPaymentMethods');
    if (savedPaymentMethods) {
      return JSON.parse(savedPaymentMethods);
    }
    return [
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
    ];
  });
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [currentPaymentType, setCurrentPaymentType] = useState<"card" | "paypal" | "payoneer">("card");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to checkout",
        variant: "destructive"
      });
      navigate("/cart");
      return;
    }

    const loadCartItems = async () => {
      try {
        if (user) {
          const items = await getCartItems(user.id);
          setCartItems(items);
        } else {
          const storedItems = localStorage.getItem('cartItems');
          setCartItems(storedItems ? JSON.parse(storedItems) : []);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive"
        });
      }
    };

    loadCartItems();
  }, [isAuthenticated, user, navigate, toast]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === "standard" ? 4.99 : 12.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handleBackClick = () => {
    if (currentStep === "shipping") {
      navigate("/cart");
    } else if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else {
      setCurrentStep("payment");
    }
  };

  const handleContinueClick = () => {
    if (currentStep === "shipping") {
      if (!selectedAddress) {
        toast({
          title: "Shipping Address Required",
          description: "Please select or add a shipping address to continue.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (!selectedPayment) {
        toast({
          title: "Payment Method Required",
          description: "Please select or add a payment method to continue.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep("review");
    }
  };

  const handleAddAddress = () => {
    setShowAddAddressForm(true);
  };

  const handleAddPayment = (type: "card" | "paypal" | "payoneer") => {
    setCurrentPaymentType(type);
    setShowAddPaymentForm(true);
  };

  const handleSaveAddress = (address: Omit<Address, "id" | "isDefault">) => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...address,
      isDefault: addresses.length === 0
    };
    
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    setSelectedAddress(newAddress);
    setShowAddAddressForm(false);
    
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully."
    });
  };

  const handleSavePaymentMethod = (paymentMethod: any) => {
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: currentPaymentType,
      isDefault: paymentMethods.length === 0,
      ...paymentMethod
    };
    
    const updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
    setPaymentMethods(updatedPaymentMethods);
    setSelectedPayment(newPaymentMethod);
    setShowAddPaymentForm(false);
    
    localStorage.setItem('userPaymentMethods', JSON.stringify(updatedPaymentMethods));
    
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully."
    });
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAddress || !selectedPayment) {
      toast({
        title: "Missing Information",
        description: "Please select both shipping address and payment method",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: cartItems,
        shippingAddress: {
          name: selectedAddress.name,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone
        },
        paymentMethod: {
          type: selectedPayment.type,
          details: selectedPayment.type === 'card' 
            ? selectedPayment.cardInfo 
            : selectedPayment.type === 'paypal' 
              ? selectedPayment.paypalInfo
              : selectedPayment.payoneerInfo
        },
        shippingMethod,
        shippingCost,
        subtotal,
        tax,
        total,
        status: 'pending' as const,
        createdAt: new Date()
      };

      const orderId = await placeOrder(user.id, orderData);

      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });

      window.dispatchEvent(new Event('cartUpdated'));

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentMethodCard = (method: PaymentMethod) => {
    if (method.type === "card" && method.cardInfo) {
      return (
        <div className="flex items-center">
          <div className="rounded-md bg-white p-1 mr-3">
            <CreditCard className="h-5 w-5 text-wayscanner-blue" />
          </div>
          <div>
            <p className="font-medium">
              {method.cardInfo.cardType.charAt(0).toUpperCase() + method.cardInfo.cardType.slice(1)} •••• {method.cardInfo.last4}
            </p>
            <p className="text-sm text-gray-500">Expires {method.cardInfo.expiry}</p>
          </div>
        </div>
      );
    } else if (method.type === "paypal" && method.paypalInfo) {
      return (
        <div className="flex items-center">
          <div className="rounded-md bg-white p-1 mr-3">
            <CircleDollarSign className="h-5 w-5 text-[#0070BA]" />
          </div>
          <div>
            <p className="font-medium">PayPal</p>
            <p className="text-sm text-gray-500">{method.paypalInfo.email}</p>
          </div>
        </div>
      );
    } else if (method.type === "payoneer" && method.payoneerInfo) {
      return (
        <div className="flex items-center">
          <div className="rounded-md bg-white p-1 mr-3">
            <DollarSign className="h-5 w-5 text-[#FF4800]" />
          </div>
          <div>
            <p className="font-medium">Payoneer</p>
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
          <h1 className="text-base font-bold">Checkout</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="flex justify-between mb-6">
          <div 
            className={`flex flex-col items-center ${
              currentStep === "shipping" ? 'text-wayscanner-blue' : 
              currentStep === "payment" || currentStep === "review" ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${
              currentStep === "payment" || currentStep === "review" ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
            }`}>
              {currentStep === "payment" || currentStep === "review" ? <Check size={16} /> : "1"}
            </div>
            <span className="text-xs mt-1">Shipping</span>
          </div>
          <div className={`flex-1 border-t-2 self-start mt-4 mx-2 ${
            currentStep === "payment" || currentStep === "review" ? 'border-green-500' : 'border-gray-300'
          }`}></div>
          <div 
            className={`flex flex-col items-center ${
              currentStep === "payment" ? 'text-wayscanner-blue' : 
              currentStep === "review" ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${
              currentStep === "payment" ? 'border-wayscanner-blue' : 
              currentStep === "review" ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
            }`}>
              {currentStep === "review" ? <Check size={16} /> : "2"}
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
          <div className={`flex-1 border-t-2 self-start mt-4 mx-2 ${
            currentStep === "review" ? 'border-green-500' : 'border-gray-300'
          }`}></div>
          <div 
            className={`flex flex-col items-center ${
              currentStep === "review" ? 'text-wayscanner-blue' : 'text-gray-400'
            }`}
          >
            <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${
              currentStep === "review" ? 'border-wayscanner-blue' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="text-xs mt-1">Review</span>
          </div>
        </div>

        {currentStep === "shipping" && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>

              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-3 flex items-start cursor-pointer transition-all ${
                        selectedAddress?.id === address.id 
                          ? 'border-wayscanner-blue bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className={`rounded-full w-5 h-5 flex-shrink-0 mr-3 border flex items-center justify-center ${
                        selectedAddress?.id === address.id 
                          ? 'border-wayscanner-blue' 
                          : 'border-gray-300'
                      }`}>
                        {selectedAddress?.id === address.id && (
                          <div className="rounded-full w-3 h-3 bg-wayscanner-blue" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{address.name}</h3>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No addresses available</p>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={handleAddAddress}
                className="w-full mt-4 border-dashed border-gray-300 py-2 h-auto"
              >
                <Plus size={18} className="mr-2" />
                Add New Address
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Shipping Method</h2>
              
              <div className="space-y-3">
                <div 
                  className={`border rounded-lg p-3 flex items-start cursor-pointer transition-all ${
                    shippingMethod === 'standard' 
                      ? 'border-wayscanner-blue bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setShippingMethod('standard')}
                >
                  <div className={`rounded-full w-5 h-5 flex-shrink-0 mr-3 border flex items-center justify-center ${
                    shippingMethod === 'standard' 
                      ? 'border-wayscanner-blue' 
                      : 'border-gray-300'
                  }`}>
                    {shippingMethod === 'standard' && (
                      <div className="rounded-full w-3 h-3 bg-wayscanner-blue" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Standard Shipping</h3>
                      <span className="font-medium">$4.99</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Delivery in 5-7 business days</p>
                  </div>
                </div>

                <div 
                  className={`border rounded-lg p-3 flex items-start cursor-pointer transition-all ${
                    shippingMethod === 'express' 
                      ? 'border-wayscanner-blue bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setShippingMethod('express')}
                >
                  <div className={`rounded-full w-5 h-5 flex-shrink-0 mr-3 border flex items-center justify-center ${
                    shippingMethod === 'express' 
                      ? 'border-wayscanner-blue' 
                      : 'border-gray-300'
                  }`}>
                    {shippingMethod === 'express' && (
                      <div className="rounded-full w-3 h-3 bg-wayscanner-blue" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Express Shipping</h3>
                      <span className="font-medium">$12.99</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Delivery in 1-2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-2">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded mr-3" 
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="my-3" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "payment" && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>

              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`border rounded-lg p-3 flex items-start cursor-pointer transition-all ${
                        selectedPayment?.id === method.id 
                          ? 'border-wayscanner-blue bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment(method)}
                    >
                      <div className={`rounded-full w-5 h-5 flex-shrink-0 mr-3 border flex items-center justify-center ${
                        selectedPayment?.id === method.id 
                          ? 'border-wayscanner-blue' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment?.id === method.id && (
                          <div className="rounded-full w-3 h-3 bg-wayscanner-blue" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          {renderPaymentMethodCard(method)}
                          {method.isDefault && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No payment methods available</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleAddPayment("card")}
                  className="border-dashed border-gray-300 py-2 h-auto text-xs"
                >
                  <Plus size={14} className="mr-1" />
                  Credit Card
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddPayment("paypal")}
                  className="border-dashed border-gray-300 py-2 h-auto text-xs text-[#0070BA]"
                >
                  <Plus size={14} className="mr-1" />
                  PayPal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddPayment("payoneer")}
                  className="border-dashed border-gray-300 py-2 h-auto text-xs text-[#FF4800]"
                >
                  <Plus size={14} className="mr-1" />
                  Payoneer
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
              
              {selectedAddress && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-wayscanner-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{selectedAddress.name}</h3>
                    <p className="text-sm text-gray-600">{selectedAddress.street}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.country}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto text-wayscanner-blue p-1 h-auto"
                    onClick={() => setCurrentStep("shipping")}
                  >
                    <Edit2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping ({shippingMethod})</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "review" && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Shipping Address</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-wayscanner-blue p-1 h-auto"
                  onClick={() => setCurrentStep("shipping")}
                >
                  <Edit2 size={16} />
                </Button>
              </div>
              
              {selectedAddress && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-wayscanner-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{selectedAddress.name}</h3>
                    <p className="text-sm text-gray-600">{selectedAddress.street}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.country}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Payment Method</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-wayscanner-blue p-1 h-auto"
                  onClick={() => setCurrentStep("payment")}
                >
                  <Edit2 size={16} />
                </Button>
              </div>
              
              {selectedPayment && renderPaymentMethodCard(selectedPayment)}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Shipping Method</h2>
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">
                    {shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {shippingMethod === 'standard' 
                      ? 'Delivery in 5-7 business days' 
                      : 'Delivery in 1-2 business days'}
                  </p>
                </div>
                <p className="font-medium">${shippingCost.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>
              
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-2">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded mr-3" 
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="my-3" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        {currentStep === "review" ? (
          <Button 
            className="w-full bg-wayscanner-blue py-6"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            {isLoading ? "Processing..." : `Place Order • $${total.toFixed(2)}`}
          </Button>
        ) : (
          <Button 
            className="w-full bg-wayscanner-blue py-6"
            onClick={handleContinueClick}
          >
            Continue
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        )}
      </div>

      <Drawer open={showAddAddressForm} onOpenChange={setShowAddAddressForm}>
        <DrawerContent className="px-4">
          <DrawerHeader className="text-left">
            <DrawerTitle>Add New Address</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2 pb-10 overflow-y-auto">
            <AddressForm 
              onSubmit={handleSaveAddress}
              onCancel={() => setShowAddAddressForm(false)} 
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={showAddPaymentForm} onOpenChange={setShowAddPaymentForm}>
        <DrawerContent className="px-4">
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {currentPaymentType === "card" ? "Add Credit Card" : 
               currentPaymentType === "paypal" ? "Add PayPal Account" : 
               "Add Payoneer Account"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2 pb-10 overflow-y-auto">
            <PaymentMethodForm 
              type={currentPaymentType} 
              onSubmit={handleSavePaymentMethod} 
              onCancel={() => setShowAddPaymentForm(false)} 
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CheckoutPage;
