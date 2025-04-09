
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
// In a real implementation, you would call the actual API with the proper API key
export const identifyAnimal = async (imageData: string): Promise<string | null> => {
  try {
    console.log("Simulating Google Vision API call for animal identification");
    
    // Compress the image before sending it to the API (to save bandwidth)
    const compressedImage = await compressImage(imageData, 0.7);
    
    // In a real implementation, you would uncomment the following code
    // and replace the placeholders with actual API calls
    /*
    const apiKey = getApiKey("googleVision");
    const endpoint = apiConfig.googleVision.baseUrl;
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: compressedImage.split(',')[1]
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: apiConfig.googleVision.maxResults
              },
            ]
          }
        ]
      })
    });
    
    const data = await response.json();
    
    if (data.responses && data.responses[0].labelAnnotations) {
      const animals = data.responses[0].labelAnnotations
        .filter(label => label.description && label.score > 0.7)
        .map(label => label.description);
        
      if (animals.length > 0) {
        return animals[0];
      }
    }
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Improved simulation logic - look for patterns in the image URL to determine animal type
    // For demonstration purposes, we'll use the current route to determine which animal to return
    const currentPath = window.location.pathname;
    
    // If we're on a specific animal detail page, return that animal
    if (currentPath.includes("/animal/1")) {
      return "Bengal Tiger";
    } else if (currentPath.includes("/animal/2")) {
      return "Gray Wolf";
    } else if (currentPath.includes("/animal/3")) {
      return "Labrador Retriever";
    }
    
    // For scanning new animals, match based on the image URL if possible
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
    
    // Default to a random animal if no match is found
    const animals = ["Labrador Retriever", "Gray Wolf", "Bengal Tiger"];
    const randomIndex = Math.floor(Math.random() * animals.length);
    return animals[randomIndex];
  } catch (error) {
    console.error("Error identifying animal:", error);
    toast.error("Failed to identify animal. Please try again.");
    return null;
  }
};

// This function simulates getting detailed information from OpenAI
// In a real implementation, you would call the actual OpenAI API with the proper API key
export const getAnimalDetails = async (animalName: string): Promise<AnimalDetails | null> => {
  try {
    console.log(`Simulating OpenAI API call for details about: ${animalName}`);
    
    // In a real implementation, you would uncomment the following code
    // and replace the placeholders with actual API calls
    /*
    const apiKey = getApiKey("openAI");
    const model = apiConfig.openAI.model;
    const maxTokens = apiConfig.openAI.maxTokens;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert zoologist and animal specialist. Provide detailed information about animals in JSON format."
          },
          {
            role: "user",
            content: `Provide detailed information about ${animalName} in the following JSON format: 
            {
              "name": "Common name",
              "scientificName": "Scientific name",
              "riskLevel": "High/Moderate/Low",
              "type": "Animal type (mammal, reptile, etc.)",
              "dietary": "Carnivore/Herbivore/Omnivore",
              "behavior": "Nocturnal/Diurnal/Crepuscular",
              "dangerText": "Description of potential dangers",
              "safetyMeasures": "Safety measures for encounters",
              "about": "General description",
              "habitat": "Natural habitat description",
              "healthAdvice": "Health advice related to this animal",
              "diet": "Detailed diet information",
              "behavioralTraits": "Notable behavioral characteristics",
              "legalRestrictions": "Any legal restrictions",
              "interestingFacts": [{"fact": "Interesting fact 1"}, {"fact": "Interesting fact 2"}, {"fact": "Interesting fact 3"}],
              "emergencyContacts": [{"name": "Contact name 1", "phone": "Contact phone 1"}, {"name": "Contact name 2", "phone": "Contact phone 2"}]
            }`
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    const animalDetails = JSON.parse(data.choices[0].message.content);
    
    // Add an ID and save to history
    const newAnimal = {
      ...animalDetails,
      id: (animalScanHistory.length + 1).toString(),
      imageUrl: "/path/to/generated/image.jpg", // In a real app, you'd generate or fetch an image
      similarSpecies: [] // In a real app, you'd get this data
    };
    
    // Save to history
    animalScanHistory.push(newAnimal);
    return newAnimal;
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Improved matching logic - make it case insensitive and match partial names
    const animalKey = animalName.toLowerCase();
    
    // Look for matches in the existing animal scan history
    let matchedAnimal = null;
    
    if (animalKey.includes("tiger") || animalKey.includes("cat") || animalKey.includes("bengal")) {
      matchedAnimal = {...animalScanHistory[0]};
    } else if (animalKey.includes("wolf") || animalKey.includes("coyote") || animalKey.includes("gray")) {
      matchedAnimal = {...animalScanHistory[1]};
    } else if (animalKey.includes("lab") || animalKey.includes("retriever") || animalKey.includes("dog")) {
      matchedAnimal = {...animalScanHistory[2]};
    } else {
      // Default to a random animal if no match
      const randomIndex = Math.floor(Math.random() * animalScanHistory.length);
      matchedAnimal = {...animalScanHistory[randomIndex]};
    }
    
    // Generate a new ID if this is a newly scanned animal
    if (window.location.pathname === "/scan-camera") {
      matchedAnimal.id = (animalScanHistory.length + 1).toString();
      
      // Add to history if it's a new scan
      const newAnimalCopy = {...matchedAnimal};
      animalScanHistory.push(newAnimalCopy);
    }
    
    // Return the matched animal
    return matchedAnimal;
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
