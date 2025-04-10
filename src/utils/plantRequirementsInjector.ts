
import PlantRequirements from '../components/PlantRequirements';
import { createRoot } from 'react-dom/client';

export const injectPlantRequirements = () => {
  // This function will be called when the app initializes
  // It will look for plant detail pages and inject our component
  
  // We can use a MutationObserver to watch for DOM changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Check if we're on a plant detail page by looking for specific elements
        const isPlantDetailPage = document.location.pathname.includes('/plant/');
        
        if (isPlantDetailPage) {
          // Find the right spot to inject our component
          // For example, before the "General Information" section
          const generalInfoHeader = document.querySelector('h2.text-xl.font-semibold.mb-4');
          
          // Check if the header exists and contains the text "General Information"
          if (generalInfoHeader && 
              generalInfoHeader.textContent && 
              generalInfoHeader.textContent.includes("General Information") &&
              !document.getElementById('plant-requirements-section')) {
            
            const container = document.createElement('div');
            container.id = 'plant-requirements-section';
            
            // Insert before the general info section
            generalInfoHeader.parentElement?.insertBefore(container, generalInfoHeader);
            
            // Render our component into this container
            const root = createRoot(container);
            root.render(<PlantRequirements plant={{}} />);
            
            // We found and processed the page, so disconnect the observer
            observer.disconnect();
          }
        }
      }
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true,
    subtree: true 
  });
  
  return () => {
    // Cleanup function to disconnect the observer
    observer.disconnect();
  };
};
