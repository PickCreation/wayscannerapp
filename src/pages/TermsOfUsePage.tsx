
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

const TermsOfUsePage = () => {
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Terms of Use</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4 pb-24">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-wayscanner-blue mr-2" />
          <h2 className="text-lg font-bold">Terms of Use</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">Last updated: April 6, 2025</p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-6"
          onClick={handlePrint}
        >
          Print Terms
        </Button>

        <div className="space-y-6 text-gray-700">
          <section>
            <h3 className="font-semibold text-base mb-2">1. Acceptance of Terms</h3>
            <p className="text-sm">
              By accessing or using the WayScanner application and related services (collectively, the "Services"), you agree to be bound by these Terms of Use. If you do not agree to these terms, you may not use our Services.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">2. Changes to Terms</h3>
            <p className="text-sm">
              We may modify these Terms at any time. Your continued use of our Services after any changes indicates your acceptance of the modified Terms. We will notify you of significant changes through the app or by email.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">3. Account Registration</h3>
            <p className="text-sm mb-2">
              To access certain features of our Services, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">4. User Content</h3>
            <p className="text-sm mb-2">
              You may submit content to our Services, including reviews, forum posts, and photos ("User Content"). By submitting User Content, you:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content</li>
              <li>Represent that you own or have necessary rights to the User Content</li>
              <li>Understand that you are solely responsible for your User Content</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">5. Prohibited Activities</h3>
            <p className="text-sm mb-2">
              You agree not to:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Use our Services for any illegal purpose</li>
              <li>Post content that is offensive, harmful, or violates others' rights</li>
              <li>Attempt to access any part of the Services you are not authorized to access</li>
              <li>Use automated means to access or collect data from our Services</li>
              <li>Interfere with the proper functioning of our Services</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">6. Marketplace and Transactions</h3>
            <p className="text-sm mb-2">
              For marketplace transactions:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>WayScanner acts as a platform connecting buyers and sellers</li>
              <li>Sellers are responsible for the accuracy of their listings and fulfilling orders</li>
              <li>Buyers are responsible for reviewing product information before purchasing</li>
              <li>All transactions are subject to our Payment Terms</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">7. Intellectual Property</h3>
            <p className="text-sm">
              All content and materials available through our Services, excluding User Content, are owned by WayScanner or our licensors and are protected by intellectual property laws. You may not use, reproduce, or distribute any content from our Services without our permission.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">8. Disclaimer of Warranties</h3>
            <p className="text-sm">
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">9. Limitation of Liability</h3>
            <p className="text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WAYSCANNER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">10. Indemnification</h3>
            <p className="text-sm">
              You agree to indemnify and hold WayScanner and its affiliates, officers, agents, employees, and partners harmless from any claims, damages, liabilities, costs, or expenses arising from your use of the Services or violation of these Terms.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">11. Termination</h3>
            <p className="text-sm">
              We may terminate or suspend your account and access to our Services at any time, without notice, for any reason. You may terminate your account at any time by contacting us.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">12. Governing Law</h3>
            <p className="text-sm">
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold text-base mb-2">13. Contact Information</h3>
            <p className="text-sm">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-sm mt-2">
              Email: legal@wayscanner.com<br />
              Address: 123 Eco Street, Green City, EC 12345
            </p>
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

export default TermsOfUsePage;
