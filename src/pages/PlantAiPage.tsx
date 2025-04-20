
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";

const PlantAiPage = () => {
  const { plantId } = useParams();

  return (
    <div className="container mx-auto p-4">
      <Link to={`/plant/${plantId}`} className="inline-flex items-center mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plant Details
      </Link>
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Ask AI about this plant</h1>
        <p className="text-gray-600">Coming soon: Ask questions about this plant and get AI-powered answers!</p>
      </Card>
    </div>
  );
};

export default PlantAiPage;
