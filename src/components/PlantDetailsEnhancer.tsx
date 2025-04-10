
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PlantRequirements from './PlantRequirements';

// This component can be added to the main App component to enhance plant detail pages
export const PlantDetailsEnhancer: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on a plant detail page
    if (location.pathname.match(/\/plant\/\d+/)) {
      // Function to inject our component
      const injectRequirements = () => {
        // Look for the general information section
        const generalInfoHeader = document.querySelector('h2.text-xl.font-semibold.mb-4');
        
        // If we found it and haven't already injected our component
        if (generalInfoHeader && !document.getElementById('plant-requirements-section')) {
          // Create a container for our component
          const container = document.createElement('div');
          container.id = 'plant-requirements-section';
          
          // Insert it before the general info section
          const parent = generalInfoHeader.parentElement;
          if (parent) {
            parent.insertBefore(container, generalInfoHeader);
            
            // Use ReactDOM to render our component
            const root = document.createElement('div');
            root.innerHTML = `
              <h2 class="text-xl font-semibold mb-4 text-left">Plant Requirements</h2>
              <div id="plant-requirements-content"></div>
            `;
            container.appendChild(root);
            
            // Since we're manipulating the DOM directly, we need to use ReactDOM.render
            // But we should make sure React and ReactDOM are available
            if (window.React && window.ReactDOM) {
              window.ReactDOM.render(
                <PlantRequirements plant={{}} />,
                document.getElementById('plant-requirements-content')
              );
            }
          }
        }
      };
      
      // Try to inject immediately and also set up a small delay
      // in case the page is still loading
      injectRequirements();
      const timer = setTimeout(injectRequirements, 1000);
      
      return () => {
        clearTimeout(timer);
        // Clean up our injected component if needed
        const container = document.getElementById('plant-requirements-section');
        if (container) {
          container.remove();
        }
      };
    }
  }, [location.pathname]);
  
  // This component doesn't render anything itself
  return null;
};

export default PlantDetailsEnhancer;
