
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock plant data for the plant detail page
const plants = {
  "1": {
    id: "1",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    careLevel: "Easy",
    light: "Part sun",
    water: "Moderate",
    humidity: "High (>60%)",
    temperature: "73°F - 95°F",
    hardiness: "10a - 11b",
    description: "The ZZ plant is a popular houseplant known for its resilience and ability to thrive in low-light conditions.",
    origin: "Native to Eastern Africa."
  },
  "2": {
    id: "2",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    careLevel: "Easy",
    light: "Low to bright indirect",
    water: "Low",
    humidity: "Average",
    temperature: "65°F - 85°F",
    hardiness: "9a - 11b",
    description: "Snake plants are some of the most tolerant houseplants you can find. They can survive low light levels and irregular watering.",
    origin: "Native to West Africa."
  }
};

// Function to get plant data by ID
export async function getPlant(id: string) {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(plants[id] || null);
    }, 300);
  });
}
