
import React from "react";
import { createRoot } from "react-dom/client";
import PlantRequirements from "@/components/PlantRequirements";

/**
 * Injects the PlantRequirements component above the "General Information" heading
 * in the plant detail page.
 */
export const injectPlantRequirements = () => {
  // Wait a bit for the DOM to be ready
  setTimeout(() => {
    try {
      // Find the "General Information" heading
      const headings = document.querySelectorAll('h2');
      let generalInfoHeading = null;
      
      for (const heading of headings) {
        if (heading.textContent === 'General information') {
          generalInfoHeading = heading;
          break;
        }
      }

      if (generalInfoHeading) {
        // Check if our container already exists (to prevent duplicates)
        const existingContainer = document.getElementById('plant-requirements-container');
        if (existingContainer) {
          return;
        }
        
        // Create a container for our PlantRequirements component
        const container = document.createElement('div');
        container.id = 'plant-requirements-container';
        
        // Insert the container before the general info heading
        generalInfoHeading.parentNode?.insertBefore(container, generalInfoHeading);
        
        // Create root and render using React 18 createRoot API
        const root = createRoot(container);
        root.render(<PlantRequirements />);
      } else {
        console.error("Could not find 'General information' heading to inject PlantRequirements");
      }
    } catch (error) {
      console.error("Error injecting PlantRequirements:", error);
    }
  }, 500);
};
