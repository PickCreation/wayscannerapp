
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import AddressForm from "@/components/AddressForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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

const AddressesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([
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
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
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

  const handleAddAddress = () => {
    setCurrentAddress(null);
    setShowAddForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setShowEditForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    toast({
      title: "Address Deleted",
      description: "Your address has been deleted successfully."
    });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated."
    });
  };

  const handleSaveAddress = (address: Omit<Address, "id" | "isDefault">) => {
    if (currentAddress) {
      // Edit existing address
      setAddresses(addresses.map(a => 
        a.id === currentAddress.id 
          ? { ...a, ...address } 
          : a
      ));
      setShowEditForm(false);
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully."
      });
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...address,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
      setShowAddForm(false);
      toast({
        title: "Address Added",
        description: "Your new address has been added successfully."
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">My Addresses</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Button 
          onClick={handleAddAddress}
          className="w-full bg-wayscanner-blue mb-6 py-6 rounded-lg flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          <span className="font-semibold">Add New Address</span>
        </Button>

        {addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className="border rounded-lg p-4 relative"
              >
                {address.isDefault && (
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Default
                  </div>
                )}
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 text-wayscanner-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">{address.name}</h3>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-xs"
                    >
                      Set as Default
                    </Button>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="text-xs flex items-center"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-xs flex items-center text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-gray-600 font-medium">No Addresses Yet</h3>
            <p className="text-gray-500 text-sm">Add an address to manage your shipping preferences</p>
          </div>
        )}
      </div>

      <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
        <SheetContent className="pt-10 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Address</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <AddressForm onSubmit={handleSaveAddress} onCancel={() => setShowAddForm(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showEditForm} onOpenChange={setShowEditForm}>
        <SheetContent className="pt-10 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Address</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {currentAddress && (
              <AddressForm 
                initialValues={currentAddress}
                onSubmit={handleSaveAddress}
                onCancel={() => setShowEditForm(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={() => {}}
      />
    </div>
  );
};

export default AddressesPage;
