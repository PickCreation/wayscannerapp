
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  MessageCircle, 
  Check, 
  Send,
  ArrowLeft
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import BottomNavigation from "@/components/BottomNavigation";

interface Message {
  id: number;
  shopName: string;
  message: string;
  date: string;
  isFromBuyer: boolean;
  read: boolean;
}

const MessagesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("received");
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to view your messages",
        variant: "destructive",
      });
      navigate("/profile");
    }
  }, [isAuthenticated, navigate, toast]);

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("sellerMessages") || "[]");
    setMessages(storedMessages);
    
    // Mark messages as read
    if (storedMessages.length > 0) {
      const updatedMessages = storedMessages.map((msg: Message) => ({
        ...msg,
        read: true
      }));
      localStorage.setItem("sellerMessages", JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    }
  }, []);

  // Get unique shop names
  const shops = [...new Set(messages.map(msg => msg.shopName))];

  // Filter messages by selected shop
  const filteredMessages = selectedShop
    ? messages.filter(msg => msg.shopName === selectedShop)
    : messages;

  // Split messages by sent/received
  const receivedMessages = filteredMessages.filter(msg => !msg.isFromBuyer);
  const sentMessages = filteredMessages.filter(msg => msg.isFromBuyer);

  const handleBack = () => {
    navigate("/profile");
  };

  const handleSelectShop = (shop: string) => {
    setSelectedShop(shop === selectedShop ? null : shop);
  };

  const handleSendReply = () => {
    if (!selectedShop || !reply.trim()) {
      toast({
        title: "Cannot send message",
        description: selectedShop ? "Please enter a message" : "Please select a shop first",
        variant: "destructive",
      });
      return;
    }

    const newMessage = {
      id: Date.now(),
      shopName: selectedShop,
      message: reply,
      date: new Date().toISOString(),
      isFromBuyer: true,
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    localStorage.setItem("sellerMessages", JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setReply("");

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedShop}.`,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return "Unknown date";
    }
  };

  const getShopInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
    navigate("/scan");
  };

  // Auto-select a shop if there's a shop query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shopParam = urlParams.get('shop');
    if (shopParam && shops.includes(shopParam)) {
      setSelectedShop(shopParam);
    }
  }, [shops]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-wayscanner-blue text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-4">
          {shops.map(shop => (
            <Button
              key={shop}
              variant={selectedShop === shop ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleSelectShop(shop)}
            >
              {shop}
            </Button>
          ))}
        </div>

        {selectedShop ? (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getShopInitials(selectedShop)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{selectedShop}</h2>
                <p className="text-xs text-gray-500">Conversation</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-2 border rounded-md mb-4">
              {filteredMessages.length > 0 ? (
                filteredMessages
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg max-w-[85%] ${
                        msg.isFromBuyer
                          ? "bg-blue-100 ml-auto"
                          : "bg-gray-100 mr-auto"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className="flex items-center justify-end mt-1 gap-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.date)}
                        </span>
                        {msg.isFromBuyer && (
                          <Check size={12} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No messages with this shop yet</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder={`Write a message to ${selectedShop}...`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSendReply} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="received" className="space-y-4">
              {receivedMessages.length > 0 ? (
                receivedMessages.map(msg => (
                  <Card key={msg.id} className="cursor-pointer" onClick={() => handleSelectShop(msg.shopName)}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getShopInitials(msg.shopName)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-base">{msg.shopName}</CardTitle>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(msg.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm line-clamp-2">{msg.message}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No messages received</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sent" className="space-y-4">
              {sentMessages.length > 0 ? (
                sentMessages.map(msg => (
                  <Card key={msg.id} className="cursor-pointer" onClick={() => handleSelectShop(msg.shopName)}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getShopInitials(msg.shopName)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-base">To: {msg.shopName}</CardTitle>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(msg.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm line-clamp-2">{msg.message}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No messages sent</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default MessagesPage;
