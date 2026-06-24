// === TRANSLATOR ===
let currentLang = localStorage.getItem('lang') || 'en';

function translatePage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;

  const typingText = document.querySelector('.typing-text');
  if (typingText && window.typingTitles) {
    window.typingTitles.length = 0;
    window.typingTitles.push(
      translations[lang]['hero.typing.0'],
      translations[lang]['hero.typing.1'],
      translations[lang]['hero.typing.2'],
      translations[lang]['hero.typing.3']
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
    translatePage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => translatePage(btn.dataset.lang));
    });

    // === LOADER ===
    const loader = document.getElementById('loader');
    if (loader) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2000);
    }

    // === CUSTOM CURSOR ===
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 1024 && cursor && follower) {
        cursor.style.display = 'block';
        follower.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .btn, input, textarea, .skill-card, .project-card, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '16px';
                cursor.style.height = '16px';
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.borderColor = 'var(--primary-light)';
                follower.style.background = 'rgba(99, 102, 241, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                follower.style.width = '40px';
                follower.style.height = '40px';
                follower.style.borderColor = 'var(--primary)';
                follower.style.background = 'transparent';
            });
        });
    }

    // === HERO CANVAS (Particles) ===
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= dx * force * 0.01;
                    this.y -= dy * force * 0.01;
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            const maxParticles = window.innerWidth < 768 ? 30 : 80;
            const count = Math.min(Math.floor(canvas.width * canvas.height / 8000), maxParticles);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        initParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // === TYPING ANIMATION ===
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        window.typingTitles = [
            translations[currentLang]['hero.typing.0'],
            translations[currentLang]['hero.typing.1'],
            translations[currentLang]['hero.typing.2'],
            translations[currentLang]['hero.typing.3']
        ];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentTitle = window.typingTitles[titleIndex];

            if (isDeleting) {
                typingText.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 30;
            } else {
                typingText.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentTitle.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % window.typingTitles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // === THEME TOGGLE ===
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // === NAVBAR SCROLL ===
    const navbar = document.getElementById('main-nav');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // === SCROLL REVEAL ===
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // === COUNTER ANIMATION ===
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

    // === SKILL PROGRESS BARS ===
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.progress-bar[data-width]').forEach(bar => {
        skillObserver.observe(bar);
    });

    // === TESTIMONIAL SLIDER ===
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialDots = document.querySelector('.testimonial-dots');

    if (testimonialTrack && testimonialDots) {
        const cards = testimonialTrack.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let autoplayInterval;

        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            testimonialDots.appendChild(dot);
        });

        const dots = testimonialDots.querySelectorAll('.testimonial-dot');

        function goToSlide(index) {
            currentIndex = index;
            testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[currentIndex].classList.add('active');
            resetAutoplay();
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % cards.length);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        resetAutoplay();
    }

    // === CONTACT FORM ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const btnText = btn.querySelector('.btn-text');
            const btnIcon = btn.querySelector('.btn-icon');
            const originalText = btnText.textContent;
            const formData = new FormData(contactForm);

            btn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            fetch('https://formspree.io/f/your-form-id', { /* Replace with your Formspree form ID */
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    btnText.textContent = 'Sent!';
                    btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                    contactForm.reset();
                } else {
                    throw new Error('Send failed');
                }
            }).catch(() => {
                btnText.textContent = 'Oops!';
                btnIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            }).finally(() => {
                setTimeout(() => {
                    btn.disabled = false;
                    btnText.textContent = originalText;
                    btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                }, 3000);
            });
        });
    }

    // === SMOOTH SCROLL ===
    function smoothScrollTo(targetPosition, duration = 900) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function easing(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, startPosition + distance * easing(progress));
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                smoothScrollTo(targetPosition);

                const navCollapse = document.getElementById('navbarNav');
                if (navCollapse.classList.contains('show')) {
                    const collapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (collapse) collapse.hide();
                }
            }
        });
    });

    // === NAVBAR ACTIVE LINK ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // === HERO IMAGE 3D TILT + ZOOM ===
    const heroImage = document.querySelector('.hero-image');
    const heroImgContainer = document.querySelector('.hero-image-container');

    if (heroImage && heroImgContainer && window.innerWidth > 768) {
        heroImgContainer.addEventListener('mousemove', (e) => {
            const rect = heroImgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            heroImage.style.animation = 'none';
            heroImage.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
        });

        heroImgContainer.addEventListener('mouseleave', () => {
            heroImage.style.animation = '';
            heroImage.style.transform = '';
        });
    }
});
