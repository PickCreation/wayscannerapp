
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  MessageCircle, 
  Check, 
  CheckCheck,
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
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  setDoc, 
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Message {
  id: string;
  shopName: string;
  message: string;
  createdAt: any;
  isFromBuyer: boolean;
  read: boolean;
  buyerId?: string;
  buyerName?: string;
  typingIndicator?: boolean;
}

// Sample messages for testing
const getSampleMessages = (): Message[] => [
  {
    id: "1",
    shopName: "Green Valley Organics",
    message: "Hi! Thank you for your interest in our organic vegetables. Do you have any questions about our seasonal produce?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isFromBuyer: false,
    read: false,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "2",
    shopName: "Farm Fresh Dairy",
    message: "Our fresh milk delivery is available every Tuesday and Friday. Would you like to set up a weekly subscription?",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isFromBuyer: false,
    read: true,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "3",
    shopName: "Artisan Bakery Co",
    message: "Hello! Your custom birthday cake order has been confirmed. We'll have it ready for pickup on Saturday at 10 AM.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isFromBuyer: false,
    read: false,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "4",
    shopName: "Green Valley Organics",
    message: "Yes, I'm interested in your organic tomatoes. Are they locally grown? What's the price per pound?",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isFromBuyer: true,
    read: true,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "5",
    shopName: "Farm Fresh Dairy",
    message: "Thank you for the information! I'd like to start with a weekly delivery of 2 gallons of whole milk. How do I proceed?",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isFromBuyer: true,
    read: false,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "6",
    shopName: "Honey Bee Haven",
    message: "Do you have any raw honey available? I'm looking for local honey for my tea.",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isFromBuyer: true,
    read: true,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "7",
    shopName: "Sunset Herbs",
    message: "Hi there! Yes, we have fresh basil, rosemary, and thyme available. Each bunch is $3. Would you like to place an order?",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isFromBuyer: false,
    read: true,
    buyerId: "user123",
    buyerName: "John Doe"
  },
  {
    id: "8",
    shopName: "Mountain View Meat Co",
    message: "Perfect! I'll take 2 lbs of grass-fed ground beef. When can I pick it up?",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isFromBuyer: true,
    read: true,
    buyerId: "user123",
    buyerName: "John Doe"
  }
];

const MessagesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(getSampleMessages());
  const [activeTab, setActiveTab] = useState("received");
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Setup Firestore listeners for messages
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let messagesUnsubscribe: () => void;

    try {
      // Get messages where the current user is the buyer
      const messagesRef = collection(db, "messages");
      const messagesQuery = query(
        messagesRef,
        where("buyerId", "==", user.id),
        orderBy("createdAt", "asc")
      );

      messagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages: Message[] = [];
        snapshot.forEach((doc) => {
          fetchedMessages.push({
            id: doc.id,
            ...(doc.data() as Omit<Message, "id">),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        });
        
        console.log("Fetched messages from Firebase:", fetchedMessages);
        
        // If no Firebase messages, use sample messages
        if (fetchedMessages.length === 0) {
          setMessages(getSampleMessages());
        } else {
          setMessages(fetchedMessages);
        }
        
        // Mark messages as read if shop is selected
        if (selectedShop) {
          fetchedMessages
            .filter(msg => msg.shopName === selectedShop && !msg.isFromBuyer && !msg.read)
            .forEach(msg => {
              updateDoc(doc(db, "messages", msg.id), { read: true });
            });
        }
      }, (error) => {
        console.error("Error fetching messages:", error);
        // Fallback to sample messages
        setMessages(getSampleMessages());
      });

      // Listen for typing indicators
      const typingRef = collection(db, "typingIndicators");
      const typingQuery = query(typingRef, where("buyerId", "==", user.id));
      
      const typingUnsubscribe = onSnapshot(typingQuery, (snapshot) => {
        const typingData: Record<string, boolean> = {};
        snapshot.forEach((doc) => {
          typingData[doc.data().shopName] = doc.data().isTyping;
        });
        setTypingStatus(typingData);
      });

      return () => {
        messagesUnsubscribe?.();
        typingUnsubscribe?.();
      };
    } catch (error) {
      console.error("Error setting up Firebase listeners:", error);
      // Fallback to sample messages
      setMessages(getSampleMessages());
    }
  }, [isAuthenticated, user, selectedShop]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && selectedShop) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedShop]);

  // Handle typing indicator
  useEffect(() => {
    if (!user || !selectedShop) return;

    const handleTyping = async () => {
      if (!isTyping) {
        setIsTyping(true);
        try {
          const typingDocRef = doc(db, "typingIndicators", `${user.id}_${selectedShop}`);
          await setDoc(typingDocRef, {
            buyerId: user.id,
            shopName: selectedShop,
            isTyping: true,
            timestamp: serverTimestamp()
          });
        } catch (error) {
          console.error("Error setting typing indicator:", error);
        }
      }

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(async () => {
        setIsTyping(false);
        try {
          const typingDocRef = doc(db, "typingIndicators", `${user.id}_${selectedShop}`);
          await updateDoc(typingDocRef, {
            isTyping: false,
            timestamp: serverTimestamp()
          });
        } catch (error) {
          console.error("Error clearing typing indicator:", error);
        }
      }, 2000);
    };

    if (reply) {
      handleTyping();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [reply, user, selectedShop, isTyping]);

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

  const handleSelectShop = async (shop: string) => {
    const newSelectedShop = shop === selectedShop ? null : shop;
    setSelectedShop(newSelectedShop);
    
    // Mark messages as read when selecting a shop
    if (newSelectedShop && user) {
      try {
        const unreadMessages = messages.filter(
          msg => msg.shopName === shop && !msg.isFromBuyer && !msg.read
        );
        
        for (const msg of unreadMessages) {
          await updateDoc(doc(db, "messages", msg.id), { read: true });
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
        
        // Fallback to localStorage
        const updatedMessages = messages.map(msg => ({
          ...msg,
          read: msg.shopName === shop ? true : msg.read
        }));
        localStorage.setItem("sellerMessages", JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedShop || !reply.trim() || !user) {
      toast({
        title: "Cannot send message",
        description: selectedShop ? "Please enter a message" : "Please select a shop first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add message to Firebase
      const messagesCollection = collection(db, "messages");
      await addDoc(messagesCollection, {
        shopName: selectedShop,
        message: reply,
        createdAt: serverTimestamp(),
        isFromBuyer: true,
        read: false,
        buyerId: user.id,
        buyerName: user.name,
      });

      // Clear typing indicator
      const typingDocRef = doc(db, "typingIndicators", `${user.id}_${selectedShop}`);
      await updateDoc(typingDocRef, {
        isTyping: false,
        timestamp: serverTimestamp()
      });

      // Update shop sales data
      await updateSalesData(selectedShop);

      setReply("");
      setIsTyping(false);

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedShop}.`,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Fallback to localStorage
      const newMessage = {
        id: Date.now().toString(),
        shopName: selectedShop,
        message: reply,
        createdAt: new Date(),
        isFromBuyer: true,
        read: false,
      };

      const updatedMessages = [...messages, newMessage];
      localStorage.setItem("sellerMessages", JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
      setReply("");

      updateSalesData(selectedShop);

      toast({
        title: "Message sent (offline mode)",
        description: `Your message has been saved locally.`,
      });
    }
  };

  const updateSalesData = async (shopName: string) => {
    try {
      // Update shop sales data in Firebase
      const salesDataRef = doc(db, "shopSalesData", shopName);
      
      // Check if document exists
      const docSnap = await getDoc(salesDataRef);
      
      if (docSnap.exists()) {
        // Update existing document
        await updateDoc(salesDataRef, {
          messageCount: (docSnap.data().messageCount || 0) + 1
        });
      } else {
        // Create new document
        await setDoc(salesDataRef, {
          messageCount: 1,
          salesCount: 0,
          reviewCount: 0
        });
      }
    } catch (error) {
      console.error("Error updating shop sales data:", error);
      
      // Fallback to localStorage
      const salesData = JSON.parse(localStorage.getItem("shopSalesData") || "{}");
      
      if (!salesData[shopName]) {
        salesData[shopName] = {
          messageCount: 0,
          salesCount: 0,
          reviewCount: 0
        };
      }
      
      salesData[shopName].messageCount = (salesData[shopName].messageCount || 0) + 1;
      
      localStorage.setItem("shopSalesData", JSON.stringify(salesData));
    }
  };

  const formatDate = (date: Date) => {
    try {
      return format(date, "MMM d, yyyy h:mm a");
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

  const getUnreadCount = (shopName: string) => {
    return messages.filter(msg => msg.shopName === shopName && !msg.read && !msg.isFromBuyer).length;
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
          {shops.map(shop => {
            const unreadCount = getUnreadCount(shop);
            
            return (
              <Button
                key={shop}
                variant={selectedShop === shop ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap relative"
                onClick={() => handleSelectShop(shop)}
              >
                {shop}
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            );
          })}
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
                  .sort((a, b) => {
                    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
                    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
                    return dateA.getTime() - dateB.getTime();
                  })
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
                          {formatDate(msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt))}
                        </span>
                        {msg.isFromBuyer && (
                          msg.read ? 
                            <CheckCheck size={12} className="text-blue-500" /> : 
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
              
              {/* Typing indicator */}
              {typingStatus[selectedShop] && (
                <div className="p-3 rounded-lg max-w-[85%] bg-gray-100 mr-auto">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
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
                  <Card key={msg.id} className="cursor-pointer relative" onClick={() => handleSelectShop(msg.shopName)}>
                    {!msg.read && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full m-2"></div>
                    )}
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getShopInitials(msg.shopName)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-base">{msg.shopName}</CardTitle>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt))}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className={`text-sm line-clamp-2 ${!msg.read ? "font-medium" : ""}`}>{msg.message}</p>
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
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">
                            {formatDate(msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt))}
                          </span>
                          {msg.read ? 
                            <CheckCheck size={16} className="text-blue-500" /> : 
                            <Check size={16} className="text-gray-500" />
                          }
                        </div>
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
