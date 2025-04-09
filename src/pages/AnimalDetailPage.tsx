import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, PawPrint, Utensils, Moon, PhoneCall, Info, MapPin, Camera, Share2, Bell, HelpCircle } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnimalDetails {
  id: string;
  name: string;
  scientificName: string;
  riskLevel: "High" | "Moderate" | "Low";
  imageUrl: string;
  type: string;
  dietary: string;
  behavior: string;
  dangerText: string;
  safetyMeasures: string;
  about: string;
  habitat: string;
  healthAdvice: string;
  diet: string;
  behavioralTraits: string;
  legalRestrictions: string;
  interestingFacts: {
    fact: string;
  }[];
  emergencyContacts: {
    name: string;
    phone: string;
  }[];
  similarSpecies: {
    name: string;
    imageUrl: string;
  }[];
}

const animalDetailsData: AnimalDetails[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Nocturnal",
    dangerText: "Bengal Tigers are extremely dangerous predators with powerful builds, sharp teeth, and retractable claws. Attacks, though rare, can be fatal. Human encroachment into their territory increases risk of encounters.",
    safetyMeasures: "If encountered, remain calm, don't run, and back away slowly while facing the tiger. Avoid tiger habitats during dawn and dusk. Never approach or attempt to feed them.",
    about: "The Bengal Tiger is an endangered apex predator with an orange coat and black stripes. Adults weigh up to 260kg and are excellent swimmers. Found in India, Bangladesh, Nepal, and Bhutan, they face threats from habitat loss and poaching.",
    habitat: "Found in tropical rainforests, mangrove swamps, grasslands, and taiga. Requires access to water, sufficient cover, and abundant prey.",
    healthAdvice: "For sick wild animals, contact wildlife specialists immediately. For pets, consult a veterinarian, describe symptoms accurately, and follow professional advice.",
    diet: "Hunts large mammals like deer, wild boar, and water buffalo. Can consume up to 40kg in a single meal and hunts every 2-3 days.",
    behavioralTraits: "Solitary animals that mark territories. Excellent swimmers and climbers. Generally avoid humans but may become aggressive if threatened or protecting cubs.",
    legalRestrictions: "Protected under CITES Appendix I, prohibiting international trade. Additional protection under national laws. Keeping as pets is illegal without proper permits.",
    interestingFacts: [
      { fact: "Each tiger has a unique stripe pattern, like human fingerprints." },
      { fact: "Tigers can leap distances of up to 6 meters and jump up to 5 meters vertically." },
      { fact: "A tiger's roar can be heard up to 3 kilometers away." }
    ],
    emergencyContacts: [
      { name: "Wildlife Emergency Hotline", phone: "+1-800-WILDLIFE" },
      { name: "Poison Control Center", phone: "+1-800-222-1222" }
    ],
    similarSpecies: [
      { name: "Malayan Tiger", imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png" },
      { name: "South China Tiger", imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png" },
      { name: "Sumatran Tiger", imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png" }
    ]
  },
  {
    id: "2",
    name: "Gray Wolf",
    scientificName: "Canis lupus",
    riskLevel: "Moderate",
    imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Crepuscular",
    dangerText: "Gray wolves pose moderate risk to humans. Attacks are rare but possible when wolves are habituated to humans, rabid, or defending territory. Their pack hunting makes them formidable.",
    safetyMeasures: "If encountered, maintain eye contact, appear large, make noise, and back away slowly. Never run. Keep food secured in wolf territory and never feed them.",
    about: "Widely distributed predators living in packs of 6-10 with complex social hierarchy. Adults weigh 40-80kg and can run up to 60km/h. Howling is used for pack communication.",
    habitat: "Adaptable to forests, mountains, tundra, taiga, and grasslands. Establish territories of 80-300 square miles depending on prey availability.",
    healthAdvice: "For sick wild animals, contact wildlife specialists immediately. For pets, consult a veterinarian, describe symptoms accurately, and follow professional advice.",
    diet: "Primarily hunt ungulates like deer, elk, and moose. A pack can consume 9kg of meat in one feeding. Also eat smaller mammals, birds, and sometimes berries.",
    behavioralTraits: "Highly social animals living in family groups. Communicate through howling, body language, and scent marking. Intelligent with strong family bonds and cooperative hunting.",
    legalRestrictions: "Protected under the Endangered Species Act in many regions. Hunting regulations vary by location. Keeping as pets is illegal in most jurisdictions.",
    interestingFacts: [
      { fact: "Wolf packs have a complex social hierarchy led by an alpha pair." },
      { fact: "Wolves can travel up to 30 miles a day when hunting." },
      { fact: "A wolf's howl can be heard up to 6 miles away in open terrain." }
    ],
    emergencyContacts: [
      { name: "Wildlife Emergency Hotline", phone: "+1-800-WILDLIFE" },
      { name: "Animal Control", phone: "+1-800-555-ANIMAL" }
    ],
    similarSpecies: [
      { name: "Eastern Wolf", imageUrl: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png" },
      { name: "Arctic Wolf", imageUrl: "/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" },
      { name: "Coyote", imageUrl: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png" }
    ]
  },
  {
    id: "3",
    name: "Labrador Retriever",
    scientificName: "Canis lupus familiaris",
    riskLevel: "Low",
    imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
    type: "Mammal",
    dietary: "Omnivore",
    behavior: "Diurnal",
    dangerText: "Labradors pose low risk to humans. Known for friendly temperament and rarely aggressive. However, any dog may bite if provoked, scared, or ill. Approach unfamiliar dogs with caution.",
    safetyMeasures: "Let the dog sniff your hand first, avoid sudden movements, and never disturb while eating. Supervise interactions with children and teach proper handling.",
    about: "One of the most popular dog breeds worldwide, known for friendliness and versatility. Originally bred as working dogs for fishermen. Typically weigh 25-36kg and live 10-12 years.",
    habitat: "Domesticated animals that adapt to various environments from apartments to rural settings. Enjoy water and are natural swimmers.",
    healthAdvice: "Regular vet check-ups essential. Prone to hip/elbow dysplasia, obesity, and eye conditions. Maintain healthy diet, exercise, and weight. Contact vet if showing illness signs.",
    diet: "Should eat high-quality dog food suitable for age, size, and activity level. Need about 2-3 cups daily, divided into two meals. Always provide fresh water.",
    behavioralTraits: "Intelligent, friendly, and outgoing with strong desire to please. Energetic, especially when young. Good with children and other pets, making excellent family companions.",
    legalRestrictions: "Few legal restrictions compared to wild animals. Local leash laws, licensing requirements, and breed-specific legislation may apply. Follow responsible ownership guidelines.",
    interestingFacts: [
      { fact: "Labradors were originally bred to help fishermen retrieve nets and catch." },
      { fact: "They come in three recognized colors: black, yellow, and chocolate." },
      { fact: "Labrador Retrievers have been the most popular dog breed in the US for over 30 years." }
    ],
    emergencyContacts: [
      { name: "Animal Poison Control", phone: "+1-888-426-4435" },
      { name: "Emergency Vet Hotline", phone: "+1-800-555-VETS" }
    ],
    similarSpecies: [
      { name: "Golden Retriever", imageUrl: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png" },
      { name: "Chesapeake Bay Retriever", imageUrl: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png" },
      { name: "Flat-Coated Retriever", imageUrl: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png" }
    ]
  }
];

const AnimalDetailPage = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [animal, setAnimal] = useState<AnimalDetails | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const foundAnimal = animalDetailsData.find(a => a.id === animalId);
    if (foundAnimal) {
      setAnimal(foundAnimal);
    } else {
      navigate("/scan?tab=animals");
    }
  }, [animalId, navigate]);

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    }
  };

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };

  const getRiskColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "bg-red-500";
    if (risk === "Moderate") return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const toggleNotifications = () => {
    setIsNotifying(!isNotifying);
    toast.success(isNotifying ? "Notifications turned off" : "You'll be notified about Bengal Tiger sightings in your area");
  };

  const reportSighting = () => {
    toast.success("Thanks for your report! Wildlife authorities have been notified.");
  };

  if (!animal) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate("/scan?tab=animals")}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-semibold">Animal Details</h1>
        <div className="flex">
          <button onClick={handleShare} className="mr-2">
            <Share2 className="h-5 w-5" color="white" />
          </button>
          <button onClick={toggleNotifications}>
            <Bell className={`h-5 w-5 ${isNotifying ? "text-yellow-300" : "text-white"}`} />
          </button>
        </div>
      </header>

      <div className="w-full h-[280px] overflow-hidden relative">
        <img 
          src={animal.imageUrl} 
          alt={animal.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3">
          <button 
            onClick={reportSighting}
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full"
          >
            <Camera className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-350px)] pb-4">
        <div className="p-5">
          <h2 className="text-2xl font-bold">{animal.name}</h2>
        
          <div className="mt-2 mb-3">
            <h3 className="text-base text-green-600 font-medium">Scientific Name</h3>
            <p className="text-blue-600 text-sm font-medium">{animal.scientificName}</p>
            
            <div className={`mt-2 ${getRiskColor(animal.riskLevel)} text-white px-3 py-1.5 rounded-full inline-flex items-center text-sm`}>
              <AlertTriangle className="mr-2" size={16} />
              <span className="font-medium">{animal.riskLevel} Risk</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="border border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center">
              <PawPrint className="text-blue-600 mb-1" size={24} />
              <p className="text-black text-xs font-medium">Type</p>
              <p className="text-blue-600 text-xs font-medium">{animal.type}</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center">
              <Utensils className="text-blue-600 mb-1" size={24} />
              <p className="text-black text-xs font-medium">Dietary</p>
              <p className="text-blue-600 text-xs font-medium">{animal.dietary}</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center">
              <Moon className="text-blue-600 mb-1" size={24} />
              <p className="text-black text-xs font-medium">Behavior</p>
              <p className="text-blue-600 text-xs font-medium">{animal.behavior}</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center">
              <MapPin className="text-blue-600 mb-1" size={24} />
              <p className="text-black text-xs font-medium">Habitat</p>
              <p className="text-blue-600 text-xs font-medium">Various</p>
            </div>
          </div>

          <div className="px-4 py-4 bg-red-100 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-2">Danger Level</h3>
            <p className="text-sm">{animal.dangerText}</p>
          </div>

          <div className="px-4 py-4 bg-green-100 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-2">Safety Measures</h3>
            <p className="text-sm">{animal.safetyMeasures}</p>
          </div>

          <div className="px-4 py-4 border border-gray-300 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-sm">{animal.about}</p>
          </div>

          <div className="px-4 py-4 bg-blue-100 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-2">Legal Restrictions</h3>
            <p className="text-sm">{animal.legalRestrictions}</p>
          </div>

          <div className="px-4 py-4 border border-gray-300 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-2">Interesting Facts</h3>
            <ul className="space-y-3">
              {animal.interestingFacts.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 mt-0.5">
                    <Info className="h-3.5 w-3.5 text-white" />
                  </div>
                  <p className="text-sm">{item.fact}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-4 bg-red-100 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-2">Emergency Contacts</h3>
            <ul className="space-y-3">
              {animal.emergencyContacts.map((contact, index) => (
                <li key={index} className="flex items-center">
                  <PhoneCall className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold">{contact.name}</p>
                    <p className="text-sm">{contact.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-4 rounded-lg mb-5">
            <h3 className="text-lg font-semibold mb-3">Similar Species</h3>
            <div className="flex space-x-5 overflow-x-auto pb-2">
              {animal.similarSpecies.map((species, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                    <img src={species.imageUrl} alt={species.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-center mt-2">{species.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-500 py-3 text-base"
              onClick={() => navigate("/forum")}
            >
              <HelpCircle size={18} />
              <span>Ask Community About This Animal</span>
            </Button>
          </div>
        </div>
      </ScrollArea>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />

      <CameraSheet 
        open={cameraSheetOpen} 
        onOpenChange={setCameraSheetOpen} 
      />
    </div>
  );
};

export default AnimalDetailPage;
