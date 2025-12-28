/**
 * Scroll Animations Module
 * Handles scroll-triggered animations using Intersection Observer API
 */

/**
 * Initialize scroll animations for elements with animation classes
 */
export function initScrollAnimations() {
  // Get all elements that should animate on scroll
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .slide-in-left, .slide-in-right, .scale-in'
  );
  
  // Intersection Observer options
  const observerOptions = {
    root: null, // Use viewport as root
    rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
    threshold: 0.1 // Trigger when 10% of element is visible
  };
  
  // Callback function when element intersects
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to trigger animation
        entry.target.classList.add('is-visible');
        
        // Optional: Stop observing after animation (one-time animation)
        // Uncomment the line below if you want animations to trigger only once
        // observer.unobserve(entry.target);
      }
    });
  };
  
  // Create the observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  console.log(`Observing ${animatedElements.length} elements for scroll animations`);
}

/**
 * Parallax effect for hero visual element
 * Creates subtle movement based on scroll position
 */
export function initParallax() {
  const heroVisual = document.querySelector('.hero__visual');
  
  if (!heroVisual) return;
  
  // Throttle function to limit scroll event frequency
  let ticking = false;
  
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5; // Adjust for more/less movement
    
    // Apply transform
    heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    
    ticking = false;
  };
  
  // Scroll event listener with throttling
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  
  console.log('Parallax effect initialized');
}

/**
 * Add hover glow effect to cards
 * Enhances interactivity with dynamic glow based on mouse position
 */
export function initCardHoverEffects() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create subtle glow at mouse position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
  
  console.log(`Hover effects added to ${cards.length} cards`);
}

/**
 * Stagger animation for grid items
 * Adds progressive delay to create wave effect
 */
export function initStaggerAnimation() {
  const grids = document.querySelectorAll('.feature-grid, .grid-2, .grid-3, .grid-4');
  
  grids.forEach(grid => {
    const items = grid.querySelectorAll('.animate-on-scroll');
    
    items.forEach((item, index) => {
      // Add stagger delay (100ms per item)
      item.style.transitionDelay = `${index * 100}ms`;
    });
  });
  
  console.log('Stagger animations initialized');
}

/**
 * Initialize all animation modules
 */
export function init() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollAnimations();
      initParallax();
      initCardHoverEffects();
      initStaggerAnimation();
    });
  } else {
    // DOM already loaded
    initScrollAnimations();
    initParallax();
    initCardHoverEffects();
    initStaggerAnimation();
  }
}
