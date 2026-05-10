
// Track if we're scrolling programmatically
let isScrolling = false;
let scrollTimeout;

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Remove active class from all links
            document.querySelectorAll('.nav__list-link').forEach(link => {
                link.classList.remove('active');
            });
            // Add active class to clicked link
            this.classList.add('active');

            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });

            // Reset scrolling flag after scroll completes
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000); // Slightly longer than the scroll duration
        }
    });
});

// Update active nav link on scroll
function updateActiveLink() {
    // Don't update if we're programmatically scrolling
    if (isScrolling) return;

    const sections = document.querySelectorAll('section[id]');
    let current = '';

    // Find which section is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    // Only update if we found a section
    if (current) {
        document.querySelectorAll('.nav__list-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Throttle the scroll event for better performance
let isThrottled = false;
const throttleScroll = () => {
    if (!isThrottled) {
        window.requestAnimationFrame(() => {
            updateActiveLink();
            isThrottled = false;
        });
        isThrottled = true;
    }
};

// Initial call and scroll event listener
updateActiveLink();
window.addEventListener('scroll', throttleScroll);
// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-card');
const emptyState = document.querySelector('.empty-state');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        let visibleItems = 0;

        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block'; // Or whatever your default display is
                // Since we are using grid for the parent, ensuring the item is part of the flow
                // display: block usually works fine inside a grid item unless specific overrides exist.
                // However, to be safe with grid layout:
                item.style.display = '';
                visibleItems++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show empty state if no items are visible
        if (visibleItems === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    });
});

// Pixel Mouse Effect - Throttled for Performance
let lastParticleTime = 0;
const PARTICLE_THROTTLE = 20; // Only create particle every 20ms

document.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - lastParticleTime < PARTICLE_THROTTLE) return;
    lastParticleTime = now;

    const particle = document.createElement('div');
    particle.className = 'pixel-particle';

    const x = e.clientX + (Math.random() * 10 - 5);
    const y = e.clientY + (Math.random() * 10 - 5);

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const colors = ['#59FFB9', '#7218FA', '#00FF94', '#9D4EDD'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = randomColor;
    particle.style.boxShadow = `0 0 5px ${randomColor}`;

    const size = Math.random() * 4 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 600);
});
