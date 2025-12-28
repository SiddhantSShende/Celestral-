/**
 * Interactions Module
 * Handles interactive elements like card flips, button effects, and form validation
 */

/**
 * Initialize button pulse effect on hover
 */
export function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary');

    buttons.forEach(button => {
        // Add pulse class on hover
        button.addEventListener('mouseenter', () => {
            button.classList.add('pulse');
        });

        button.addEventListener('mouseleave', () => {
            button.classList.remove('pulse');
        });

        // Add bounce effect on click
        button.addEventListener('click', (e) => {
            button.classList.add('active-bounce');

            setTimeout(() => {
                button.classList.remove('active-bounce');
            }, 300);
        });
    });

    console.log(`Button effects added to ${buttons.length} buttons`);
}

/**
 * Initialize card flip animation for question cards
 * (Can be expanded when you want to add flip functionality)
 */
export function initCardFlip() {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

    if (flipCards.length > 0) {
        console.log(`Card flip initialized for ${flipCards.length} cards`);
    }
}

/**
 * Add ripple effect to buttons on click
 */
export function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Add ripple styles dynamically
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-animation 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation to CSS dynamically
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      .btn {
        position: relative;
        overflow: hidden;
      }
    `;
        document.head.appendChild(style);
    }

    console.log(`Ripple effect added to ${buttons.length} buttons`);
}

/**
 * Initialize lazy loading for images
 */
export function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    console.log(`Lazy loading initialized for ${images.length} images`);
}

/**
 * Add loading state to CTA buttons
 */
export function initCTALoading() {
    const ctaButtons = document.querySelectorAll('a[href="#start"], a[href="#signup"]');

    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Only prevent default if it's a placeholder link
            if (button.getAttribute('href') === '#start' || button.getAttribute('href') === '#signup') {
                e.preventDefault();

                // Add loading state
                const originalText = button.textContent;
                button.textContent = 'Loading...';
                button.style.pointerEvents = 'none';

                // Simulate loading (replace with actual form/signup logic)
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.pointerEvents = 'auto';

                    // Show alert (replace with actual modal/form)
                    alert('Coming soon! Sign up functionality will be added here.');
                }, 1000);
            }
        });
    });

    console.log(`CTA loading states added to ${ctaButtons.length} buttons`);
}

/**
 * Initialize testimonial carousel (if needed)
 * Currently testimonials are in a grid, but this can be expanded
 */
export function initTestimonialCarousel() {
    // Placeholder for future carousel functionality
    // Can be implemented when you want to add carousel to testimonials
    console.log('Testimonial carousel ready for implementation');
}

/**
 * Add smooth reveal animation to sections on first load
 */
export function initPageLoadAnimation() {
    // Add loaded class to body after page loads
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-animate, .hero-animate-delay-1, .hero-animate-delay-2, .hero-animate-delay-3');
        heroElements.forEach(element => {
            element.style.opacity = '1';
        });
    });

    console.log('Page load animations initialized');
}

/**
 * Initialize all interaction modules
 */
export function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initButtonEffects();
            initCardFlip();
            initRippleEffect();
            initLazyLoading();
            initCTALoading();
            initTestimonialCarousel();
            initPageLoadAnimation();
        });
    } else {
        initButtonEffects();
        initCardFlip();
        initRippleEffect();
        initLazyLoading();
        initCTALoading();
        initTestimonialCarousel();
        initPageLoadAnimation();
    }
}
