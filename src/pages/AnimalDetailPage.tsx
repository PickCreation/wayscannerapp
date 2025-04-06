import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, PawPrint, Utensils, Moon, PhoneCall, Info } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";

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
    dangerText: "The Bengal Tiger is regarded as extremely dangerous due to its immense power and predatory skills. This apex predator has the capability to cause fatal harm to humans, utilizing its strong muscular build, razor-sharp teeth, and retractable claws designed to kill. Tiger attacks, although rare, can be provoked by human encroachment into their territories or in situations where tigers feel threatened or cornered. These encounters can lead to deadly outcomes, with victims suffering severe injuries or death. Additionally, tiger-induced injuries carry the risk of serious infections, heightening the peril during any interaction with this majestic yet formidable animal.",
    safetyMeasures: "If you encounter a Bengal Tiger, it's crucial to remain calm and avoid making sudden movements. Do not run, as this can trigger the tiger's instinct to chase. Instead, slowly back away while facing the tiger, maintaining a quiet demeanor to avoid provoking it. If possible, find shelter in a vehicle or secure structure. Do not approach the tiger or attempt to feed it. Being aware of your surroundings and avoiding tiger habitats during their active hours (dusk and dawn) can significantly reduce the risk of an encounter.",
    about: "The Bengal Tiger (Panthera tigris tigris) is an endangered apex predator known for its striking orange coat with black stripes. Adult males weigh up to 260 kg and use their powerful claws and sharp teeth to hunt deer, wild boar, and other large mammals. These solitary creatures are excellent swimmers and are found across diverse habitats in India, Bangladesh, Nepal, and Bhutan. Threatened by habitat loss and poaching, they are crucial for ecosystem balance as they help control herbivore populations. Conservation efforts are vital to protect these majestic animals and their habitats.",
    habitat: "Tigers inhabit a wide range of habitats including tropical rainforests, mangrove swamps, grasslands, and taiga. They require access to water, sufficient cover, and abundant prey.",
    healthAdvice: "If an animal appears sick, immediately contact a wildlife veterinarian or local animal rescue. Avoid handling wild animals yourself. For pets, consult a specialized veterinarian, describe the symptoms accurately, and follow their advice carefully. Prioritize professional care to ensure proper treatment and safety.",
    diet: "Bengal tigers are apex predators and primarily hunt large mammals such as deer, wild boar, and water buffalo. They can consume up to 40 kg of meat in a single meal and may hunt every 2-3 days.",
    behavioralTraits: "Tigers are solitary animals that mark and defend territories. They are excellent swimmers and climbers. While typically avoiding humans, they may become aggressive if threatened, injured, or protecting cubs.",
    legalRestrictions: "Bengal tigers are protected under CITES Appendix I, prohibiting international trade. National laws in range countries provide additional protection. Keeping tigers as pets is illegal in most jurisdictions without proper permits and facilities.",
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
    dangerText: "Gray wolves pose a moderate risk to humans. While wolf attacks are rare, they can be dangerous when habituated to humans, rabid, or defending territory. Their strong jaws and pack hunting strategy make them formidable predators.",
    safetyMeasures: "If you encounter a wolf, maintain eye contact, make yourself look large, make loud noises, and back away slowly. Never run from a wolf as it may trigger a chase response. Always keep food secured when in wolf territory and don't feed wolves under any circumstances.",
    about: "The Gray Wolf is one of the world's most widely distributed predators. They typically live in packs of 6-10 individuals with a complex social hierarchy. Adult wolves weigh between 40-80 kg and can run up to 60 km/h. Their howling is used for communication within the pack.",
    habitat: "Gray wolves adapt to many habitats including forests, mountains, tundra, taiga, and grasslands. They typically establish territories of 80-300 square miles depending on prey availability.",
    healthAdvice: "If an animal appears sick, immediately contact a wildlife veterinarian or local animal rescue. Avoid handling wild animals yourself. For pets, consult a specialized veterinarian, describe the symptoms accurately, and follow their advice carefully.",
    diet: "Wolves are carnivores that primarily hunt ungulates like deer, elk, and moose. A pack can consume 20 pounds of meat in a single feeding. They also eat smaller mammals, birds, and sometimes berries.",
    behavioralTraits: "Wolves are highly social animals that live in family groups. They communicate through howling, body language, and scent marking. They're intelligent problem-solvers with strong family bonds and cooperative hunting strategies.",
    legalRestrictions: "Gray wolves are protected under the Endangered Species Act in many regions. Hunting and trapping regulations vary by location, with some areas allowing controlled hunting. Keeping wolves as pets is illegal in most jurisdictions.",
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
    dangerText: "Labrador Retrievers pose a low risk to humans. They are known for their friendly temperament and are rarely aggressive. However, any dog can bite if provoked, scared, or ill. Always approach unfamiliar dogs with caution.",
    safetyMeasures: "When interacting with Labradors, allow the dog to sniff your hand first, avoid sudden movements, and never disturb a dog while eating. Supervise interactions with children and teach them proper handling techniques.",
    about: "The Labrador Retriever is one of the most popular dog breeds worldwide, known for its friendly nature and versatility. Originally bred as working dogs for fishermen in Newfoundland, they excel as family pets, service dogs, and in various working roles. They typically weigh 55-80 pounds and live 10-12 years.",
    habitat: "As domesticated animals, Labradors adapt well to various living environments from apartments to rural settings, though they thrive with adequate space and exercise opportunities. They enjoy water and are natural swimmers.",
    healthAdvice: "Regular veterinary check-ups are essential for Labradors. They're prone to hip and elbow dysplasia, obesity, and eye conditions. Maintain a healthy diet, regular exercise, and weight management. Contact your vet immediately if your Labrador shows signs of illness.",
    diet: "Labradors should eat high-quality commercial dog food appropriate for their age, size, and activity level. They require about 2-3 cups of dry food daily, divided into two meals. Always provide fresh water and limit treats to prevent obesity.",
    behavioralTraits: "Labradors are intelligent, friendly, and outgoing dogs with a strong desire to please. They're energetic, especially in youth, requiring regular exercise and mental stimulation. They get along well with children and other pets, making them excellent family companions.",
    legalRestrictions: "Unlike wild animals, Labradors have few legal restrictions. However, local leash laws, licensing requirements, and breed-specific legislation may apply in some areas. Always follow responsible pet ownership guidelines.",
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
        <div className="w-10 h-10"></div>
      </header>

      <div className="w-full h-[250px] overflow-hidden">
        <img 
          src={animal.imageUrl} 
          alt={animal.name} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 pb-2">
        <h2 className="text-xl font-bold">{animal.name}</h2>
      </div>

      <div className="px-4 pb-2">
        <h3 className="text-base text-green-600 font-medium">Scientific Name</h3>
        <p className="text-blue-600 text-sm font-medium mb-2">{animal.scientificName}</p>
        
        <div className={`${getRiskColor(animal.riskLevel)} text-white px-3 py-1 rounded-full inline-flex items-center text-xs mb-2`}>
          <AlertTriangle className="mr-1" size={12} />
          <span className="font-medium">{animal.riskLevel} Risk</span>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div className="px-4 pb-3 flex justify-around">
        <div className="border border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
          <PawPrint className="text-blue-600 mb-1" size={20} />
          <p className="text-black text-xs font-medium">Type</p>
          <p className="text-blue-600 text-xs font-medium">{animal.type}</p>
        </div>
        <div className="border border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
          <Utensils className="text-blue-600 mb-1" size={20} />
          <p className="text-black text-xs font-medium">Dietary</p>
          <p className="text-blue-600 text-xs font-medium">{animal.dietary}</p>
        </div>
        <div className="border border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center">
          <Moon className="text-blue-600 mb-1" size={20} />
          <p className="text-black text-xs font-medium">Behavior</p>
          <p className="text-blue-600 text-xs font-medium">{animal.behavior}</p>
        </div>
      </div>

      <div className="px-4 py-3 bg-red-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Danger Level</h3>
        <p className="text-xs">{animal.dangerText}</p>
      </div>

      <div className="px-4 py-3 bg-green-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Safety Measures</h3>
        <p className="text-xs">{animal.safetyMeasures}</p>
      </div>

      <div className="px-4 py-3 border border-gray-300 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">About</h3>
        <p className="text-xs">{animal.about}</p>
      </div>

      <div className="px-4 py-3 bg-purple-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Habitat</h3>
        <p className="text-xs">{animal.habitat}</p>
      </div>

      <div className="px-4 py-3 bg-yellow-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Health Advice</h3>
        <p className="text-xs">{animal.healthAdvice}</p>
      </div>

      <div className="px-4 py-3 bg-pink-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Diet</h3>
        <p className="text-xs">{animal.diet}</p>
      </div>

      <div className="px-4 py-3 bg-green-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Behavioral Traits</h3>
        <p className="text-xs">{animal.behavioralTraits}</p>
      </div>

      <div className="px-4 py-3 bg-blue-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Legal Restrictions</h3>
        <p className="text-xs">{animal.legalRestrictions}</p>
      </div>

      <div className="px-4 py-3 border border-gray-300 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Interesting Facts</h3>
        <ul className="space-y-2">
          {animal.interestingFacts.map((item, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mr-2 mt-0.5">
                <Info className="h-3 w-3 text-white" />
              </div>
              <p className="text-xs">{item.fact}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 py-3 bg-red-100 mx-4 rounded-lg mb-3">
        <h3 className="text-base font-semibold mb-1">Emergency Contacts</h3>
        <ul className="space-y-2">
          {animal.emergencyContacts.map((contact, index) => (
            <li key={index} className="flex items-center">
              <PhoneCall className="h-4 w-4 text-red-600 mr-2" />
              <div>
                <p className="text-xs font-semibold">{contact.name}</p>
                <p className="text-xs">{contact.phone}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 py-3 mx-4 mb-3">
        <h3 className="text-base font-semibold mb-2">Similar Species</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {animal.similarSpecies.map((species, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img src={species.imageUrl} alt={species.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-center mt-1">{species.name}</p>
            </div>
          ))}
        </div>
      </div>

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
