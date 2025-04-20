import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Mock data for development 
const mockPlant = {
  id: '1',
  name: 'Monstera Deliciosa',
  description: 'A beautiful tropical plant known for its unique leaf shapes.',
  category: 'Indoor',
  plantType: 'Tropical',
  imageUrl: ['https://example.com/monstera.jpg'],
  userEmail: 'user@example.com',
  careInstructions: 'Keep in bright, indirect light. Water when top inch of soil is dry.'
};

const PlantDetailPage = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [plant, setPlant] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [plantDescription, setPlantDescription] = useState('');

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        // Simulating API call with mock data
        setPlant(mockPlant);
        setPlantName(mockPlant.name);
        setPlantDescription(mockPlant.description);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch plant:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchPlant();
  }, [plantId]);

  const handleUpdatePlant = () => {
    toast({
      title: "Plant Updated",
      description: "Plant details have been updated successfully."
    });
    setIsEditMode(false);
  };

  const handleDeletePlant = () => {
    toast({
      title: "Plant Deleted",
      description: "Plant has been deleted successfully."
    });
    navigate('/');
  };

  if (isLoading) return <Skeleton className="w-full h-[500px]" />;
  if (isError) return <p>Error fetching plant details</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">{plantName}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your plant from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePlant}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={mockPlant.imageUrl[0]} alt={plantName} className="rounded-lg shadow-md w-full h-auto" />
            <div className="mt-4">
              <Badge className="mr-2">{mockPlant.category}</Badge>
              <Badge>{mockPlant.plantType}</Badge>
            </div>
          </div>
          <div>
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="care">Care Instructions</TabsTrigger>
                {/* <TabsTrigger value="community">Community</TabsTrigger> */}
              </TabsList>
              <TabsContent value="description" className="mt-4">
                {isEditMode ? (
                  <div>
                    <Label htmlFor="name">Plant Name</Label>
                    <Input id="name" value={plantName} onChange={(e) => setPlantName(e.target.value)} className="mb-4" />
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={plantDescription}
                      onChange={(e) => setPlantDescription(e.target.value)}
                      className="resize-none mb-4"
                    />
                    <Button onClick={handleUpdatePlant}>Update Plant</Button>
                  </div>
                ) : (
                  <p>{plantDescription}</p>
                )}
              </TabsContent>
              <TabsContent value="care" className="mt-4">
                <p>{mockPlant.careInstructions}</p>
              </TabsContent>
              {/* <TabsContent value="community" className="mt-4">
                <p>No community posts yet.</p>
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
