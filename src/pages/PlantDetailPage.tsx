
import React, { useEffect } from "react";
import { injectPlantRequirements } from "@/utils/plantRequirementsInjector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

// Mock API functions since they don't exist
const getPlant = async (id: string) => {
  // This is a mock implementation
  return {
    id,
    name: "Monstera Deliciosa",
    family: "Araceae",
    genus: "Monstera",
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
  };
};

const updatePlant = async (plant: any) => {
  // Mock implementation
  return plant;
};

const deletePlant = async (id: string) => {
  // Mock implementation
  return { id };
};

// Shell component replacement
const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {children}
    </div>
  );
};

const PlantDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const plantId = String(params?.plantId);
  const { toast } = useToast();

  const { data: plant, isLoading, isError } = useQuery({
    queryKey: ["plant", plantId],
    queryFn: () => getPlant(plantId),
    enabled: !!plantId,
  });

  const { mutate: updatePlantMutation } = useMutation({
    mutationFn: updatePlant,
    onSuccess: () => {
      toast({
        title: "Plant updated successfully!",
      });
    },
  });

  const { mutate: deletePlantMutation } = useMutation({
    mutationFn: deletePlant,
    onSuccess: () => {
      toast({
        title: "Plant deleted successfully!",
      });
      navigate("/dashboard");
    },
  });

  useEffect(() => {
    // Inject the plant requirements section
    injectPlantRequirements();
  }, []);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-[300px] w-full rounded-md" />
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[50px]" />
          <Skeleton className="h-4 w-[50px]" />
        </div>
      </Shell>
    );
  }

  if (isError || !plant) {
    return (
      <Shell>
        <div className="flex flex-col gap-4">
          <p>Could not find plant.</p>
          <Link to="/dashboard" className="text-blue-500">
            Go back to dashboard
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col gap-4">
        <Link to="/dashboard" className="w-fit">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{plant.name}</CardTitle>
            <CardDescription>
              Here you can manage your plant. Click to edit.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col gap-2">
              <img
                src={plant.imageUrl || "/placeholder.svg"}
                alt={plant.name}
                className="h-80 w-full rounded-md object-cover"
              />
              <div className="flex gap-2">
                <Badge>{plant.family}</Badge>
                <Badge>{plant.genus}</Badge>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">General information</h2>
              <p>
                The {plant.name} is a {plant.family} belonging to the{" "}
                {plant.genus} genus.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={plant.name}
                className="bg-muted"
                onChange={(e) => {
                  updatePlantMutation({ ...plant, name: e.target.value });
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                deletePlantMutation(plant.id);
              }}
            >
              Delete
            </Button>
            <Link to={`/plant/${plant.id}/edit`}>
              <Button>Edit Plant</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
};

export default PlantDetailPage;
