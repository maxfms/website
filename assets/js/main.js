document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile Menu Toggle with right-side slide-in animation
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        const existingSvg = mobileMenuToggle.querySelector('svg');

        const setMenuOpen = (open) => {
            if (open) {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenu.classList.add('translate-x-0');
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
                mobileMenuToggle.classList.add('open');
                mobileMenu.style.transform = 'translateX(0)';
                enableFocusTrap();
            } else {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.classList.remove('open');
                mobileMenu.style.transform = 'translateX(100%)';
                releaseFocusTrap();
            }
            updateMenuIcon();
        };

        // Ensure menu is anchored to the right (fixes cases where left:0 is applied)
        mobileMenu.style.right = '0px';
        mobileMenu.style.left = 'auto';
        mobileMenu.style.transformOrigin = 'right';
        mobileMenu.style.transition = 'transform 250ms ease';
        mobileMenu.style.willChange = 'transform';
        mobileMenu.style.transform = 'translateX(100%)';
        mobileMenu.classList.add('translate-x-full');

        if (existingSvg) {
            existingSvg.innerHTML = `
                <line class="line l1" x1="3" y1="6" x2="21" y2="6"></line>
                <line class="line l2" x1="3" y1="12" x2="21" y2="12"></line>
                <line class="line l3" x1="3" y1="18" x2="21" y2="18"></line>
            `;
            existingSvg.setAttribute('viewBox', '0 0 24 24');
            existingSvg.setAttribute('fill', 'none');
            existingSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(!mobileMenu.classList.contains('translate-x-0'));
        });

        // Close menu when a link is clicked
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                setMenuOpen(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (
                !mobileMenu.contains(e.target) &&
                !mobileMenuToggle.contains(e.target) &&
                mobileMenu.classList.contains('translate-x-0')
            ) {
                setMenuOpen(false);
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('translate-x-0')) {
                setMenuOpen(false);
            }
        });
    }

    // Update menu icon between hamburger and X
    const updateMenuIcon = () => {
        // Sync button class for CSS animation; SVG lines are injected on load
        const isOpen = mobileMenu.classList.contains('translate-x-0');
        if (isOpen) {
            mobileMenuToggle.classList.add('open');
        } else {
            mobileMenuToggle.classList.remove('open');
        }
    };

    // Focus trap helpers
    let _previouslyFocused = null;
    let _trapHandler = null;

    const enableFocusTrap = () => {
        _previouslyFocused = document.activeElement;
        mobileMenu.classList.add('mobile-menu-focus-trap');
        mobileMenu.setAttribute('tabindex', '-1');
        mobileMenu.focus();
        const focusable = mobileMenu.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        _trapHandler = (e) => {
            if (e.key !== 'Tab') return;
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', _trapHandler);
    };

    const releaseFocusTrap = () => {
        mobileMenu.classList.remove('mobile-menu-focus-trap');
        mobileMenu.removeAttribute('tabindex');
        if (_trapHandler) {
            document.removeEventListener('keydown', _trapHandler);
            _trapHandler = null;
        }
        if (_previouslyFocused && typeof _previouslyFocused.focus === 'function') {
            _previouslyFocused.focus();
        }
        _previouslyFocused = null;
    };

    // Sync icon with current menu state on load
    updateMenuIcon();

    const routeMap = {
        home: 'index.html',
        'about us': 'about.html',
        products: 'products.html',
        services: 'services.html',
        testimonials: 'testimonials.html',
        'app portal': 'portal.html',
        contact: 'contact.html',
        'get started today': 'contact.html',
        'view app portal': 'portal.html',
        'explore mobile app portal': 'portal.html',
        'explore collection': 'products.html',
        'request quote': 'contact.html',
        'schedule new clean': 'contact.html',
        'browse catalogues': 'products.html',
        'learn more': 'services.html',
        'shop products': 'products.html'
    };

    const normalize = (value = '') => value.replace(/\s+/g, ' ').trim().toLowerCase();

    const getPageName = (urlPath) => {
        const page = urlPath.split('/').pop();
        return page === '' ? 'index.html' : page;
    };

    // Update active navigation link based on current page
    const updateActiveNav = () => {
        const currentPage = getPageName(window.location.pathname);
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const linkPage = getPageName(href || '');
            const isActive = linkPage === currentPage;

            if (isActive) {
                // Add active classes
                link.classList.remove('text-zinc-600', 'hover:text-primary', 'hover:bg-primary/5');
                link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
            } else {
                // Remove active classes
                link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
                link.classList.add('text-zinc-600', 'hover:text-primary', 'hover:bg-primary/5');
            }
        });
    };

    // Call on page load
    updateActiveNav();

    // Update when URL changes
    window.addEventListener('popstate', updateActiveNav);

    const navigateTo = (route) => {
        if (!route) return;
        if (window.location.pathname !== route) {
            window.location.assign(route);
        }
    };

    document.querySelectorAll('button').forEach((button) => {
        const text = normalize(button.textContent || '');
        const route = button.dataset.route || routeMap[text];

        if (!route) return;

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            navigateTo(route);
        });
    });

    document.querySelectorAll('a').forEach((link) => {
        const text = normalize(link.textContent || '');
        const fallback = routeMap[text];

        if (link.getAttribute('href') === '#' && fallback) {
            link.setAttribute('href', fallback);
        }
    });
});
