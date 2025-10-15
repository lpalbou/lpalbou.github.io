// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Floating Contact Widget
document.addEventListener('DOMContentLoaded', () => {
    const floatingContact = document.getElementById('floating-contact');
    const contactToggle = document.getElementById('contact-toggle');
    
    if (contactToggle && floatingContact) {
        contactToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingContact.classList.toggle('active');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!floatingContact.contains(e.target)) {
                floatingContact.classList.remove('active');
            }
        });
        
        // Auto-hide on scroll (optional)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            floatingContact.style.opacity = '0.7';
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                floatingContact.style.opacity = '1';
            }, 150);
        });
    }
    
    // Initialize skills showcase
    initializeSkillsShowcase();
    
    // Initialize dark mode toggle
    initializeDarkMode();
});

// Skills Showcase Animation and Interaction
function initializeSkillsShowcase() {
    // Handle skill category toggle
    const toggleButtons = document.querySelectorAll('.skill-toggle-btn');
    const skillCategories = document.querySelectorAll('.skills-category');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active category
            skillCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === `${category}-skills`) {
                    cat.classList.add('active');
                    // Trigger animations for skill cards in the active category
                    setTimeout(() => {
                        animateSkillCards(cat);
                    }, 200);
                }
            });
        });
    });
    
    // Initialize skill card animations
    function animateSkillCards(container) {
        const skillCards = container.querySelectorAll('.skill-card');
        
        skillCards.forEach((card, index) => {
            // Reset animation state
            card.classList.remove('animate');
            const skillFill = card.querySelector('.skill-fill');
            if (skillFill) {
                skillFill.style.width = '0%';
            }
            
            setTimeout(() => {
                card.classList.add('animate');
                
                // Animate skill level bars
                const level = card.querySelector('.skill-level').getAttribute('data-level');
                if (skillFill && level) {
                    setTimeout(() => {
                        skillFill.style.width = level + '%';
                    }, 300);
                }
            }, index * 100);
        });
    }
    
    // Intersection Observer for initial animation
    const skillsShowcase = document.querySelector('.skills-showcase');
    if (skillsShowcase) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const activeCategory = skillsShowcase.querySelector('.skills-category.active');
                    if (activeCategory) {
                        animateSkillCards(activeCategory);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(skillsShowcase);
    }
}

// Scroll Progress Indicator
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update scroll progress
    updateScrollProgress();
});

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-item, .research-area, .project-card, .photo-item, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Contact Form Handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Create mailto link as fallback
    const mailtoLink = `mailto:lpalbou@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
    )}`;
    
    // Show success message
    showNotification('Thank you for your message! Your default email client will open.', 'success');
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Reset form
    contactForm.reset();
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid var(--primary-color);
            max-width: 400px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            border-left-color: var(--accent-color);
        }
        
        .notification-error {
            border-left-color: #ef4444;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
        }
        
        .notification-message {
            color: var(--gray-color);
            font-size: 0.9rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-color);
            margin-left: 1rem;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Typing Animation for Hero Title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title .text-highlight');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }
});

// Scroll Progress Indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 1002;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', createScrollProgress);


