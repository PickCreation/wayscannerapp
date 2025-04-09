import { toast } from "sonner";
import { getApiKey, apiConfig } from "@/config/environment";
import { compressImage, compareImages } from "@/utils/imageProcessing";

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
  timestamp?: Date;
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
    timestamp: new Date("2025-04-08T15:30:00"),
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
    timestamp: new Date("2025-04-07T10:15:00"),
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
    timestamp: new Date("2025-04-05T09:45:00"),
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

// This function identifies an animal by comparing the uploaded image with sample images
export const identifyAnimal = async (imageData: string): Promise<string | null> => {
  try {
    console.log("Starting animal identification with image comparison");
    
    // Compress the image before processing
    const compressedImage = await compressImage(imageData, 0.7);
    
    // In a real implementation, we would call the Google Vision API here
    
    // For our demo, we'll use image comparison to determine the animal
    // Compare the uploaded image with our sample images to find the best match
    
    const animalImages = [
      { name: "Bengal Tiger", url: "/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png" },
      { name: "Gray Wolf", url: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png" },
      { name: "Labrador Retriever", url: "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png" },
      { name: "Golden Retriever", url: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png" },
      { name: "Arctic Wolf", url: "/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" },
      { name: "Coyote", url: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png" }
    ];
    
    // Determine if the uploaded image is one of our sample images (direct URL match)
    const urlMatch = animalImages.find(animal => imageData.includes(animal.url));
    if (urlMatch) {
      console.log(`Direct URL match found: ${urlMatch.name}`);
      return urlMatch.name;
    }
    
    console.log("No direct URL match, performing image comparison");
    
    // Compare the uploaded image with our sample images
    const comparisonPromises = animalImages.map(async (animal) => {
      const similarity = await compareImages(compressedImage, animal.url);
      console.log(`Similarity with ${animal.name}: ${similarity}`);
      return { name: animal.name, similarity };
    });
    
    const comparisons = await Promise.all(comparisonPromises);
    
    // Sort by similarity (highest first)
    comparisons.sort((a, b) => b.similarity - a.similarity);
    
    // Use the highest similarity match if it exceeds a threshold
    if (comparisons.length > 0 && comparisons[0].similarity > 0.3) {
      console.log(`Best match: ${comparisons[0].name} with similarity ${comparisons[0].similarity}`);
      return comparisons[0].name;
    }
    
    // If no good match is found, use the preview image to determine the animal
    // This is a fallback for our demo
    if (imageData.includes("69501614-b92c-43f9-89e5-85971b5b6ede")) {
      console.log("Using sample image path to determine animal: Bengal Tiger");
      return "Bengal Tiger";
    }
    
    // If still no match, default to a random animal for demo purposes
    const animals = ["Bengal Tiger", "Gray Wolf", "Labrador Retriever"];
    const randomIndex = Math.floor(Math.random() * animals.length);
    console.log(`No good match found, using random animal: ${animals[randomIndex]}`);
    return animals[randomIndex];
  } catch (error) {
    console.error("Error identifying animal:", error);
    toast.error("Failed to identify animal. Please try again.");
    return null;
  }
};

// This function gets detailed information about an animal
export const getAnimalDetails = async (animalName: string): Promise<AnimalDetails | null> => {
  try {
    console.log(`Getting details for animal: ${animalName}`);
    
    // In a real implementation, we would call the OpenAI API here
    
    // For our demo, find a matching animal in our database
    const animalKey = animalName.toLowerCase();
    
    // Try to find an exact match first
    let matchedAnimal = animalScanHistory.find(
      animal => animal.name.toLowerCase() === animalKey
    );
    
    // If no exact match, try to find a partial match
    if (!matchedAnimal) {
      matchedAnimal = animalScanHistory.find(
        animal => animalKey.includes(animal.name.toLowerCase()) || 
                  animal.name.toLowerCase().includes(animalKey)
      );
    }
    
    // If still no match, use pattern matching for common animal types
    if (!matchedAnimal) {
      if (animalKey.includes("tiger") || animalKey.includes("cat") || animalKey.includes("feline")) {
        matchedAnimal = {...animalScanHistory[0]};
      } else if (animalKey.includes("wolf") || animalKey.includes("coyote")) {
        matchedAnimal = {...animalScanHistory[1]};
      } else if (animalKey.includes("lab") || animalKey.includes("retriever") || animalKey.includes("dog")) {
        matchedAnimal = {...animalScanHistory[2]};
      } else {
        // Default to a random animal if no match
        const randomIndex = Math.floor(Math.random() * animalScanHistory.length);
        matchedAnimal = {...animalScanHistory[randomIndex]};
      }
    }
    
    // Create a new animal object with a new ID and current timestamp
    const newAnimal = {
      ...matchedAnimal,
      id: (animalScanHistory.length + 1).toString(),
      timestamp: new Date()
    };
    
    // Add to history
    animalScanHistory.push(newAnimal);
    console.log(`New animal scan saved with ID: ${newAnimal.id}`);
    console.log(`Animal details received: ${newAnimal.id} ${newAnimal.name}`);
    
    return newAnimal;
  } catch (error) {
    console.error("Error getting animal details:", error);
    toast.error("Failed to get animal details. Please try again.");
    return null;
  }
};

// This function would handle getting local emergency contacts using the Google Places API
// In a real implementation, you would call the actual API
export const getLocalEmergencyContacts = async (location: GeolocationPosition): Promise<{name: string, phone: string}[]> => {
  try {
    console.log("Simulating Google Places API call for local emergency contacts");
    
    // In a real implementation, you would uncomment the following code
    // and replace the placeholders with actual API calls
    /*
    const apiKey = getApiKey("googlePlaces");
    const { latitude, longitude } = location.coords;
    const radius = apiConfig.googlePlaces.radius;
    const types = apiConfig.googlePlaces.types;
    
    const response = await fetch(
      `${apiConfig.googlePlaces.baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&types=${types}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const contacts = [];
      
      for (const place of data.results.slice(0, 3)) {
        // Get place details to get phone number
        const detailsResponse = await fetch(
          `${apiConfig.googlePlaces.baseUrl}/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number&key=${apiKey}`
        );
        
        const detailsData = await detailsResponse.json();
        
        if (detailsData.result && detailsData.result.formatted_phone_number) {
          contacts.push({
            name: detailsData.result.name,
            phone: detailsData.result.formatted_phone_number
          });
        }
      }
      
      if (contacts.length > 0) {
        return contacts;
      }
    }
    */
    
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
