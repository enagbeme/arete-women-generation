/* ============================================
   ARETE Women's Generation - Main JavaScript
   Animations, Interactivity & Smooth Experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // === Mobile Navigation ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === Scroll Animations (Intersection Observer) ===
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for sibling elements
                const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                const delay = siblingIndex * 100;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // === Animated Counter ===
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        counterObserver.observe(statsBar);
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Active Nav Link Highlighting ===
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.style.color = 'var(--dusty-rose-dark)';
                } else {
                    navLink.style.color = '';
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // === Gallery Lightbox ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // === Registration Form ===
    const registrationForm = document.getElementById('registrationForm');
    const formSuccess = document.getElementById('formSuccess');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.btn-register');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnArrow = submitBtn.querySelector('.btn-arrow');

            // Show loading state
            btnText.textContent = 'Submitting...';
            btnArrow.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Submit form data to FormSubmit
            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    formSuccess.classList.add('visible');
                    registrationForm.reset();
                } else {
                    alert('Something went wrong. Please try again.');
                }
            })
            .catch(() => {
                alert('Could not submit. Please check your connection and try again.');
            })
            .finally(() => {
                btnText.textContent = 'Join the Movement';
                btnArrow.style.display = '';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            });
        });
    }

    // === Parallax for Hero Shapes ===
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.03;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

});
