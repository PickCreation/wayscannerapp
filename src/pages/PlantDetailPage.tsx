
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPlant, updatePlant, deletePlant } from "@/lib/api/plants/plants.api";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
            <CardDescription>Here you can manage your plant. Click to edit.</CardDescription>
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
              <h2 className="text-xl font-bold mb-2">Plant Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Pot</h3>
                  <p className="text-sm text-slate-600">Medium sized pot with drainage holes</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Soil</h3>
                  <p className="text-sm text-slate-600">Well-draining potting mix</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Lighting</h3>
                  <p className="text-sm text-slate-600">Bright indirect light</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Humidity</h3>
                  <p className="text-sm text-slate-600">Medium to high humidity</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Hardiness Zone</h3>
                  <p className="text-sm text-slate-600">USDA zones 9-11</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <h3 className="font-semibold mb-1">Temperature</h3>
                  <p className="text-sm text-slate-600">65-80°F (18-27°C)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold">General information</h2>
              <p>The {plant.name} is a {plant.family} belonging to the {plant.genus} genus.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={plant.name}
                className="bg-muted"
                onChange={(e) => {
                  updatePlantMutation({
                    ...plant,
                    name: e.target.value,
                  });
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
