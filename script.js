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

// ===== Performance: Disable animations on low-end devices =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

console.log('✨ Magic Web - Optimized Website!');
