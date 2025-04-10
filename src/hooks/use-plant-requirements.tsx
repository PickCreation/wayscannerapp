
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PlantRequirements from '@/components/PlantRequirements';

export const usePlantRequirements = (plant: any) => {
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  useEffect(() => {
    // Look for the section where we want to insert the Plant Requirements
    // This selector should target the element just before where we want to insert
    // For example, if we want to insert before "General Information", we look for that heading
    const generalInfoSection = document.querySelector('h2:contains("General Information")');
    
    if (generalInfoSection) {
      // Find the parent of the general info section
      const parent = generalInfoSection.parentElement;
      
      if (parent) {
        // Create a new div to contain our component
        const requirementsContainer = document.createElement('div');
        requirementsContainer.id = 'plant-requirements-container';
        
        // Insert it before the general info section
        parent.insertBefore(requirementsContainer, generalInfoSection);
        
        // Set this as our target for the portal
        setTargetElement(requirementsContainer);
      }
    }
    
    // Cleanup function
    return () => {
      const container = document.getElementById('plant-requirements-container');
      if (container) {
        container.remove();
      }
    };
  }, []);

  // Return a component that will render our requirements section using a portal
  return {
    PlantRequirementsPortal: () => targetElement 
      ? createPortal(<PlantRequirements plant={plant} />, targetElement) 
      : null
  };
};
