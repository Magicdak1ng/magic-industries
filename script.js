// ===== Performance Settings =====
const isMobile = window.innerWidth <= 768;

// ===== Loading Screen - TIMING PRÉCIS =====
// Barre se remplit en 1.2s, puis fade out en 0.4s
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loadingScreen');

    // Après 1.2s (fin de la barre), fade out de 0.4s
    setTimeout(function() {
        if (loader) {
            loader.classList.add('hidden');
            // Display none après le fade (0.4s)
            setTimeout(function() {
                loader.style.display = 'none';
            }, 400);
        }
    }, 1200);
});

// ===== Mouse Effects (Trail + Glow) - OPTIMISÉ =====
if (!isMobile) {
    const trailCanvas = document.getElementById('trailCanvas');
    const trailCtx = trailCanvas.getContext('2d', { alpha: true });
    const mouseGlow = document.getElementById('mouseGlow');

    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    const trailParticles = [];
    const violet = '#a855f7';
    const cyan = '#06b6d4';

    let lastTrailTime = 0;
    let mouseX = 0;
    let mouseY = 0;
    let glowUpdateScheduled = false;

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 4; // 4-8px
            this.color = Math.random() > 0.5 ? violet : cyan;
            this.life = 40; // 40 frames lifetime
            this.maxLife = 40;
        }

        update() {
            this.life--;
            this.y += 0.3; // Déplacement vers le bas

            // Easing out pour la taille et l'opacité
            const lifeRatio = this.life / this.maxLife;
            this.currentSize = this.size * lifeRatio;
            this.currentOpacity = lifeRatio;
        }

        draw() {
            trailCtx.fillStyle = this.color + Math.floor(this.currentOpacity * 255).toString(16).padStart(2, '0');
            trailCtx.beginPath();
            trailCtx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
            trailCtx.fill();
        }

        isDead() {
            return this.life <= 0;
        }
    }

    // Update mouse glow via RAF
    function updateMouseGlow() {
        mouseGlow.style.left = mouseX + 'px';
        mouseGlow.style.top = mouseY + 'px';
        glowUpdateScheduled = false;
    }

    // Listener mousemove fusionné (trail throttle + glow RAF)
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();

        // Trail throttle à 16ms (1 frame)
        if (now - lastTrailTime >= 16) {
            trailParticles.push(new TrailParticle(e.clientX, e.clientY));
            lastTrailTime = now;
        }

        // Mouse glow position update (via RAF pour smooth)
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!glowUpdateScheduled) {
            glowUpdateScheduled = true;
            requestAnimationFrame(updateMouseGlow);
        }
    });

    // Animation loop unique pour trail
    function animateTrail() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        // Update et draw toutes les particules
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            trailParticles[i].update();
            trailParticles[i].draw();

            // Remove dead particles
            if (trailParticles[i].isDead()) {
                trailParticles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // Resize handler debounced
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }, 200);
    });
}

// ===== Optimized Background Particles - MAX PERFORMANCES =====
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d', { alpha: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = isMobile ? 15 : 25;
const maxDistance = 100;
const maxDistanceSquared = maxDistance * maxDistance; // Distance au carré

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

    // Draw connections - MAX 2 connections par particule, distance au carré
    ctx.save(); // Prevent canvas state leaks
    for (let i = 0; i < particles.length; i++) {
        let connectionCount = 0;
        const maxConnections = 2;

        for (let j = i + 1; j < particles.length; j++) {
            if (connectionCount >= maxConnections) break;

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distanceSquared = dx * dx + dy * dy; // PAS de Math.sqrt()

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
    ctx.restore(); // Restore canvas state

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize handler debounced
let particleResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(particleResizeTimeout);
    particleResizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, 200);
});

// ===== Global IntersectionObserver - UN SEUL OBSERVER =====
const globalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            globalObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

// Observer tous les éléments reveal
document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
    el.classList.add('reveal-text');
    globalObserver.observe(el);
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
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

// ===== Smooth Scroll Custom avec Lerp - ANCRES NAV UNIQUEMENT =====
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

let isScrolling = false;
let targetScrollY = 0;
let currentScrollY = window.pageYOffset;

function smoothScrollTo(targetY) {
    targetScrollY = targetY;
    if (!isScrolling) {
        isScrolling = true;
        smoothScrollLoop();
    }
}

function smoothScrollLoop() {
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);
    window.scrollTo(0, currentScrollY);

    if (Math.abs(targetScrollY - currentScrollY) > 0.5) {
        requestAnimationFrame(smoothScrollLoop);
    } else {
        window.scrollTo(0, targetScrollY);
        isScrolling = false;
    }
}

// Appliquer smooth scroll sur les ancres nav uniquement
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
            smoothScrollTo(targetPosition);
        }
    });
});

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
}, { threshold: 0.08, rootMargin: '0px 0px -100px 0px' });

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

// ===== Performance: Disable animations on low-end devices =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

console.log('✨ Magic Industries - Ultra-Optimized 60fps Website!');
console.log('🚀 Cursor Trail + Glow | Optimized Particles | Smooth Scroll Lerp');
