import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share, ArrowLeft, Sun, Droplet, Thermometer, Wind } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

const PlantDetailPage = () => {
  const { plantId } = useParams();
  const [activeTab, setActiveTab] = React.useState('overview');

  // Mock data
  const plant = {
    id: plantId,
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    image: '/images/plants/monstera.jpg',
    description: 'The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, Ascension Island and the Society Islands.',
    care: {
      light: 'Medium to bright indirect light',
      water: 'Water when top 1-2 inches of soil is dry',
      temperature: '65-85°F (18-29°C)',
      humidity: 'Medium to high',
      soil: 'Well-draining potting mix',
      fertilizer: 'Monthly during growing season',
      propagation: 'Stem cuttings or air layering',
    },
    healthStatus: 85,
    lastWatered: '2023-06-15',
    nextWatering: '2023-06-22',
    tags: ['Indoor', 'Tropical', 'Air Purifying'],
    similarPlants: [
      { id: '2', name: 'Philodendron', image: '/images/plants/philodendron.jpg' },
      { id: '3', name: 'Pothos', image: '/images/plants/pothos.jpg' },
      { id: '4', name: 'Swiss Cheese Plant', image: '/images/plants/swiss-cheese.jpg' },
    ],
    tips: [
      'Wipe leaves occasionally to remove dust',
      'Rotate plant for even growth',
      'Provide support for climbing',
      'Avoid direct sunlight which can burn leaves',
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <MainLayout>
        <div className="relative">
          <div className="h-64 bg-gradient-to-b from-green-800 to-green-600 relative">
            <Button variant="ghost" className="absolute top-4 left-4 text-white" size="icon">
              <ArrowLeft />
            </Button>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="ghost" className="text-white" size="icon">
                <Heart />
              </Button>
              <Button variant="ghost" className="text-white" size="icon">
                <Share />
              </Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={plant.image} alt={plant.name} />
              <AvatarFallback className="bg-green-200 text-green-800 text-xl">
                {plant.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="mt-20 text-center px-4">
          <h1 className="text-2xl font-bold">{plant.name}</h1>
          <p className="text-muted-foreground italic">{plant.scientificName}</p>
          <div className="flex justify-center gap-2 mt-2">
            {plant.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-green-50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
          <div className="px-4">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">
                Overview
              </TabsTrigger>
              <TabsTrigger value="care" className="flex-1">
                Care
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex-1">
                Tips
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="px-4 py-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{plant.description}</p>

              <Separator className="my-4" />

              <h3 className="font-medium mb-2">Health Status</h3>
              <Progress value={plant.healthStatus} className="h-2 mb-1" />
              <p className="text-sm text-right text-muted-foreground">{plant.healthStatus}% Healthy</p>

              <Separator className="my-4" />

              <h3 className="font-medium mb-2">Watering Schedule</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Last Watered</p>
                  <p className="text-sm">{new Date(plant.lastWatered).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Watering</p>
                  <p className="text-sm">{new Date(plant.nextWatering).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            <h3 className="font-medium mt-6 mb-3">Similar Plants</h3>
            <div className="grid grid-cols-3 gap-3">
              {plant.similarPlants.map((similarPlant) => (
                <Card key={similarPlant.id} className="overflow-hidden">
                  <div className="h-24 bg-muted relative">
                    <img
                      src={similarPlant.image}
                      alt={similarPlant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{similarPlant.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="care" className="px-4 py-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sun className="text-yellow-500 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium">Light</h3>
                    <p className="text-sm text-muted-foreground">{plant.care.light}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Droplet className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium">Water</h3>
                    <p className="text-sm text-muted-foreground">{plant.care.water}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Thermometer className="text-red-500 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium">Temperature</h3>
                    <p className="text-sm text-muted-foreground">{plant.care.temperature}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wind className="text-purple-500 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium">Humidity</h3>
                    <p className="text-sm text-muted-foreground">{plant.care.humidity}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-1">Soil</h3>
                  <p className="text-sm text-muted-foreground">{plant.care.soil}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Fertilizer</h3>
                  <p className="text-sm text-muted-foreground">{plant.care.fertilizer}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Propagation</h3>
                  <p className="text-sm text-muted-foreground">{plant.care.propagation}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="px-4 py-4">
            <Card className="p-4">
              <h3 className="font-medium mb-3">Care Tips</h3>
              <ul className="space-y-2">
                {plant.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Plant Information</h2>
            {/* Remove the History button completely */}
          </div>
          
          <Card className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Common Name</h3>
                <p>{plant.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Scientific Name</h3>
                <p>{plant.scientificName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Plant Type</h3>
                <p>Tropical Perennial</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Native Region</h3>
                <p>Southern Mexico to Panama</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Mature Size</h3>
                <p>10-15 ft. tall, 8-10 ft. wide</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Toxicity</h3>
                <p>Toxic to pets and humans if ingested</p>
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    </div>
  );
};

export default PlantDetailPage;
