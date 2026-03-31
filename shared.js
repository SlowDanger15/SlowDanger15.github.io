/**
 * ROHAN PRASAD PORTFOLIO - SHARED UTILITIES
 * Cutting-edge animations, cursor effects, particles, and interactions
 */

// ============================================
// CUSTOM CURSOR SYSTEM
// ============================================
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.dot = null;
        this.ring = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.ringX = 0;
        this.ringY = 0;
        this.isHovering = false;
        this.trailInterval = null;

        this.init();
    }

    init() {
        // Don't initialize on touch devices
        if ('ontouchstart' in window) return;

        this.createCursor();
        this.addEventListeners();
        this.animate();
        this.startTrail();
    }

    createCursor() {
        const wrapper = document.createElement('div');
        wrapper.className = 'cursor-wrapper';

        this.dot = document.createElement('div');
        this.dot.className = 'cursor-dot';

        this.ring = document.createElement('div');
        this.ring.className = 'cursor-ring';

        wrapper.appendChild(this.dot);
        wrapper.appendChild(this.ring);
        document.body.appendChild(wrapper);

        this.cursor = wrapper;
    }

    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover effects for interactive elements
        const interactiveElements = 'a, button, .card-3d, .project-card, .skill-card, input, textarea, [role="button"]';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveElements)) {
                this.ring.classList.add('hovered');
                this.isHovering = true;
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveElements)) {
                this.ring.classList.remove('hovered');
                this.isHovering = false;
            }
        });

        // Click effect
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }

    createClickEffect(x, y) {
        const clickRing = document.createElement('div');
        clickRing.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border: 2px solid var(--neon-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10001;
            transform: translate(-50%, -50%);
            animation: clickExpand 0.4s ease-out forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes clickExpand {
                to {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                    border-color: transparent;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(clickRing);

        setTimeout(() => {
            clickRing.remove();
            style.remove();
        }, 400);
    }

    startTrail() {
        this.trailInterval = setInterval(() => {
            if (Math.abs(this.mouseX - this.dotX) > 5 || Math.abs(this.mouseY - this.dotY) > 5) {
                this.createTrailDot();
            }
        }, 50);
    }

    createTrailDot() {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail-dot';
        trail.style.left = this.dotX + 'px';
        trail.style.top = this.dotY + 'px';
        this.cursor.appendChild(trail);

        setTimeout(() => trail.remove(), 1000);
    }

    animate() {
        const lerp = (a, b, t) => a + (b - a) * t;

        // Smooth follow for dot
        this.dotX = lerp(this.dotX, this.mouseX, 0.2);
        this.dotY = lerp(this.dotY, this.mouseY, 0.2);

        // Slightly delayed ring
        this.ringX = lerp(this.ringX, this.mouseX, 0.15);
        this.ringY = lerp(this.ringY, this.mouseY, 0.15);

        this.dot.style.left = this.dotX + 'px';
        this.dot.style.top = this.dotY + 'px';

        this.ring.style.left = this.ringX + 'px';
        this.ring.style.top = this.ringY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(containerId = 'particles') {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = 80;

        if (this.container) {
            this.init();
        }
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
        this.animateParticles();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const colors = ['#00ffff', '#8b5cf6', '#ff007f', '#00d4ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100 + 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation-duration: ${Math.random() * 10 + 10}s;
            animation-delay: ${Math.random() * 5}s;
            box-shadow: 0 0 ${size * 3}px ${color};
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animateParticles() {
        // Mouse interaction with particles
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Repel particles from mouse
        setInterval(() => {
            this.particles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const dx = mouseX - (rect.left + rect.width / 2);
                const dy = mouseY - (rect.top + rect.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    particle.style.transform = `translate(${Math.cos(angle) * force * 50}px, ${Math.sin(angle) * force * 50}px)`;
                }
            });
        }, 50);
    }
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
class ScrollReveal {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
            ...options
        };

        this.elements = [];
        this.observer = null;

        this.init();
    }

    init() {
        this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        if (this.elements.length === 0) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, this.options);

        this.elements.forEach(el => this.observer.observe(el));
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ============================================
// PAGE TRANSITION
// ============================================
class PageTransition {
    constructor() {
        this.transition = null;
        this.init();
    }

    init() {
        // Create transition element
        this.transition = document.createElement('div');
        this.transition.className = 'page-transition';
        this.transition.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo">RP</div>
            </div>
        `;
        document.body.appendChild(this.transition);

        // Handle page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.transitionOut();
            }, 500);
        });

        // Handle internal links
        document.querySelectorAll('a[href^="index.html"], a[href^="experience.html"], a[href^="education.html"], a[href^="project.html"], a[href^="contact.html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateTo(href);
                }
            });
        });
    }

    transitionOut() {
        this.transition.classList.add('exit');
        setTimeout(() => {
            this.transition.classList.remove('exit', 'active');
        }, 600);
    }

    transitionIn() {
        this.transition.classList.add('active');
    }

    navigateTo(url) {
        this.transitionIn();
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
class TypewriterEffect {
    constructor(element, words, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.words = words;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseSpeed: 2000,
            ...options
        };

        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;

        if (this.element) {
            this.init();
        }
    }

    init() {
        this.element.innerHTML = '<span class="typewriter-text"></span>';
        this.textElement = this.element.querySelector('.typewriter-text');
        this.type();
    }

    type() {
        if (this.isPaused) return;

        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.charIndex--;
        } else {
            this.charIndex++;
        }

        this.textElement.textContent = currentWord.substring(0, this.charIndex);

        let delay = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            // Word complete, pause before deleting
            this.isPaused = true;
            setTimeout(() => {
                this.isPaused = false;
                this.isDeleting = true;
                this.type();
            }, this.options.pauseSpeed);
            return;
        }

        if (this.isDeleting && this.charIndex === 0) {
            // Word deleted, move to next
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
        }

        setTimeout(() => this.type(), delay);
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================
class ParallaxEffect {
    constructor(elements, options = {}) {
        this.elements = typeof elements === 'string'
            ? document.querySelectorAll(elements)
            : elements;
        this.options = {
            speed: 0.5,
            ...options
        };

        if (this.elements.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;

            this.elements.forEach(el => {
                const speed = el.dataset.parallaxSpeed || this.options.speed;
                const offset = scrollTop * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        });
    }
}

// ============================================
// 3D TILT EFFECT
// ============================================
class TiltEffect {
    constructor(elements, options = {}) {
        this.elements = typeof elements === 'string'
            ? document.querySelectorAll(elements)
            : elements;
        this.options = {
            maxRotation: 15,
            scale: 1.05,
            ...options
        };

        if (this.elements.length > 0) {
            this.init();
        }
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMouseMove(el, e));
            el.addEventListener('mouseleave', () => this.handleMouseLeave(el));
            el.addEventListener('mouseenter', () => this.handleMouseEnter(el));
        });
    }

    handleMouseMove(el, e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -this.options.maxRotation;
        const rotateY = (x - centerX) / centerX * this.options.maxRotation;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${this.options.scale})`;
    }

    handleMouseLeave(el) {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }

    handleMouseEnter(el) {
        el.style.transition = 'transform 0.1s ease';
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
class NavbarScrollEffect {
    constructor(navbarSelector = '.navbar') {
        this.navbar = document.querySelector(navbarSelector);

        if (this.navbar) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
class BackToTop {
    constructor(buttonSelector = '.back-to-top') {
        this.button = document.querySelector(buttonSelector);

        if (this.button) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
}

// ============================================
// MODAL SYSTEM
// ============================================
class Modal {
    constructor(options = {}) {
        this.overlay = null;
        this.content = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.innerHTML = `
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close">&times;</button>
                <div class="modal-body"></div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        this.content = this.overlay.querySelector('.modal-content');
        this.body = this.overlay.querySelector('.modal-body');
        this.closeBtn = this.overlay.querySelector('.modal-close');

        this.overlay.addEventListener('click', () => this.close());
        this.closeBtn.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open(contentHTML) {
        this.body.innerHTML = contentHTML;
        this.overlay.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';

        setTimeout(() => {
            this.body.innerHTML = '';
        }, 300);
    }
}

// ============================================
// LOADING SCREEN
// ============================================
class LoadingScreen {
    constructor(options = {}) {
        this.screen = null;
        this.options = {
            minDuration: 1500,
            ...options
        };

        this.init();
    }

    init() {
        this.screen = document.querySelector('.loading-screen');

        if (this.screen) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hide();
                }, this.options.minDuration);
            });
        }
    }

    hide() {
        this.screen.classList.add('hidden');
        setTimeout(() => {
            this.screen.style.display = 'none';
        }, 500);
    }

    show() {
        this.screen.style.display = 'flex';
        setTimeout(() => {
            this.screen.classList.remove('hidden');
        }, 10);
    }
}

// ============================================
// TEXT SPLIT ANIMATION
// ============================================
class TextSplitAnimation {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.options = {
            stagger: 50,
            ...options
        };

        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';

            [...text].forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(100%);
                    animation: textRevealUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards ${i * this.options.stagger}ms;
                `;
                el.appendChild(span);
            });
        });
    }
}

// ============================================
// HOLOGRAPHIC CARD EFFECT
// ============================================
class HolographicCard {
    constructor(selector) {
        this.cards = document.querySelectorAll(selector);

        if (this.cards.length > 0) {
            this.init();
        }
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(card, e));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
}

// ============================================
// PARTICLE BURST EFFECT (on click)
// ============================================
class ParticleBurst {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            this.createBurst(e.clientX, e.clientY);
        });
    }

    createBurst(x, y) {
        const burstContainer = document.createElement('div');
        burstContainer.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
        `;

        const particleCount = 12;
        const colors = ['#00ffff', '#8b5cf6', '#ff007f'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = (360 / particleCount) * i;
            const velocity = 80 + Math.random() * 40;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 4 + Math.random() * 4;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                box-shadow: 0 0 ${size * 2}px ${color};
                animation: burstParticle 0.6s ease-out forwards;
                --tx: ${Math.cos(angle * Math.PI / 180) * velocity}px;
                --ty: ${Math.sin(angle * Math.PI / 180) * velocity}px;
            `;

            burstContainer.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes burstParticle {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(burstContainer);

        setTimeout(() => {
            burstContainer.remove();
            style.remove();
        }, 600);
    }
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
class MagneticButton {
    constructor(selector, options = {}) {
        this.buttons = document.querySelectorAll(selector);
        this.options = {
            range: 100,
            strength: 0.3,
            ...options
        };

        if (this.buttons.length > 0) {
            this.init();
        }
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMouseMove(btn, e));
            btn.addEventListener('mouseleave', () => this.handleMouseLeave(btn));
        });
    }

    handleMouseMove(btn, e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const distance = Math.sqrt(x * x + y * y);

        if (distance < this.options.range) {
            const moveX = x * this.options.strength;
            const moveY = y * this.options.strength;

            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }

    handleMouseLeave(btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ============================================
// INITIALIZE ALL EFFECTS
// ============================================
function initPortfolioEffects() {
    // Initialize all effects
    new CustomCursor();
    new ParticleSystem('particles');
    new ScrollReveal();
    new NavbarScrollEffect();
    new BackToTop();
    new SmoothScroll();
    new ParticleBurst();

    // Initialize holographic cards if they exist
    new HolographicCard('.holographic-card');
    new TiltEffect('.card-3d, .project-card');

    // Initialize loading screen
    new LoadingScreen({ minDuration: 1500 });

    // Initialize typewriter effect for hero section
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        new TypewriterEffect(heroSubtitle, [
            'Software Engineer',
            'Machine Learning Engineer',
            'AI/ML Specialist',
            'Distributed Systems Expert'
        ], {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseSpeed: 2000
        });
    }

    console.log('Portfolio effects initialized');
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioEffects);
} else {
    initPortfolioEffects();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CustomCursor,
        ParticleSystem,
        ScrollReveal,
        PageTransition,
        TypewriterEffect,
        ParallaxEffect,
        TiltEffect,
        NavbarScrollEffect,
        BackToTop,
        SmoothScroll,
        Modal,
        LoadingScreen,
        TextSplitAnimation,
        HolographicCard,
        ParticleBurst,
        MagneticButton,
        initPortfolioEffects
    };
}
