
// This script should be loaded after the React application has initialized

(function injectPlantRequirements() {
  // Function to check if we're on a plant detail page
  function isPlantDetailPage() {
    return window.location.pathname.match(/\/plant\/\d+/) !== null;
  }
  
  // Function to inject our component
  function injectComponent() {
    if (!isPlantDetailPage()) return;
    
    // Check if we've already injected the component
    if (document.getElementById('plant-requirements-section')) return;
    
    // Find the general information heading
    const contentSection = document.querySelector('.max-w-4xl.mx-auto.p-4');
    if (!contentSection) return;
    
    const headings = contentSection.querySelectorAll('h2');
    let generalInfoHeading = null;
    
    for (const heading of headings) {
      if (heading.textContent && heading.textContent.includes('General Information')) {
        generalInfoHeading = heading;
        break;
      }
    }
    
    if (!generalInfoHeading) return;
    
    // Create the plant requirements section
    const requirementsSection = document.createElement('div');
    requirementsSection.id = 'plant-requirements-section';
    requirementsSection.className = 'mb-8';
    requirementsSection.innerHTML = `
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
        
        <!-- Soil -->
        <div class="border rounded-md overflow-hidden">
          <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent" onclick="toggleRequirement('soil')">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Soil</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="soil-icon"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div id="soil-content" class="hidden px-4 pb-4">
            <p>Well-draining potting mix with some perlite or sand for improved drainage.</p>
          </div>
        </div>
        
        <!-- Lighting -->
        <div class="border rounded-md overflow-hidden">
          <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent" onclick="toggleRequirement('lighting')">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Lighting</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lighting-icon"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div id="lighting-content" class="hidden px-4 pb-4">
            <p>Bright, indirect light. Avoid direct sunlight which can scorch the leaves.</p>
          </div>
        </div>
        
        <!-- Humidity -->
        <div class="border rounded-md overflow-hidden">
          <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent" onclick="toggleRequirement('humidity')">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Humidity</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="humidity-icon"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div id="humidity-content" class="hidden px-4 pb-4">
            <p>Medium to high humidity. Consider using a humidifier or pebble tray.</p>
          </div>
        </div>
        
        <!-- Hardiness Zone -->
        <div class="border rounded-md overflow-hidden">
          <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent" onclick="toggleRequirement('hardiness-zone')">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Hardiness Zone</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hardiness-zone-icon"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div id="hardiness-zone-content" class="hidden px-4 pb-4">
            <p>USDA Zones 9-11. Not frost tolerant.</p>
          </div>
        </div>
        
        <!-- Temperature -->
        <div class="border rounded-md overflow-hidden">
          <button class="w-full text-left flex items-center justify-between p-4 bg-background hover:bg-accent" onclick="toggleRequirement('temperature')">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Temperature</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="temperature-icon"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div id="temperature-content" class="hidden px-4 pb-4">
            <p>65-80°F (18-27°C). Keep away from cold drafts and heat sources.</p>
          </div>
        </div>
      </div>
    `;
    
    // Insert the section before the general info heading
    const parentElement = generalInfoHeading.parentElement;
    if (parentElement && parentElement.parentElement) {
      parentElement.parentElement.insertBefore(requirementsSection, parentElement);
    }
    
    // Add the toggle function to the window object
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
  }
  
  // Try to inject on page load
  if (document.readyState === 'complete') {
    injectComponent();
  } else {
    window.addEventListener('load', injectComponent);
  }
  
  // Add a MutationObserver to detect DOM changes
  // This helps with single-page applications where the URL can change without a full page reload
  const observer = new MutationObserver(function(mutations) {
    if (isPlantDetailPage()) {
      injectComponent();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also listen for URL changes (for single-page applications)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (isPlantDetailPage()) {
        setTimeout(injectComponent, 500);
      }
    }
  }).observe(document, { subtree: true, childList: true });
})();
