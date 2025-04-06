
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, PawPrint, Utensils, Moon } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

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
}

// Mock data for animal details
const animalDetailsData: AnimalDetails[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Nocturnal",
    dangerText: "The Bengal Tiger is regarded as extremely dangerous due to its immense power and predatory skills. This apex predator has the capability to cause fatal harm to humans, utilizing its strong muscular build, razor-sharp teeth, and retractable claws designed to kill. Tiger attacks, although rare, can be provoked by human encroachment into their territories or in situations where tigers feel threatened or cornered. These encounters can lead to deadly outcomes, with victims suffering severe injuries or death. Additionally, tiger-induced injuries carry the risk of serious infections, heightening the peril during any interaction with this majestic yet formidable animal.",
    safetyMeasures: "If you encounter a Bengal Tiger, it's crucial to remain calm and avoid making sudden movements. Do not run, as this can trigger the tiger's instinct to chase. Instead, slowly back away while facing the tiger, maintaining a quiet demeanor to avoid provoking it. If possible, find shelter in a vehicle or secure structure. Do not approach the tiger or attempt to feed it. Being aware of your surroundings and avoiding tiger habitats during their active hours (dusk and dawn) can significantly reduce the risk of an encounter.",
    about: "The Bengal Tiger (Panthera tigris tigris) is an endangered apex predator known for its striking orange coat with black stripes. Adult males weigh up to 260 kg and use their powerful claws and sharp teeth to hunt deer, wild boar, and other large mammals. These solitary creatures are excellent swimmers and are found across diverse habitats in India, Bangladesh, Nepal, and Bhutan. Threatened by habitat loss and poaching, they are crucial for ecosystem balance as they help control herbivore populations. Conservation efforts are vital to protect these majestic animals and their habitats.",
    habitat: "Tigers inhabit a wide range of habitats including tropical rainforests, mangrove swamps, grasslands, and taiga. They require access to water, sufficient cover, and abundant prey.",
    healthAdvice: "If an animal appears sick, immediately contact a wildlife veterinarian or local animal rescue. Avoid handling wild animals yourself. For pets, consult a specialized veterinarian, describe the symptoms accurately, and follow their advice carefully. Prioritize professional care to ensure proper treatment and safety.",
    diet: "Bengal tigers are apex predators and primarily hunt large mammals such as deer, wild boar, and water buffalo. They can consume up to 40 kg of meat in a single meal and may hunt every 2-3 days.",
    behavioralTraits: "Tigers are solitary animals that mark and defend territories. They are excellent swimmers and climbers. While typically avoiding humans, they may become aggressive if threatened, injured, or protecting cubs."
  },
  {
    id: "2",
    name: "Gray Wolf",
    scientificName: "Canis lupus",
    riskLevel: "Moderate",
    imageUrl: "/lovable-uploads/b7a77845-a980-42f1-8b7e-eea9a8b822f8.png",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Crepuscular",
    dangerText: "Gray wolves pose a moderate risk to humans. While wolf attacks are rare, they can be dangerous when habituated to humans, rabid, or defending territory. Their strong jaws and pack hunting strategy make them formidable predators.",
    safetyMeasures: "If you encounter a wolf, maintain eye contact, make yourself look large, make loud noises, and back away slowly. Never run from a wolf as it may trigger a chase response. Always keep food secured when in wolf territory and don't feed wolves under any circumstances.",
    about: "The Gray Wolf is one of the world's most widely distributed predators. They typically live in packs of 6-10 individuals with a complex social hierarchy. Adult wolves weigh between 40-80 kg and can run up to 60 km/h. Their howling is used for communication within the pack.",
    habitat: "Gray wolves adapt to many habitats including forests, mountains, tundra, taiga, and grasslands. They typically establish territories of 80-300 square miles depending on prey availability.",
    healthAdvice: "If an animal appears sick, immediately contact a wildlife veterinarian or local animal rescue. Avoid handling wild animals yourself. For pets, consult a specialized veterinarian, describe the symptoms accurately, and follow their advice carefully.",
    diet: "Wolves are carnivores that primarily hunt ungulates like deer, elk, and moose. A pack can consume 20 pounds of meat in a single feeding. They also eat smaller mammals, birds, and sometimes berries.",
    behavioralTraits: "Wolves are highly social animals that live in family groups. They communicate through howling, body language, and scent marking. They're intelligent problem-solvers with strong family bonds and cooperative hunting strategies."
  },
  {
    id: "3",
    name: "Labrador Retriever",
    scientificName: "Canis lupus familiaris",
    riskLevel: "Low",
    imageUrl: "/lovable-uploads/b7a77845-a980-42f1-8b7e-eea9a8b822f8.png",
    type: "Mammal",
    dietary: "Omnivore",
    behavior: "Diurnal",
    dangerText: "Labrador Retrievers pose a low risk to humans. They are known for their friendly temperament and are rarely aggressive. However, any dog can bite if provoked, scared, or ill. Always approach unfamiliar dogs with caution.",
    safetyMeasures: "When interacting with Labradors, allow the dog to sniff your hand first, avoid sudden movements, and never disturb a dog while eating. Supervise interactions with children and teach them proper handling techniques.",
    about: "The Labrador Retriever is one of the most popular dog breeds worldwide, known for its friendly nature and versatility. Originally bred as working dogs for fishermen in Newfoundland, they excel as family pets, service dogs, and in various working roles. They typically weigh 55-80 pounds and live 10-12 years.",
    habitat: "As domesticated animals, Labradors adapt well to various living environments from apartments to rural settings, though they thrive with adequate space and exercise opportunities. They enjoy water and are natural swimmers.",
    healthAdvice: "Regular veterinary check-ups are essential for Labradors. They're prone to hip and elbow dysplasia, obesity, and eye conditions. Maintain a healthy diet, regular exercise, and weight management. Contact your vet immediately if your Labrador shows signs of illness.",
    diet: "Labradors should eat high-quality commercial dog food appropriate for their age, size, and activity level. They require about 2-3 cups of dry food daily, divided into two meals. Always provide fresh water and limit treats to prevent obesity.",
    behavioralTraits: "Labradors are intelligent, friendly, and outgoing dogs with a strong desire to please. They're energetic, especially in youth, requiring regular exercise and mental stimulation. They get along well with children and other pets, making them excellent family companions."
  }
];

