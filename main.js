/*
 * Fortis Hospital, Gurgaon - Doctor Appointment Booking
 * Main JavaScript file with interactive functionality
 */

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const nav = document.querySelector('.nav');
const appointmentForm = document.getElementById('appointmentForm');
const successBanner = document.getElementById('successBanner');
const closeBanner = document.getElementById('closeBanner');
const chatButton = document.getElementById('chatButton');
const chatWidget = document.getElementById('chat-widget');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

// Update theme icon
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Mobile Navigation (simplified for new layout)
function closeMobileNav() {
    // This function is kept for compatibility but simplified
    // The new layout handles mobile responsiveness with CSS only
}

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile nav if open
        closeMobileNav();
    }
}

// Form Validation
function validateForm(formData) {
    const errors = [];
    
    // Required fields
    const requiredFields = ['patientName', 'patientAge', 'gender', 'department', 'preferredDate'];
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });
    
    // Age validation
    const age = parseInt(formData.get('patientAge'));
    if (age < 1 || age > 120) {
        errors.push('Age must be between 1 and 120');
    }
    
    // Date validation
    const selectedDate = new Date(formData.get('preferredDate'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errors.push('Preferred date cannot be in the past');
    }
    
    return errors;
}

// Show success banner
function showSuccessBanner() {
    successBanner.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideSuccessBanner();
    }, 5000);
}

// Hide success banner
function hideSuccessBanner() {
    successBanner.classList.remove('show');
}

// Initialize MediQ Chat Widget
function initChatWidget() {
    if (window.Eg) {
        window.Eg.init({
            botId: 'YOUR_BOT_ID', // Replace with actual bot ID
            container: '#chat-widget',
            theme: currentTheme,
            position: 'bottom-right',
            size: 'medium'
        });
    }
}

// Toggle chat widget
function toggleChatWidget() {
    if (window.Eg && window.Eg.toggle) {
        window.Eg.toggle();
    } else {
        // Fallback: show a simple alert
        alert('Chat widget is not available. Please contact us directly.');
    }
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '';
        header.style.backdropFilter = '';
    }
}

// Intersection Observer for animations
function initScrollAnimations() {
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.department-card, .stat, .contact__item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(appointmentForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        // Show errors (you can implement a more sophisticated error display)
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
    }
    
    // Simulate form submission
    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        appointmentForm.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showSuccessBanner();
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 2000);
}

// Initialize date picker with minimum date
function initDatePicker() {
    const dateInput = document.getElementById('preferredDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Keyboard navigation for accessibility
function handleKeyboardNavigation(event) {
    // Close mobile nav on Escape
    if (event.key === 'Escape') {
        closeMobileNav();
    }
    
    // Theme toggle with Ctrl/Cmd + T
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        toggleTheme();
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize all functionality
function init() {
    // Initialize theme
    initTheme();
    
    // Initialize date picker
    initDatePicker();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize chat widget
    initChatWidget();
    
    // Event listeners
    themeToggle.addEventListener('change', toggleTheme);
    appointmentForm.addEventListener('submit', handleFormSubmit);
    closeBanner.addEventListener('click', hideSuccessBanner);
    chatButton.addEventListener('click', toggleChatWidget);
    
    // Navigation link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                scrollToSection(href.substring(1));
            }
        });
    });
    
    // Close mobile nav when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Scroll events
    window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Click outside to close mobile nav
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileNav();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileNav();
        }
    });
}

// Global function for scroll to section (used in HTML)
window.scrollToSection = scrollToSection;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (example)
function trackEvent(eventName, eventData = {}) {
    // Replace with your analytics implementation
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
function trackFormSubmission(formData) {
    const data = {
        department: formData.get('department'),
        hasSymptoms: !!formData.get('symptoms')
    };
    trackEvent('appointment_submitted', data);
}

// Export functions for potential external use
window.FortisApp = {
    toggleTheme,
    scrollToSection,
    showSuccessBanner,
    hideSuccessBanner,
    trackEvent
};
