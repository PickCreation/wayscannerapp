
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface MessageSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopName: string;
}

const MessageSellerDialog: React.FC<MessageSellerDialogProps> = ({
  open,
  onOpenChange,
  shopName,
}) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to send messages to sellers",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem("sellerMessages") || "[]");
    const newMessage = {
      id: Date.now(),
      shopName,
      message,
      date: new Date().toISOString(),
      isFromBuyer: true,
      read: false,
    };
    messages.push(newMessage);
    localStorage.setItem("sellerMessages", JSON.stringify(messages));

    // Update shop sales data for message count
    updateShopSalesData(shopName);

    // Show success toast
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${shopName}.`,
    });

    // Clear message and close dialog
    setMessage("");
    onOpenChange(false);

    // Ask if they want to view messages
    toast({
      title: "View your messages",
      description: "Go to your profile to view all messages.",
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate("/profile/messages")}>
          View
        </Button>
      )
    });
  };

  const updateShopSalesData = (shop: string) => {
    const salesData = JSON.parse(localStorage.getItem("shopSalesData") || "{}");
    
    if (!salesData[shop]) {
      salesData[shop] = {
        messageCount: 0,
        salesCount: 0,
        reviewCount: 0
      };
    }
    
    salesData[shop].messageCount = (salesData[shop].messageCount || 0) + 1;
    
    localStorage.setItem("shopSalesData", JSON.stringify(salesData));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message to {shopName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder={`Ask ${shopName} a question about their products...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSendMessage}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSellerDialog;
