/**
 * Personal Portfolio - JavaScript Features
 * Modular structure with 10 distinct features.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // JS Feature 1: Dark/Light Theme Toggle with Safe LocalStorage
    // ==========================================================================
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (themeBtn) {
        // Safe local storage check (prevents file:// protocol crashes)
        try {
            const savedTheme = localStorage.getItem('portfolio-theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                if (themeIcon) themeIcon.textContent = '☀️';
            }
        } catch (e) {
            console.warn('LocalStorage access restricted in local browser mode.');
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            if (themeIcon) {
                themeIcon.textContent = isDark ? '☀️' : '🌙';
            }

            try {
                localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
            } catch (e) {
                console.warn('LocalStorage save skipped.');
            }
        });
    }

    // ==========================================================================
    // JS Feature 2: Navigation Active Links & ScrollSpy
    // ==========================================================================
    const progressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');
    let isClickScrolling = false;

    // Instant click highlight movement
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            isClickScrolling = true;
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Resume ScrollSpy after smooth scroll finishes
            setTimeout(() => {
                isClickScrolling = false;
            }, 800);
        });
    });

    // ScrollSpy & Progress Bar
    window.addEventListener('scroll', () => {
        // Scroll Progress
        if (progressBar) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        }

        // Only update active link via scroll if not actively clicking a link
        if (!isClickScrolling) {
            let currentSectionId = '';
            const scrollPosition = window.scrollY + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            // Handle bottom of page edge case for contact section
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                currentSectionId = 'contact';
            }

            if (currentSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });

    // ==========================================================================
    // JS Feature 3 & 4: Project Category Filter & Real-Time Search
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search');

    function filterProjects() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category') || '';
            const textContent = card.innerText.toLowerCase();
            
            const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
            const matchesSearch = textContent.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }

    // ==========================================================================
    // JS Feature 5: Real-time Form Validation & Character Counter
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const emailInput = document.getElementById('contact-email');
    const msgInput = document.getElementById('contact-message');
    const charNum = document.getElementById('char-num');
    const emailError = document.getElementById('email-error');
    const msgError = document.getElementById('message-error');

    if (msgInput && charNum) {
        msgInput.addEventListener('input', () => {
            charNum.textContent = msgInput.value.length;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailPattern.test(emailInput.value)) {
                if (emailError) emailError.textContent = 'Please enter a valid email address.';
                emailInput.classList.add('invalid');
                isValid = false;
            } else if (emailInput) {
                if (emailError) emailError.textContent = '';
                emailInput.classList.remove('invalid');
            }

            if (msgInput && msgInput.value.trim().length < 10) {
                if (msgError) msgError.textContent = 'Message must be at least 10 characters long.';
                msgInput.classList.add('invalid');
                isValid = false;
            } else if (msgInput) {
                if (msgError) msgError.textContent = '';
                msgInput.classList.remove('invalid');
            }

            if (isValid) {
                showToast('Message sent successfully! (Demo)', 'success');
                contactForm.reset();
                if (charNum) charNum.textContent = '0';
            }
        });
    }

    // ==========================================================================
    // JS Feature 6: Copy to Clipboard & Global Toast Notification System
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const userEmail = document.getElementById('user-email');

    if (copyEmailBtn && userEmail) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(userEmail.textContent).then(() => {
                showToast('Email copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Failed to copy email.', 'error');
            });
        });
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // ==========================================================================
    // JS Feature 7: Image Lightbox Modal
    // ==========================================================================
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    lightboxTriggers.forEach(img => {
        img.addEventListener('click', () => {
            if (lightboxModal && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // JS Feature 8: Dynamic Typewriter Effect in Hero Section
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    const typewriterWords = ["Web Developer.", "Cybersecurity Enthusiast.", "System Administrator."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typewriterElement) return;

        const currentWord = typewriterWords[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typewriterWords.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typewriterElement) setTimeout(typeEffect, 1000);

    // ==========================================================================
    // JS Feature 9: Floating Back-to-Top Button
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // JS Feature 10: Dynamic Content Tab Switcher (About Me)
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            const targetId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

});