
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantRequirements from './PlantRequirements';

// This component should be added to your app somewhere, possibly as a child of the main App component
const PlantDetailInjector: React.FC = () => {
  const navigate = useNavigate();
  const [isPlantDetailPage, setIsPlantDetailPage] = useState(false);
  
  useEffect(() => {
    // Function to check if we're on a plant detail page and inject our component
    const checkAndInject = () => {
      // Check the current URL
      const isPlantDetail = window.location.pathname.match(/\/plant\/\d+/) !== null;
      setIsPlantDetailPage(isPlantDetail);
      
      if (isPlantDetail) {
        // Wait a moment for the page to fully render
        setTimeout(() => {
          // Find where to inject our component
          const contentElements = document.querySelectorAll('h2');
          let generalInfoElement = null;
          
          // Find the General Information heading
          for (const element of contentElements) {
            if (element.textContent?.includes('General Information')) {
              generalInfoElement = element;
              break;
            }
          }
          
          if (generalInfoElement && !document.getElementById('plant-requirements-section')) {
            // Create a container for our component
            const container = document.createElement('div');
            container.id = 'plant-requirements-section';
            
            // Insert it before the General Information section
            generalInfoElement.parentElement?.parentElement?.insertBefore(container, generalInfoElement.parentElement);
            
            // Render a simple placeholder for now - in a real app, you would use ReactDOM.createPortal
            container.innerHTML = `
              <div class="mb-8">
                <h2 class="text-xl font-semibold mb-4 text-left">Plant Requirements</h2>
                <div id="plant-requirements-content"></div>
              </div>
            `;
            
            // In the real implementation, you would render the React component here
            // For now, we'll just add some dummy content
            document.getElementById('plant-requirements-content')?.appendChild(
              document.createRange().createContextualFragment(`
                <div class="space-y-2">
                  <div class="border rounded-md overflow-hidden">
                    <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent">
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        <span>Pot</span>
                      </div>
                    </button>
                  </div>
                  <!-- Add more items here -->
                </div>
              `)
            );
          }
        }, 500);
      }
    };
    
    // Run once on mount
    checkAndInject();
    
    // Also run when the URL changes
    const handleRouteChange = () => {
      checkAndInject();
    };
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      // Remove the injected component if it exists
      const section = document.getElementById('plant-requirements-section');
      if (section) {
        section.remove();
      }
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default PlantDetailInjector;
