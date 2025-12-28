/**
 * Navigation Module
 * Handles mobile menu, smooth scrolling, and active link highlighting
 */

/**
 * Initialize mobile menu toggle
 */
export function initMobileMenu() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (!navbarToggle || !navbarMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle menu on button click
    navbarToggle.addEventListener('click', () => {
        const isActive = navbarMenu.classList.toggle('active');
        navbarToggle.classList.toggle('active');

        // Update ARIA attribute
        navbarToggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking on a link
    const navLinks = navbarMenu.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
        }
    });

    console.log('Mobile menu initialized');
}

/**
 * Initialize smooth scrolling for anchor links
 */
export function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                // Get navbar height for offset
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                // Calculate scroll position
                const targetPosition = targetElement.offsetTop - navbarHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log(`Smooth scroll enabled for ${links.length} links`);
}

/**
 * Highlight active navigation link based on scroll position
 */
export function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    if (sections.length === 0 || navLinks.length === 0) return;

    // Throttle scroll event
    let ticking = false;

    const updateActiveLink = () => {
        const scrollPosition = window.pageYOffset + 100; // Offset for better UX

        // Find current section
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        ticking = false;
    };

    // Listen to scroll events
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    });

    // Initial call
    updateActiveLink();

    console.log('Active nav highlighting initialized');
}

/**
 * Add scrolled class to navbar when user scrolls down
 */
export function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled past 50px
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    console.log('Navbar scroll effect initialized');
}

/**
 * Initialize all navigation modules
 */
export function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMobileMenu();
            initSmoothScroll();
            initActiveNavHighlight();
            initNavbarScroll();
        });
    } else {
        initMobileMenu();
        initSmoothScroll();
        initActiveNavHighlight();
        initNavbarScroll();
    }
}
