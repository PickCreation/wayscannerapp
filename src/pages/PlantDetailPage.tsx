
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Share2, ThumbsUp, BookmarkPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const PlantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // This is a mock data - in a real app, you would fetch this from an API
  const plant = {
    id: id,
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    image: '/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png',
    description: 'The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, Ascension Island and the Society Islands.',
    careLevel: 'Easy',
    waterFrequency: 'Every 1-2 weeks',
    sunlight: 'Bright indirect light',
    temperature: '65-85°F (18-29°C)',
    humidity: 'Medium to high',
    soilType: 'Well-draining potting mix',
    toxicity: 'Toxic to pets if ingested',
    growthRate: 'Fast',
    matureSize: '8-10 ft tall, 3-5 ft wide',
    propagation: 'Stem cuttings',
    commonProblems: 'Yellow leaves (overwatering), brown leaf tips (low humidity)'
  };

  if (!plant) {
    return <div className="p-4">Plant not found</div>;
  }

  return (
    <div className="pb-24">
      <div className="flex items-center p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-2">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Plant Details</h1>
      </div>

      <div className="relative w-full h-64">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-white text-2xl font-bold">{plant.name}</h2>
          <p className="text-white/80 italic">{plant.scientificName}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <ThumbsUp className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <BookmarkPlus className="h-5 w-5" />
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">About this Plant</h3>
          <p className="text-gray-700">{plant.description}</p>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold">Care Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Care Level</p>
              <p className="font-medium">{plant.careLevel}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Water</p>
              <p className="font-medium">{plant.waterFrequency}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Sunlight</p>
              <p className="font-medium">{plant.sunlight}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Temperature</p>
              <p className="font-medium">{plant.temperature}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Humidity</p>
              <p className="font-medium">{plant.humidity}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Soil</p>
              <p className="font-medium">{plant.soilType}</p>
            </div>
          </div>
        </div>

        {/* Duplicated care information with new content */}
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold">Seasonal Care Tips</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Spring</p>
              <p className="font-medium">Increase watering as growth accelerates</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Summer</p>
              <p className="font-medium">Mist regularly to maintain humidity</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Fall</p>
              <p className="font-medium">Reduce watering as growth slows</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Winter</p>
              <p className="font-medium">Protect from cold drafts, minimal watering</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Fertilizing</p>
              <p className="font-medium">Monthly during growing season</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Pruning</p>
              <p className="font-medium">Trim yellow leaves as needed</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Toxicity</p>
              <p>{plant.toxicity}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Growth Rate</p>
              <p>{plant.growthRate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mature Size</p>
              <p>{plant.matureSize}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Propagation</p>
              <p>{plant.propagation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Common Problems</p>
              <p>{plant.commonProblems}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
