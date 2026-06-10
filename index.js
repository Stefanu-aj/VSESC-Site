
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('mobile-menu');

    if (!toggle || !menu) return;

    menu.hidden = true;
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    function setOpen(open) {
        if (open) {
            menu.hidden = false;
            requestAnimationFrame(() => menu.classList.add('open'));
            document.body.classList.add('no-scroll');
            toggle.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
        } else {
            menu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            menu.addEventListener('transitionend', function hide() {
                menu.hidden = true;
                menu.removeEventListener('transitionend', hide);
            });
        }
    }

    toggle.addEventListener('click', function () {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        setOpen(!isOpen);
    });

    document.addEventListener('click', function (e) {
        if (!menu.classList.contains('open')) return;
        if (e.target.closest('.nav_bar') || e.target.closest('#mobile-menu')) return;
        setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
        }
    });
});

// ============================================
// MULTIPLE AUTO-PLAY CAROUSELS FUNCTIONALITY
// ============================================

class AutoPlayCarousels {
    constructor() {
        this.carousels = document.querySelectorAll('[data-track]');
        if (this.carousels.length === 0) return;

        this.carouselInstances = [];
        this.init();
    }

    init() {
        this.carousels.forEach((track) => {
            const carouselId = track.getAttribute('data-track');
            const instance = new SingleAutoCarousel(track, carouselId);
            this.carouselInstances.push(instance);
        });
    }
}

class SingleAutoCarousel {
    constructor(track, id) {
        this.track = track;
        this.id = id;
        this.items = Array.from(this.track.children);
        this.itemCount = this.items.length;
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 4000; // 4 seconds per slide
        this.isTransitioning = false;

        this.init();
    }

    init() {
        // Clone items for infinite loop
        this.cloneItems();
        // Start autoplay
        this.startAutoplay();
        // Pause on hover
        this.track.parentElement.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.parentElement.addEventListener('mouseleave', () => this.startAutoplay());
    }

    cloneItems() {
        // Clone first and last items for seamless infinite scroll
        const firstClone = this.items[0].cloneNode(true);
        const lastClone = this.items[this.itemCount - 1].cloneNode(true);

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.track.firstChild);

        // Update items array with clones
        this.allItems = Array.from(this.track.children);
        // Start at index 1 (real first item, after cloned last item)
        this.currentIndex = 1;
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.currentIndex++;
        this.updateCarousel(true);
    }

    updateCarousel(smooth = false) {
        this.isTransitioning = true;
        const offset = -this.currentIndex * 100;

        if (smooth) {
            this.track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            this.track.style.transition = 'none';
        }

        this.track.style.transform = `translateX(${offset}%)`;

        // Handle infinite loop reset
        this.track.addEventListener('transitionend', () => this.handleTransitionEnd(), { once: true });
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        // Check if we need to jump to the corresponding real item
        if (this.currentIndex >= this.allItems.length - 1) {
            // We've reached the cloned first item, jump to real first item
            this.currentIndex = 1;
            this.updateCarousel(false);
        } else if (this.currentIndex <= 0) {
            // We've gone before the first item, jump to real last item
            this.currentIndex = this.itemCount;
            this.updateCarousel(false);
        }
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.stopAutoplay();
    }
}

// Initialize all carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AutoPlayCarousels();
});

