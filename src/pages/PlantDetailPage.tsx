
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Mock API function since @/lib/api doesn't exist
const fetchPlant = async (id: string) => {
  // Simulate API call
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Monstera Deliciosa",
        scientific_name: "Monstera deliciosa",
        family: "Araceae",
        genus: "Monstera",
        koshagar_id: "KSG-PLT-001",
        origin: "Central America",
      });
    }, 500);
  });
};

// Add Plant type definition since @/lib/types doesn't exist
interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  family: string;
  genus: string;
  koshagar_id: string;
  origin: string;
}

const PlantDetailPage: React.FC = () => {
  const { plantId } = useParams<{ plantId: string }>();
  const { data: plant, isLoading, isError } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: () => fetchPlant(plantId!),
    enabled: !!plantId,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">
      <Skeleton className="h-10 w-[200px]" />
      <Skeleton className="h-4 w-[300px] mt-2" />
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>;
  }

  if (isError) {
    return <div className="container mx-auto p-4">Error loading plant.</div>;
  }

  if (!plant) {
    return <div className="container mx-auto p-4">Plant not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="inline-flex items-center mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plants
      </Link>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">General information</h2>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask AI
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Plant Name</CardTitle>
            <CardDescription>The common name of the plant</CardDescription>
          </CardHeader>
          <CardContent>
            {plant.name}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scientific Name</CardTitle>
            <CardDescription>The scientific name of the plant</CardDescription>
          </CardHeader>
          <CardContent>
            {plant.scientific_name}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family</CardTitle>
            <CardDescription>The family the plant belongs to</CardDescription>
          </CardHeader>
          <CardContent>
            {plant.family}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Genus</CardTitle>
            <CardDescription>The genus the plant belongs to</CardDescription>
          </CardHeader>
          <CardContent>
            {plant.genus}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> কোষাগার ID</CardTitle>
            <CardDescription>Unique identifier in কোষাগার</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{plant.koshagar_id}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origin</CardTitle>
            <CardDescription>Where the plant originates from</CardDescription>
          </CardHeader>
          <CardContent>
            {plant.origin}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlantDetailPage;
