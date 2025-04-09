
// This file provides a safe way to access API keys without hardcoding them
// In a production environment, these would be set through environment variables

// For security, we're using placeholder values here
// In a real application, you would use environment variables
export const apiKeys = {
  // Never expose API keys directly in the frontend code
  // This is just a placeholder
  googleVision: process.env.GOOGLE_VISION_API_KEY || "placeholder",
  googlePlaces: process.env.GOOGLE_PLACES_API_KEY || "placeholder",
  openAI: process.env.OPENAI_API_KEY || "placeholder",
};

// Access keys safely
export const getApiKey = (keyName: "googleVision" | "googlePlaces" | "openAI"): string => {
  // In a real application, these API calls would be handled by a backend service
  // Frontend should never directly use API keys
  console.log(`Attempting to access ${keyName} API key - this should be done from a secure backend service`);
  return "API_KEY_ACCESSED_FROM_BACKEND";
};

// Configuration options for APIs
export const apiConfig = {
  googleVision: {
    baseUrl: "https://vision.googleapis.com/v1/images:annotate",
    maxResults: 10,
  },
  openAI: {
    model: "gpt-4",
    maxTokens: 1000,
  },
  googlePlaces: {
    baseUrl: "https://maps.googleapis.com/maps/api/place",
    radius: 5000,
    types: "veterinary_care,zoo,animal_shelter",
  },
};
