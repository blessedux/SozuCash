/**
 * Injects CSS styles into the document head
 * @param styles - CSS styles as a string
 */
export function injectStyles(styles: string): void {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
  console.log('Sozu: Styles injected');
}

/**
 * Wait for an element to appear in the DOM
 * @param selector - CSS selector for the element
 * @param maxAttempts - Maximum number of attempts to find the element
 * @param intervalMs - Interval between attempts in milliseconds
 * @returns Promise that resolves to the element or null if not found
 */
export function waitForElement(
  selector: string, 
  maxAttempts: number = 10, 
  intervalMs: number = 500
): Promise<Element | null> {
  return new Promise((resolve) => {
    let attempts = 0;
    
    const checkForElement = () => {
      attempts++;
      const element = document.querySelector(selector);
      
      if (element) {
        console.log(`Sozu: Element found: ${selector}`);
        resolve(element);
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.log(`Sozu: Element not found after ${maxAttempts} attempts: ${selector}`);
        resolve(null);
        return;
      }
      
      setTimeout(checkForElement, intervalMs);
    };
    
    checkForElement();
  });
}

/**
 * Find a reference element in the navigation sidebar to position our button
 * @param navElement - The navigation element to search within
 * @returns The reference element or null if not found
 */
export function findReferenceButton(navElement: Element): Element | null {
  // Try to find the Explore button or any suitable navigation item
  const referenceButtons = Array.from(navElement.querySelectorAll('a[href="/explore"]'));
  if (referenceButtons.length > 0) {
    return referenceButtons[0];
  }
  
  // Fallback to any nav element with an SVG icon
  const allNavItems = Array.from(navElement.querySelectorAll('a, div')).filter(
    el => el.querySelector('svg') && el.clientHeight > 0
  );
  
  return allNavItems.length > 0 ? allNavItems[allNavItems.length - 1] : null;
}

/**
 * Gets the current Twitter username from the page
 * @returns The username or null if not found
 */
export function getTwitterUsername(): string | null {
  // Check URL for username (works when profile is loaded)
  const urlMatch = window.location.pathname.match(/^\/([A-Za-z0-9_]+)(?:\/|$)/);
  if (urlMatch && !['home', 'explore', 'notifications', 'messages', 'settings'].includes(urlMatch[1])) {
    return urlMatch[1];
  }
  
  // Try to find username in the DOM
  // This would need to be customized based on Twitter's current DOM structure
  return null;
} 