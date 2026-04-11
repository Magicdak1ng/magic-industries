// ===== Page Loader =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        // Attendre que l'animation soit terminée (1s)
        setTimeout(() => {
            loader.classList.add('fade-out');
            // Retirer complètement du DOM après le fade-out
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    }
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.mobile-menu-toggle').classList.remove('active');
            }
        }
    });
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.15)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
}, { passive: true });

// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Animate hamburger
        const spans = menuToggle.querySelectorAll('span');
        if (menuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll('.service-card, .why-card, .problem-point, .stats-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ===== Form Handling (Formspree integration) =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Empêcher le submit normal

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Désactiver le bouton et afficher "Envoi en cours..."
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours...';

        try {
            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);

            // Envoyer à Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Succès ! Réinitialiser le formulaire
                contactForm.reset();

                // Afficher un message de succès
                submitBtn.innerHTML = '✓ Message envoyé !';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                // Revenir au texte d'origine après 3 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            } else {
                // Erreur
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            // En cas d'erreur
            submitBtn.innerHTML = '✗ Erreur, réessayez';
            submitBtn.disabled = false;

            // Revenir au texte d'origine après 3 secondes
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
        }
    });
}

// ===== Parallax Effect for Gradient Orbs =====
const orbs = document.querySelectorAll('.gradient-orb');

window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const moveX = (x - 0.5) * speed;
        const moveY = (y - 0.5) * speed;
        orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}, { passive: true });

// ===== Number Counter Animation =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const text = num.textContent;
                const value = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(value)) {
                    num.dataset.suffix = text.replace(/\d/g, '');
                    animateValue(num, 0, value, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-card').forEach(card => {
    statsObserver.observe(card);
});

// ===== Add mobile menu styles dynamically =====
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(168, 85, 247, 0.2);
        }

        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
        }

        .nav-menu li {
            text-align: center;
        }
    }
`;
document.head.appendChild(style);

// ===== Portfolio Carousel Infini (Automatique Simple) =====
function initInfiniteCarousel() {
    const track = document.querySelector('.portfolio-track');
    const slides = document.querySelectorAll('.portfolio-slide');

    if (!track || slides.length === 0) return;

    // Dupliquer les slides pour créer une boucle infinie
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });

    // Empêcher le drag des images (pour que les liens fonctionnent bien)
    track.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
}

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfiniteCarousel);
} else {
    initInfiniteCarousel();
}

// ===== Console Message =====
console.log('%c✨ Magic Web', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cSite créé avec passion pour les artisans locaux', 'font-size: 14px; color: #a1a1aa;');