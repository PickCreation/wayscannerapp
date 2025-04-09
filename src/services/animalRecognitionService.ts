import { toast } from "sonner";
import { getApiKey, apiConfig } from "@/config/environment";
import { compressImage } from "@/utils/imageProcessing";

// Type definition for animal details
export interface AnimalDetails {
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

// Mock database for storing scan results
const animalScanHistory: AnimalDetails[] = [
  {
    id: "1",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    riskLevel: "High",
    imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png",
    type: "Mammal",
    dietary: "Carnivore",
    behavior: "Nocturnal",
    dangerText: "Bengal Tigers are extremely dangerous predators with powerful builds, sharp teeth, and retractable claws. Attacks, though rare, can be fatal.",
    safetyMeasures: "If encountered, remain calm, don't run, and back away slowly while facing the tiger.",
    about: "The Bengal Tiger is an endangered apex predator with an orange coat and black stripes.",
    habitat: "Found in tropical rainforests, mangrove swamps, grasslands, and taiga.",
    healthAdvice: "For sick wild animals, contact wildlife specialists immediately.",
    diet: "Hunts large mammals like deer, wild boar, and water buffalo.",
    behavioralTraits: "Solitary animals that mark territories. Excellent swimmers and climbers.",
    legalRestrictions: "Protected under CITES Appendix I, prohibiting international trade.",
    interestingFacts: [
      { fact: "Each tiger has a unique stripe pattern, like human fingerprints." },
      { fact: "Tigers can leap distances of up to 6 meters." },
      { fact: "A tiger's roar can be heard up to 3 kilometers away." }
    ],
    emergencyContacts: [
      { name: "Wildlife Emergency Hotline", phone: "+1-800-WILDLIFE" },
      { name: "Poison Control Center", phone: "+1-800-222-1222" }
    ],
    similarSpecies: [
      { name: "Malayan Tiger", imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png" },
      { name: "South China Tiger", imageUrl: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png" }
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
    dangerText: "Gray wolves pose moderate risk to humans. Attacks are rare but possible.",
    safetyMeasures: "If encountered, maintain eye contact, appear large, make noise, and back away slowly.",
    about: "Widely distributed predators living in packs of 6-10 with complex social hierarchy.",
    habitat: "Adaptable to forests, mountains, tundra, taiga, and grasslands.",
    healthAdvice: "For sick wild animals, contact wildlife specialists immediately.",
    diet: "Primarily hunt ungulates like deer, elk, and moose.",
    behavioralTraits: "Highly social animals living in family groups.",
    legalRestrictions: "Protected under the Endangered Species Act in many regions.",
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
      { name: "Arctic Wolf", imageUrl: "/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" }
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
    dangerText: "Labradors pose low risk to humans. Known for friendly temperament and rarely aggressive.",
    safetyMeasures: "Let the dog sniff your hand first, avoid sudden movements, and never disturb while eating.",
    about: "One of the most popular dog breeds worldwide, known for friendliness and versatility.",
    habitat: "Domesticated animals that adapt to various environments from apartments to rural settings.",
    healthAdvice: "Regular vet check-ups essential. Prone to hip/elbow dysplasia, obesity, and eye conditions.",
    diet: "Should eat high-quality dog food suitable for age, size, and activity level.",
    behavioralTraits: "Intelligent, friendly, and outgoing with strong desire to please.",
    legalRestrictions: "Few legal restrictions compared to wild animals.",
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
      { name: "Chesapeake Bay Retriever", imageUrl: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png" }
    ]
  }
];

// This function simulates sending an image to Google Vision API
export const identifyAnimal = async (imageData: string): Promise<string | null> => {
  try {
    console.log("Simulating Google Vision API call for animal identification");
    
    // Compress the image before sending it to the API (to save bandwidth)
    const compressedImage = await compressImage(imageData, 0.7);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Direct image URL matching for demonstration
    if (imageData.includes("a3386c5c-af28-42ee-96df-91008ff21cb5")) {
      return "Bengal Tiger";
    } else if (imageData.includes("4c436a75-e04b-4265-8025-91e7bb146566")) {
      return "Gray Wolf";
    } else if (imageData.includes("dc7e6fce-2b21-472e-99f7-7f20be83b76f")) {
      return "Labrador Retriever";
    } else if (imageData.includes("69501614-b92c-43f9-89e5-85971b5b6ede")) {
      // This is the sample image from handleCapture
      return "Bengal Tiger";
    }
    
    // If still here, return a default animal
    return "Bengal Tiger";
  } catch (error) {
    console.error("Error identifying animal:", error);
    toast.error("Failed to identify animal. Please try again.");
    return null;
  }
};

// This function simulates getting detailed information about an animal
export const getAnimalDetails = async (animalName: string): Promise<AnimalDetails | null> => {
  try {
    console.log(`Simulating OpenAI API call for details about: ${animalName}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Direct name matching (case insensitive)
    const animalKey = animalName.toLowerCase().trim();
    let matchedAnimal: AnimalDetails | null = null;
    
    if (animalKey.includes("tiger") || animalKey.includes("bengal")) {
      matchedAnimal = {...animalScanHistory[0]};
    } else if (animalKey.includes("wolf") || animalKey.includes("gray")) {
      matchedAnimal = {...animalScanHistory[1]};
    } else if (animalKey.includes("lab") || animalKey.includes("retriever") || animalKey.includes("dog")) {
      matchedAnimal = {...animalScanHistory[2]};
    }
    
    // If no match found, default to the Bengal Tiger
    if (!matchedAnimal) {
      matchedAnimal = {...animalScanHistory[0]};
    }
    
    // For new scans, create a new ID and add to history
    if (window.location.pathname === "/scan-camera") {
      const newId = (animalScanHistory.length + 1).toString();
      matchedAnimal = {
        ...matchedAnimal,
        id: newId,
        timestamp: new Date() // Add a timestamp for the scan
      };
      
      // Add a copy to our history
      const newAnimalCopy = {...matchedAnimal};
      animalScanHistory.push(newAnimalCopy);
      
      console.log(`New animal scan saved with ID: ${newId}`);
    }
    
    return matchedAnimal;
  } catch (error) {
    console.error("Error getting animal details:", error);
    toast.error("Failed to get animal details. Please try again.");
    return null;
  }
};

// This function would handle getting local emergency contacts using the Google Places API
export const getLocalEmergencyContacts = async (location: GeolocationPosition): Promise<{name: string, phone: string}[]> => {
  try {
    console.log("Simulating Google Places API call for local emergency contacts");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return [
      { name: "Local Wildlife Services", phone: "+1-555-123-4567" },
      { name: "Animal Control Center", phone: "+1-555-987-6543" },
      { name: "Veterinary Emergency", phone: "+1-555-789-0123" }
    ];
  } catch (error) {
    console.error("Error getting local emergency contacts:", error);
    return [
      { name: "Wildlife Emergency Hotline", phone: "+1-800-WILDLIFE" }
    ];
  }
};

// Function to save a new animal scan result
export const saveAnimalScan = (animalDetails: AnimalDetails): void => {
  // In a real app, this would save to a database
  animalScanHistory.push(animalDetails);
  console.log("Animal scan saved:", animalDetails.name);
};

// Function to get all animal scan results
export const getAnimalScanHistory = (): AnimalDetails[] => {
  // In a real app, this would fetch from a database
  return [...animalScanHistory];
};
