
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import PlantRequirements from '@/components/PlantRequirements';

// This hook can be used in the main App component or any component that's always rendered
export const usePlantDetailEnhancer = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Only run on plant detail pages
    if (!location.pathname.startsWith('/plant/')) {
      return;
    }
    
    // Function to inject the PlantRequirements component
    const injectRequirements = () => {
      // If we've already injected the component, don't do it again
      if (document.getElementById('plant-requirements-section')) {
        return;
      }
      
      // Find a good insertion point - for example, before the General Information section
      // We need to select an element that's guaranteed to be on the page
      const contentSection = document.querySelector('.max-w-4xl.mx-auto.p-4');
      
      if (!contentSection) {
        // If we can't find the content section, try again later
        return false;
      }
      
      // Look for all headings in the content section
      const headings = contentSection.querySelectorAll('h2');
      let generalInfoHeading = null;
      
      // Find the General Information heading
      for (const heading of headings) {
        if (heading.textContent?.includes('General Information')) {
          generalInfoHeading = heading;
          break;
        }
      }
      
      if (!generalInfoHeading) {
        // If we can't find the General Information heading, try again later
        return false;
      }
      
      // Create our container
      const container = document.createElement('div');
      container.id = 'plant-requirements-section';
      container.className = 'mb-8'; // Match the styling of other sections
      
      // Insert it before the General Information section
      const parentElement = generalInfoHeading.parentElement;
      if (parentElement && parentElement.parentElement) {
        parentElement.parentElement.insertBefore(container, parentElement);
        
        // Render our component into the container
        const root = createRoot(container);
        root.render(<PlantRequirements plant={{}} />);
        
        return true;
      }
      
      return false;
    };
    
    // Try to inject the component immediately
    let injected = injectRequirements();
    
    // If it didn't work, set up a retry mechanism
    if (!injected) {
      const intervalId = setInterval(() => {
        injected = injectRequirements();
        if (injected) {
          clearInterval(intervalId);
        }
      }, 500);
      
      // Clean up after 10 seconds to avoid infinite retries
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);
      
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
    
    // Clean up function
    return () => {
      const section = document.getElementById('plant-requirements-section');
      if (section) {
        section.remove();
      }
    };
  }, [location.pathname]);
};

export default usePlantDetailEnhancer;
