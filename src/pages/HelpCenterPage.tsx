import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  ShoppingBag,
  Truck,
  CreditCard,
  User,
  MessageCircle,
  Mail
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

interface FaqCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  faqs: {
    id: string;
    question: string;
    answer: string;
    isOpen?: boolean;
  }[];
}

const faqCategories: FaqCategory[] = [
  {
    id: "account",
    title: "Account & Profile",
    icon: <User className="h-5 w-5 text-wayscanner-blue" />,
    faqs: [
      {
        id: "acc-1",
        question: "How do I create an account?",
        answer: "To create an account, tap on the profile icon in the bottom navigation and select 'Sign Up'. Follow the prompts to enter your details and create your account."
      },
      {
        id: "acc-2",
        question: "How do I reset my password?",
        answer: "If you've forgotten your password, go to the login screen and tap 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password."
      },
      {
        id: "acc-3",
        question: "How do I edit my profile information?",
        answer: "Navigate to your profile page by tapping the profile icon in the bottom navigation. Then tap 'Edit Profile' to update your personal information."
      }
    ]
  },
  {
    id: "orders",
    title: "Orders & Purchases",
    icon: <ShoppingBag className="h-5 w-5 text-wayscanner-blue" />,
    faqs: [
      {
        id: "ord-1",
        question: "How do I track my order?",
        answer: "You can track your order by going to 'My Orders' in your profile. Select the order you want to track and you'll see the current status and tracking information."
      },
      {
        id: "ord-2",
        question: "How do I cancel an order?",
        answer: "To cancel an order, go to 'My Orders' in your profile, select the order you want to cancel, and tap the 'Cancel Order' button. Note that you can only cancel orders that haven't been shipped yet."
      }
    ]
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: <Truck className="h-5 w-5 text-wayscanner-blue" />,
    faqs: [
      {
        id: "ship-1",
        question: "What are the shipping options?",
        answer: "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and same-day delivery in select areas. You can choose your preferred option during checkout."
      },
      {
        id: "ship-2",
        question: "How much does shipping cost?",
        answer: "Shipping costs vary based on the delivery method, location, and order size. Standard shipping starts at $5.99, express shipping at $12.99. Free shipping is available for orders over $50."
      }
    ]
  },
  {
    id: "payment",
    title: "Payment & Billing",
    icon: <CreditCard className="h-5 w-5 text-wayscanner-blue" />,
    faqs: [
      {
        id: "pay-1",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. You can manage your payment methods in your profile settings."
      },
      {
        id: "pay-2",
        question: "How do I add a new payment method?",
        answer: "Go to 'Payment Methods' in your profile, then tap 'Add Payment Method'. Follow the prompts to enter your card or payment details."
      }
    ]
  }
];

const HelpCenterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(faqCategories);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const toggleFaq = (categoryId: string, faqId: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId
          ? {
              ...category,
              faqs: category.faqs.map(faq => 
                faq.id === faqId
                  ? { ...faq, isOpen: !faq.isOpen }
                  : faq
              )
            }
          : category
      )
    );
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Request Sent",
      description: "Our team will get back to you shortly.",
    });
  };

  const filteredCategories = searchQuery
    ? categories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : categories;

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Help Center</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-6 w-6 text-wayscanner-blue mr-2" />
            <h2 className="text-xl font-bold">How can we help you?</h2>
          </div>
          
          <div className="relative mb-6">
            <Input
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center">
                  {category.icon}
                  <h3 className="font-semibold ml-2">{category.title}</h3>
                </div>
              </div>
              
              <div className="divide-y">
                {category.faqs.map((faq) => (
                  <div key={faq.id} className="p-4">
                    <button
                      className="flex justify-between items-center w-full text-left"
                      onClick={() => toggleFaq(category.id, faq.id)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      {faq.isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {faq.isOpen && (
                      <p className="mt-2 text-gray-600 text-sm">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-16">
          <h3 className="font-semibold mb-2 flex items-center">
            <MessageCircle className="h-5 w-5 text-wayscanner-blue mr-2" />
            Can't find what you're looking for?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to help with any questions or issues you may have.
          </p>
          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-wayscanner-blue hover:bg-blue-700"
              onClick={handleContactSupport}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default HelpCenterPage;
