
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleSendMessage = async () => {
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

    setIsSending(true);

    try {
      // Save message to Firebase
      const messagesCollection = collection(db, "messages");
      const newMessageRef = await addDoc(messagesCollection, {
        shopName,
        message,
        createdAt: serverTimestamp(),
        isFromBuyer: true,
        read: false,
        buyerId: user?.id || "anonymous",
        buyerName: user?.name || "Anonymous",
      });

      console.log("Message saved to Firebase with ID:", newMessageRef.id);

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
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Could not send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const updateShopSalesData = async (shop: string) => {
    try {
      // Update shop sales data in Firebase
      const salesDataRef = doc(db, "shopSalesData", shop);
      await updateDoc(salesDataRef, {
        messageCount: 1
      }, { merge: true });
    } catch (error) {
      console.error("Error updating shop sales data:", error);
      // Fallback to localStorage
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
    }
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
          <Button 
            type="button" 
            onClick={handleSendMessage}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSellerDialog;
