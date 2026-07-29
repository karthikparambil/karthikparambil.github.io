
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
// Filter functionality & Pagination
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-card');
const emptyState = document.querySelector('.empty-state');
const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
const INITIAL_LIMIT = 6;
let isExpanded = false;

function updateProjectsDisplay() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    
    const visibleItems = [];
    projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue || (filterValue === 'tools' && itemCategory === 'tool')) {
            visibleItems.push(item);
        } else {
            item.style.display = 'none';
        }
    });

    visibleItems.forEach((item, index) => {
        if (isExpanded || index < INITIAL_LIMIT) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });

    if (emptyState) {
        emptyState.style.display = visibleItems.length === 0 ? 'block' : 'none';
    }

    const expandContainer = document.querySelector('.projects-expand');
    if (expandContainer && toggleProjectsBtn) {
        if (visibleItems.length > INITIAL_LIMIT) {
            expandContainer.style.display = 'flex';
            const btnText = toggleProjectsBtn.querySelector('.btn-text');
            if (isExpanded) {
                if (btnText) btnText.textContent = 'Show Less Projects';
                toggleProjectsBtn.classList.add('is-expanded');
            } else {
                const remaining = visibleItems.length - INITIAL_LIMIT;
                if (btnText) btnText.textContent = `Show More Projects (+${remaining})`;
                toggleProjectsBtn.classList.remove('is-expanded');
            }
        } else {
            expandContainer.style.display = 'none';
        }
    }
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        isExpanded = false;
        updateProjectsDisplay();
    });
});

function scrollToProjectsEnd() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    
    const visibleCards = Array.from(projectItems).filter(item => {
        const cat = item.getAttribute('data-category');
        return filterValue === 'all' || cat === filterValue || (filterValue === 'tools' && cat === 'tool');
    });

    const targetCard = visibleCards.length >= INITIAL_LIMIT ? visibleCards[INITIAL_LIMIT - 1] : visibleCards[visibleCards.length - 1];
    
    if (targetCard) {
        const cardRect = targetCard.getBoundingClientRect();
        const cardBottom = cardRect.top + window.pageYOffset + cardRect.height;
        const targetScrollY = cardBottom - window.innerHeight + 120;

        window.scrollTo({
            top: Math.max(0, targetScrollY),
            behavior: 'smooth'
        });
    }
}

if (toggleProjectsBtn) {
    toggleProjectsBtn.addEventListener('click', () => {
        if (isExpanded) {
            // Smoothly scroll UP to the 6th project position first
            scrollToProjectsEnd();
            
            // Wait for smooth scroll animation to finish (400ms) before hiding extra items
            setTimeout(() => {
                isExpanded = false;
                updateProjectsDisplay();
            }, 400);
        } else {
            isExpanded = true;
            updateProjectsDisplay();
        }
    });
}

// Initial invocation
updateProjectsDisplay();

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
