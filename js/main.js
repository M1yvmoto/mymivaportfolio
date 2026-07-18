document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile menu toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksList = document.querySelector('.nav-links');
    
    if (navToggle && navLinksList) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        const navLinks = navLinksList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksList.classList.remove('active');
            });
        });
    }

    // 3. Highlight current page in navbar
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Check if the current URL ends with the link path
        if (currentPath.endsWith(linkPath) || 
            (currentPath.endsWith('/') && linkPath === 'index.html') ||
            (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Animate skill progress bars if on about page
    const skillBars = document.querySelectorAll('.skill-bar-inner');
    if (skillBars.length > 0) {
        // Intersection observer to animate skill bars when they scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percent = bar.getAttribute('data-percent');
                    bar.style.width = percent + '%';
                    observer.unobserve(bar); // Only animate once
                }
            });
        }, { threshold: 0.1 });

        skillBars.forEach(bar => observer.observe(bar));
    }
});
