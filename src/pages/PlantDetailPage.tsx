import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getPlant } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PlantRequirements from "@/components/PlantRequirements";

const PlantDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const plantId = params.plantId as string;
  const [plant, setPlant] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const plantData = await getPlant(plantId);
        setPlant(plantData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch plant data.",
          variant: "destructive",
        });
      }
    };

    if (plantId) {
      fetchPlant();
    }
  }, [plantId, toast]);

  if (!plant) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="mb-4">
          <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {plant.name}
          </h1>
          <p className="text-muted-foreground">
            {plant.scientificName}
          </p>
        </div>
        <div className="mb-4">
          <Button>Add to my garden</Button>
        </div>
      </div>
      
      <Tabs defaultValue="care" className="w-full">
        <TabsList>
          <TabsTrigger value="care">Care</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="propagation">Propagation</TabsTrigger>
        </TabsList>
        <TabsContent value="care">
          <div className="space-y-6">
            <PlantRequirements />
            <div>
              <h2 className="text-2xl font-bold">Watering</h2>
              <p>
                Water deeply when the top inch of soil feels dry. Reduce
                watering in the winter.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Fertilizing</h2>
              <p>
                Feed with a balanced liquid fertilizer every 4-6 weeks during the
                growing season.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Description</h2>
              <p>
                The ZZ plant is a popular houseplant known for its resilience
                and ability to thrive in low-light conditions.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Origin</h2>
              <p>Native to Eastern Africa.</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="propagation">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Cutting</h2>
              <p>
                Propagate by stem cuttings. Allow the cut end to callous over
                for a few days before planting in soil.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default PlantDetailPage;
