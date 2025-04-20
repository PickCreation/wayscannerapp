import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { plants } from '@/data/plants';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const PlantDetailPage = () => {
  const { plantId } = useParams();
  const plant = plants.find((p) => p.id === plantId);

  if (!plant) {
    return <div>Plant not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="inline-flex items-center mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plants
      </Link>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{plant.name}</CardTitle>
            <CardDescription>Scientific Name: {plant.scientificName}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={plant.imageUrl} alt={plant.name} className="rounded-md w-full aspect-square object-cover" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{plant.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Care Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Light:</strong> {plant.light}</p>
            <p><strong>Water:</strong> {plant.water}</p>
            <p><strong>Soil:</strong> {plant.soil}</p>
          </CardContent>
        </Card>
      </div>

      {/* Fun fact section */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Fun Fact</CardTitle>
          </CardHeader>
          <CardContent>
            {plant.funFact}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Link to={`/plant/${plantId}/ai`}>
          <Button variant="outline" className="w-full sm:w-auto">
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask AI
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PlantDetailPage;
