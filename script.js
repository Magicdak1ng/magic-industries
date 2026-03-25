// ===== Loading Screen =====
// Loading screen is now handled inline in HTML for reliability

// ===== Simple Custom Cursor with CSS Variables =====
(function initSimpleCursor() {
    // Only on desktop
    if (window.innerWidth <= 768) return;

    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    // Add cursor-active class to hide default cursor
    document.body.classList.add('cursor-active');

    // Update CSS variables on mouse move
    document.addEventListener('mousemove', (e) => {
        document.body.style.setProperty('--x', e.clientX);
        document.body.style.setProperty('--y', e.clientY);
    });

    console.log('✨ Simple cursor initialized!');
})();

// ===== Particles Animation =====
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 30; // Reduced from 50 for better performance

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(6, 182, 212, 0.3)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    // Draw connections - optimized with reduced distance and limit
    for (let i = 0; i < particles.length; i++) {
        let connectionCount = 0;
        const maxConnections = 3; // Limit connections per particle

        for (let j = i + 1; j < particles.length; j++) {
            if (connectionCount >= maxConnections) break;

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) { // Reduced from 150
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - distance / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                connectionCount++;
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== Stats Counter Animation =====
// Stats are now displayed as static text (10+, 100%, 2, 7/7)
// No animation needed

// ===== Text Reveal on Scroll =====
const revealTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
    el.classList.add('reveal-text');
    revealTextObserver.observe(el);
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// ===== Smooth Scroll Animation =====
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Make hero section visible immediately
document.querySelector('.hero').classList.add('visible');

// ===== Animate Cards on Scroll =====
const cardObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, cardObserverOptions);

// Observe all cards with stagger effect
const animateCards = () => {
    const cards = document.querySelectorAll('.service-card, .avantage-card, .tarif-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
};

// Run after DOM is loaded
setTimeout(animateCards, 100);

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
    let scrollPosition = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.style.color = '';
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.style.color = 'var(--violet)';
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ===== Contact Form Handling with Formspree =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.textContent = 'Envoi en cours...';
    button.disabled = true;

    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            button.textContent = 'Message envoyé !';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            contactForm.reset();

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    } catch (error) {
        button.textContent = 'Erreur - Réessayer';
        button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);

        console.error('Form submission error:', error);
    }
});

// ===== Optimized Parallax Effect =====
const heroBackground = document.querySelector('.hero-background');
const heroContent = document.querySelector('.hero-content');
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;

    if (scrolled < window.innerHeight) {
        if (heroBackground) {
            heroBackground.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
        }

        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
        }
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for # only
        if (href === '#') return;

        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Add hover effect to portfolio image =====
const portfolioCard = document.querySelector('.portfolio-card');
if (portfolioCard) {
    portfolioCard.addEventListener('mousemove', (e) => {
        const rect = portfolioCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        portfolioCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    portfolioCard.addEventListener('mouseleave', () => {
        portfolioCard.style.transform = '';
    });
}

// ===== Typing Effect for Hero Title =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';

    let charIndex = 0;
    const typeSpeed = 40;

    const typeWriter = () => {
        if (charIndex < text.length) {
            const char = text.charAt(charIndex);
            // Check if we're at the start of a tag
            if (char === '<') {
                // Find the closing >
                const closingIndex = text.indexOf('>', charIndex);
                if (closingIndex !== -1) {
                    // Add the entire tag at once
                    heroTitle.innerHTML += text.substring(charIndex, closingIndex + 1);
                    charIndex = closingIndex + 1;
                    setTimeout(typeWriter, 0);
                    return;
                }
            }
            heroTitle.innerHTML += char;
            charIndex++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Add blinking cursor at the end
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            cursor.style.animation = 'blink 1s infinite';
            cursor.style.marginLeft = '5px';
            heroTitle.appendChild(cursor);

            // Remove cursor after 3 seconds
            setTimeout(() => {
                cursor.remove();
            }, 3000);
        }
    };

    // Start typing after a short delay
    setTimeout(() => {
        typeWriter();
    }, 500);
}

// Add CSS for cursor blink animation
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== Dynamic year in footer =====
// Footer year is now fixed at 2026 in HTML
// const updateFooterYear = () => {
//     const footerText = document.querySelector('.footer-bottom p');
//     if (footerText) {
//         footerText.innerHTML = `&copy; 2026 Magic Industries. Tous droits réservés.`;
//     }
// };

// ===== Add counter animation for pricing =====
const animateCounter = (element, target, duration = 1000) => {
    let current = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '€';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + '€';
        }
    }, 16);
};

// Observe pricing cards for counter animation
const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const priceElement = entry.target.querySelector('.price');
            if (priceElement && !priceElement.dataset.animated) {
                const priceValue = parseInt(priceElement.textContent);
                priceElement.dataset.animated = 'true';
                animateCounter(priceElement, priceValue, 1500);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.tarif-card').forEach(card => {
    pricingObserver.observe(card);
});

// ===== Form field validation and styling =====
const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = 'var(--cyan)';
        } else if (input.hasAttribute('required')) {
            input.style.borderColor = '#ef4444';
        }
    });

    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--violet)';
    });
});

// ===== Performance optimization: Debounce scroll events =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll-heavy functions
const debouncedHighlightNav = debounce(highlightNav, 50);
window.addEventListener('scroll', debouncedHighlightNav);

// ===== Matrix Code Background Effect =====
// Removed for performance optimization

// ===== Micro-interactions on Cards - Simplified =====
// Removed complex 3D transforms to prevent hover bugs
// Cards now use CSS-only hover effects

// ===== Smooth Transitions Between Sections =====
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ===== Interactive Hover on Portfolio =====
// Removed complex 3D transforms to prevent hover bugs
// Portfolio card now uses CSS-only hover effects

// ===== Add Glitch Effect to Logo on Hover =====
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease';
    });

    logo.addEventListener('animationend', function() {
        this.style.animation = '';
    });
}

// Add glitch animation
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }
`;
document.head.appendChild(glitchStyle);

// ===== Gradient Animation on Scroll =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll-position', window.pageYOffset);

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Trigger any scroll-end animations here
    }, 100);
}, { passive: true });

// ===== Performance: Disable animations on low-end devices =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

console.log('✨ Magic Industries - Premium Website Loaded Successfully!');
console.log('🚀 Featuring: Custom Cursor, Particles, Stats Counter, Text Reveal, Parallax & More!');