const AnimalDetailPage = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [animal, setAnimal] = useState<AnimalDetails | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("home");
  const navigate = useNavigate();

  useEffect(() => {
    const foundAnimal = animalDetailsData.find(a => a.id === animalId);
    if (foundAnimal) {
      setAnimal(foundAnimal);
    } else {
      // If animal not found, redirect to scan page
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
    // This opens the camera sheet for scanning
  };

  const getRiskColor = (risk: "High" | "Moderate" | "Low") => {
    if (risk === "High") return "bg-red-500";
    if (risk === "Moderate") return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!animal) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate("/scan?tab=animals")}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-medium">Animal Details</h1>
        <div className="w-10 h-10"></div>
      </header>

      {/* Animal Image */}
      <div className="w-full h-64 overflow-hidden relative">
        <img 
          src={animal.imageUrl} 
          alt={animal.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animal Name and Risk Level */}
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{animal.name}</h2>
        <div className={`${getRiskColor(animal.riskLevel)} text-white px-4 py-1.5 rounded-full inline-flex items-center text-sm`}>
          <AlertTriangle className="mr-1" size={16} />
          <span className="font-medium">{animal.riskLevel} Risk</span>
        </div>
      </div>

      {/* Scientific Name */}
      <div className="px-4 pb-2">
        <h3 className="text-lg text-green-600 font-medium">Scientific Name</h3>
        <p className="text-blue-600 font-medium">{animal.scientificName}</p>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      {/* Key Characteristics */}
      <div className="px-4 pb-4 flex justify-around">
        <div className="border border-black rounded-lg p-3 flex flex-col items-center justify-center">
          <PawPrint className="text-blue-600 mb-1" size={24} />
          <p className="text-black font-medium">Type</p>
          <p className="text-blue-600 font-medium">{animal.type}</p>
        </div>
        <div className="border border-black rounded-lg p-3 flex flex-col items-center justify-center">
          <Utensils className="text-blue-600 mb-1" size={24} />
          <p className="text-black font-medium">Dietary</p>
          <p className="text-blue-600 font-medium">{animal.dietary}</p>
        </div>
        <div className="border border-black rounded-lg p-3 flex flex-col items-center justify-center">
          <Moon className="text-blue-600 mb-1" size={24} />
          <p className="text-black font-medium">Behavior</p>
          <p className="text-blue-600 font-medium">{animal.behavior}</p>
        </div>
      </div>

      {/* Danger Level */}
      <div className="px-4 py-3 bg-red-100 mx-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1">Danger Level</h3>
        <p className="text-sm">{animal.dangerText}</p>
      </div>

      {/* Safety Measures */}
      <div className="px-4 py-3 bg-green-100 mx-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1">Safety Measures</h3>
        <p className="text-sm">{animal.safetyMeasures}</p>
      </div>

      {/* About */}
      <div className="px-4 py-3 border border-gray-300 mx-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1">About</h3>
        <p className="text-sm">{animal.about}</p>
      </div>

      {/* Habitat */}
      <div className="px-4 py-3 bg-purple-100 mx-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1">Habitat</h3>
        <p className="text-sm">{animal.habitat}</p>
      </div>

      {/* Health Advice */}
      <div className="px-4 py-3 bg-yellow-100 mx-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1">Health Advice</h3>
        <p className="text-sm">{animal.healthAdvice}</p>
      </div>

      {/* Diet */}
      <div className="px-4 py-3 bg-pink-100 mx-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-1">Diet</h3>
        <p className="text-sm">{animal.diet}</p>
      </div>

      {/* Behavioral Traits */}
      <div className="px-4 py-3 bg-green-100 mx-4 rounded-lg mb-10">
        <h3 className="text-lg font-semibold mb-1">Behavioral Traits</h3>
        <p className="text-sm">{animal.behavioralTraits}</p>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default AnimalDetailPage;
