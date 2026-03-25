// ===== Performance Settings =====
const isMobile = window.innerWidth <= 768;

// ===== Loading Screen =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// Fallback - force hide after 2.5 seconds
setTimeout(function() {
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.display = 'none';
    }
}, 2500);

// ===== Cursor Trail Effect (Canvas) =====
if (!isMobile) {
    const trailCanvas = document.getElementById('cursorTrail');
    const trailCtx = trailCanvas.getContext('2d', { alpha: true });

    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    const trailParticles = [];
    const maxTrailParticles = 30;
    let mouseX = 0;
    let mouseY = 0;

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 2;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.02;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247,' : 'rgba(6, 182, 212,';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.98;
        }

        draw() {
            trailCtx.fillStyle = this.color + this.life + ')';
            trailCtx.beginPath();
            trailCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            trailCtx.fill();
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Add new trail particles
        if (trailParticles.length < maxTrailParticles) {
            trailParticles.push(new TrailParticle(mouseX, mouseY));
        }
    });

    function animateTrail() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        // Update and draw trail particles
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            trailParticles[i].update();
            trailParticles[i].draw();

            // Remove dead particles
            if (trailParticles[i].life <= 0 || trailParticles[i].size <= 0.5) {
                trailParticles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    window.addEventListener('resize', () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    });
}

// ===== Optimized Background Particles =====
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d', { alpha: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = isMobile ? 15 : 25;
const maxDistance = 120; // For squared distance comparison
const maxDistanceSquared = maxDistance * maxDistance;

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

    // Draw connections - optimized with squared distance
    for (let i = 0; i < particles.length; i++) {
        let connectionCount = 0;
        const maxConnections = 3;

        for (let j = i + 1; j < particles.length; j++) {
            if (connectionCount >= maxConnections) break;

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distanceSquared = dx * dx + dy * dy; // No sqrt!

            if (distanceSquared < maxDistanceSquared) {
                const opacity = 0.08 * (1 - distanceSquared / maxDistanceSquared);
                ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
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

// ===== Text Reveal on Scroll with IntersectionObserver =====
const revealTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealTextObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

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
}, { passive: true });

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
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Make hero section visible immediately
document.querySelector('.hero')?.classList.add('visible');

// ===== Animate Cards on Scroll with Stagger Effect =====
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card, .avantage-card, .tarif-card, .stat-card');

            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });

            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

// Observe sections that contain cards
document.querySelectorAll('.services, .avantages, .tarifs, .stats').forEach(section => {
    cardObserver.observe(section);
});

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

window.addEventListener('scroll', highlightNav, { passive: true });

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
            pricingObserver.unobserve(entry.target);
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

// ===== Performance: Disable animations on low-end devices =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

console.log('✨ Magic Industries - Premium Website Loaded Successfully!');
console.log('🚀 Featuring: Cursor Trail, Optimized Particles, 60fps Animations & More!');
