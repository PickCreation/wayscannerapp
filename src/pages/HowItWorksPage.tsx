
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState<{
    title: string;
    sections: {
      heading: string;
      text: string;
      icon?: string;
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the how it works content from our API
    const fetchHowItWorksContent = async () => {
      try {
        const response = await fetch('/api/how-it-works');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error fetching how it works content:", error);
        toast({
          title: "Error loading content",
          description: "Please try again later",
          variant: "destructive"
        });
        // Fallback content if API fails
        setContent({
          title: "How WayScanner Works",
          sections: [
            {
              heading: "Scan Anything",
              text: "Point your camera at food, plants, or animals to get instant information and identification."
            },
            {
              heading: "Learn & Explore",
              text: "Discover nutritional facts, plant care tips, animal species information, and more."
            },
            {
              heading: "Shop Consciously",
              text: "Browse recommended sustainable products related to your scans in our marketplace."
            },
            {
              heading: "Share & Connect",
              text: "Join our community to share discoveries and learn from other explorers."
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHowItWorksContent();
  }, [toast]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{content?.title || "How It Works"}</h1>
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <X size={24} />
        </Button>
      </div>

      <div className="space-y-6">
        {content?.sections.map((section, index) => (
          <Card key={index} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
            <p className="text-gray-700">{section.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksPage;
