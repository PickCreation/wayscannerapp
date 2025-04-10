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
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPlant,
  updatePlant,
  deletePlant,
} from "@/lib/api/plants/plants.api";
import { Plant } from "@/lib/db/schema";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const PlantDetailPage = () => {
  const router = useRouter();
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
      router.push("/dashboard");
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
          <Link href="/dashboard" className="text-blue-500">
            Go back to dashboard
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col gap-4">
        <Link href="/dashboard" className="w-fit">
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
              <Image
                src={plant.imageUrl || "/placeholder.svg"}
                alt={plant.name}
                width={500}
                height={300}
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
            <Link href={`/plant/${plant.id}/edit`}>
              <Button>Edit Plant</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
};

export default PlantDetailPage;