// Project Cards Hover Effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Photo Gallery Lightbox Effect
function createLightbox() {
    const photos = document.querySelectorAll('.photo-item img');
    
    photos.forEach(photo => {
        photo.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                cursor: pointer;
            `;
            
            // Create container to maintain aspect ratio
            const container = document.createElement('div');
            container.style.cssText = `
                width: 80vw;
                height: 80vh;
                max-width: 800px;
                max-height: 600px;
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            `;
            
            const img = document.createElement('img');
            img.src = photo.src;
            
            // Get the computed styles from the thumbnail to preserve framing
            const thumbnailStyles = window.getComputedStyle(photo);
            const objectPosition = thumbnailStyles.objectPosition || 'center center';
            
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: ${objectPosition};
                display: block;
            `;
            
            container.appendChild(img);
            lightbox.appendChild(container);
            document.body.appendChild(lightbox);
            
            // Close on click outside image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    if (document.getElementById('lightbox')) {
                        document.body.removeChild(lightbox);
                    }
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
}

// Initialize lightbox
document.addEventListener('DOMContentLoaded', createLightbox);

// Dynamic Voronoi Background Animation
class VoronoiBackground {
    constructor() {
        this.canvas = document.getElementById('voronoi-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.numPoints = 12;
        this.animationId = null;
        this.time = 0;
        
        this.init();
        this.createPoints();
        this.animate();
        this.setupResize();
    }
    
    init() {
        this.resize();
    }
    
    resize() {
        const hero = document.querySelector('.hero');
        this.canvas.width = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    createPoints() {
        this.points = [];
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: this.getRandomColor(),
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(102, 126, 234, 0.3)',
            'rgba(118, 75, 162, 0.3)',
            'rgba(79, 172, 254, 0.3)',
            'rgba(16, 185, 129, 0.3)',
            'rgba(245, 158, 11, 0.3)',
            'rgba(239, 68, 68, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updatePoints() {
        this.time += 0.01;
        
        this.points.forEach((point, i) => {
            // Smooth sinusoidal movement
            point.x += Math.sin(this.time + i) * 0.5;
            point.y += Math.cos(this.time + i * 0.7) * 0.3;
            
            // Boundary reflection
            if (point.x < 0 || point.x > this.width) {
                point.vx *= -1;
                point.x = Math.max(0, Math.min(this.width, point.x));
            }
            if (point.y < 0 || point.y > this.height) {
                point.vy *= -1;
                point.y = Math.max(0, Math.min(this.height, point.y));
            }
        });
    }
    
    drawVoronoi() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Create gradient overlay
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.1)');
        gradient.addColorStop(0.5, 'rgba(118, 75, 162, 0.15)');
        gradient.addColorStop(1, 'rgba(79, 172, 254, 0.1)');
        
        // Draw Voronoi-inspired mesh
        this.drawMesh();
        
        // Draw seed points
        this.points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = point.color;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = point.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Apply overall gradient
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawMesh() {
        // Create a mesh-like pattern inspired by Voronoi diagrams
        const gridSize = 80;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += gridSize) {
            for (let y = 0; y < this.height; y += gridSize) {
                // Find closest point
                let closest = this.points[0];
                let minDist = this.distance(x, y, closest.x, closest.y);
                
                this.points.forEach(point => {
                    const dist = this.distance(x, y, point.x, point.y);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = point;
                    }
                });
                
                // Draw connection to closest point with varying opacity
                const opacity = Math.max(0.15, 0.5 - minDist / 500);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(closest.x, closest.y);
                this.ctx.stroke();
            }
        }
        
        // Draw connections between nearby points
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                const dist = this.distance(
                    this.points[i].x, this.points[i].y,
                    this.points[j].x, this.points[j].y
                );
                
                if (dist < 200) {
                    const opacity = Math.max(0.1, 0.35 - dist / 200);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.points[i].x, this.points[i].y);
                    this.ctx.lineTo(this.points[j].x, this.points[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    animate() {
        if (!document.hidden) {
            this.updatePoints();
            this.drawVoronoi();
        }
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize Voronoi Background
let voronoiBackground;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for hero section to be rendered
    setTimeout(() => {
        voronoiBackground = new VoronoiBackground();
    }, 100);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (voronoiBackground) {
        voronoiBackground.destroy();
    }
});

// Pause animation when page is not visible (performance optimization)
document.addEventListener('visibilitychange', () => {
    if (voronoiBackground) {
        if (document.hidden) {
            voronoiBackground.destroy();
        } else {
            // Restart animation when page becomes visible
            setTimeout(() => {
                voronoiBackground = new VoronoiBackground();
            }, 100);
        }
    }
});

// Dark Mode Toggle Functionality
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
        
        // Update Voronoi background colors for theme
        if (window.voronoiBackground) {
            window.voronoiBackground.updateTheme(theme);
        }
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Console Welcome Message
console.log(`
🔬 Welcome to Laurent-Philippe Albou's Website!
👨‍💻 Research Scientist | AI Architect | Photographer
🔗 GitHub: https://github.com/lpalbou
💼 LinkedIn: https://fr.linkedin.com/in/laurent-philippe-albou
🧠 AbstractCore.ai: http://www.abstractcore.ai/
🧪 AI Psychology Research & FAIR 2.0 Principles

Thanks for checking out the console! 
Feel free to explore the code and reach out if you have any questions.
`);
