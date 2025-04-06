
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop" | "profile">("profile");
  const [showCameraSheet, setShowCameraSheet] = useState(false);

  const handleBackClick = () => {
    navigate("/profile");
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
    setShowCameraSheet(true);
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleContactUs = () => {
    window.open("https://wayscanner.com/contact", "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Privacy Policy</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-24">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-wayscanner-blue mr-2" />
          <h2 className="text-lg font-bold">Privacy Policy</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">Last updated: April 6, 2025</p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-6"
          onClick={handlePrint}
        >
          Print Policy
        </Button>

        <div className="space-y-6 text-gray-700">
          <section>
            <h3 className="font-semibold text-base mb-2">1. Introduction</h3>
            <p className="text-sm">
              Welcome to WayScanner's Privacy Policy. This policy describes how WayScanner ("we", "our", or "us") collects, uses, and shares your personal information when you use our mobile application and related services (collectively, the "Services").
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">2. Information We Collect</h3>
            <p className="text-sm mb-2">
              We collect several types of information, including:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and profile information.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our Services, including scan history, browsing behavior, and interaction with content.
              </li>
              <li>
                <strong>Device Information:</strong> Information about your mobile device, including device type, operating system, and unique device identifiers.
              </li>
              <li>
                <strong>Location Data:</strong> Precise location data when you enable location services for certain features like finding nearby products.
              </li>
              <li>
                <strong>Camera and Photo Data:</strong> When you use our scanning features, we collect images and related data to identify food, plants, and animals.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">3. How We Use Your Information</h3>
            <p className="text-sm mb-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and fulfill orders</li>
              <li>Personalize your experience and deliver relevant content</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Protect the security and integrity of our Services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">4. Sharing Your Information</h3>
            <p className="text-sm mb-2">
              We may share your information with:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>
                <strong>Service Providers:</strong> Third-party vendors who help us provide and improve our Services.
              </li>
              <li>
                <strong>Marketplace Sellers:</strong> When you purchase products, we share necessary information with sellers to complete your transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect rights, privacy, safety, or property.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">5. Your Rights and Choices</h3>
            <p className="text-sm mb-2">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability</li>
              <li>Withdraw consent for optional processing activities</li>
            </ul>
            <p className="text-sm mt-2">
              You can exercise these rights by contacting us at privacy@wayscanner.com.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">6. Data Security</h3>
            <p className="text-sm">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">7. Children's Privacy</h3>
            <p className="text-sm">
              Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe we have collected information from your child, please contact us.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">8. Changes to This Policy</h3>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">9. Contact Us</h3>
            <p className="text-sm mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <Button
              className="bg-wayscanner-blue hover:bg-blue-700 flex items-center"
              onClick={handleContactUs}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
          </section>
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

export default PrivacyPolicyPage;
