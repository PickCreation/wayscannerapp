
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This hook can be used in a component that's part of the app
export const useInjectPlantRequirements = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on a plant detail page
    if (!location.pathname.startsWith('/plant/')) {
      return;
    }
    
    // Create a script element to inject our code
    const script = document.createElement('script');
    script.id = 'plant-requirements-injector';
    script.text = `
      (function() {
        // Function to check if the element exists
        function waitForElement(selector, callback, maxAttempts = 10, interval = 500) {
          let attempts = 0;
          
          const check = () => {
            attempts++;
            const element = document.querySelector(selector);
            
            if (element) {
              callback(element);
              return;
            }
            
            if (attempts >= maxAttempts) {
              console.warn('Could not find element with selector:', selector);
              return;
            }
            
            setTimeout(check, interval);
          };
          
          check();
        }
        
        // Wait for the General Information heading
        waitForElement('h2:contains("General Information")', (generalInfoHeading) => {
          // Check if we've already injected the component
          if (document.getElementById('plant-requirements-section')) {
            return;
          }
          
          // Create the plant requirements section
          const requirementsSection = document.createElement('div');
          requirementsSection.id = 'plant-requirements-section';
          requirementsSection.className = 'mb-8';
          requirementsSection.innerHTML = \`
            <h2 class="text-xl font-semibold mb-4 text-left">Plant Requirements</h2>
            <div class="space-y-2">
              <!-- Pot -->
              <div class="border rounded-md overflow-hidden">
                <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent" onclick="toggleRequirement('pot')">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    <span>Pot</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pot-icon"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div id="pot-content" class="hidden px-4 pb-4">
                  <p>Choose a pot with drainage holes that is 1-2 inches larger than the plant's root ball.</p>
                </div>
              </div>
              
              <!-- Add other requirement sections similarly -->
              <!-- Soil, Lighting, Humidity, Hardiness Zone, Temperature -->
            </div>
          \`;
          
          // Insert the section before the general info heading
          const parentElement = generalInfoHeading.parentElement;
          if (parentElement && parentElement.parentElement) {
            parentElement.parentElement.insertBefore(requirementsSection, parentElement);
          }
          
          // Add the toggle function
          window.toggleRequirement = function(id) {
            const content = document.getElementById(id + '-content');
            const icon = document.querySelector('.' + id + '-icon');
            
            if (content) {
              if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
              } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
              }
            }
          };
        });
      })();
    `;
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // Clean up when the component unmounts
    return () => {
      const scriptElement = document.getElementById('plant-requirements-injector');
      if (scriptElement) {
        scriptElement.remove();
      }
      
      const requirementsSection = document.getElementById('plant-requirements-section');
      if (requirementsSection) {
        requirementsSection.remove();
      }
      
      // Remove the global toggle function
      delete window.toggleRequirement;
    };
  }, [location.pathname]);
};

export default useInjectPlantRequirements;
