// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Scroll Animations with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Services Tab Logic
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceCards = document.querySelectorAll('.service-card');

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            serviceItems.forEach(i => i.classList.remove('active'));
            serviceCards.forEach(c => c.classList.remove('active'));

            // Add active to clicked item
            item.classList.add('active');
            
            // Show corresponding card
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Simple Form Validation & Fake Submit
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                form.reset();
                
                statusDiv.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto prono.';
                statusDiv.classList.add('success-msg');
                
                // Clear message after 4 seconds
                setTimeout(() => {
                    statusDiv.textContent = '';
                    statusDiv.classList.remove('success-msg');
                }, 4000);
            }, 1500);
        });
    }

    // Navbar Smooth Background Transition on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 11, 11, 0.85)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(17, 17, 17, 0.6)';
            navbar.style.boxShadow = 'none';
        }
    });
});
