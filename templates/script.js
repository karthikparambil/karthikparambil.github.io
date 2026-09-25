
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

// Open all non-anchor links in a new tab
document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});


// Interactive Cyber Pet Companion ("Sentinel")
(function initCyberPet() {
    const petBtn = document.getElementById('cyberPetBtn');
    const petCard = document.getElementById('petInfoCard');
    const closeBtn = document.getElementById('closePetCard');
    const thoughtText = document.getElementById('petThoughtText');
    const petThought = document.getElementById('petThought');
    const petCardIp = document.getElementById('petCardIp');

    if (!petBtn || !petCard) return;

    // Cycling thought bubbles (Hacking & Recon theme)
    const thoughts = [
        "...",
    ];

    // Realistic typewriter effect for thoughts
    function typeWriter(text, element, speed = 35, callback) {
        element.style.opacity = '1';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                // Adds a block cursor while typing
                element.textContent = text.substring(0, i + 1) + '█';
                i++;
                // Add random variance to typing speed
                setTimeout(type, speed + (Math.random() * 40));
            } else {
                element.textContent = text; // Remove cursor when done
                if (callback) setTimeout(callback, 4000); // Read time
            }
        }
        type();
    }

    function cycleThoughts() {
        if (!thoughtText) return;
        
        // Pick a random thought
        const nextThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        
        typeWriter(nextThought, thoughtText, 35, () => {
            // Fade out
            thoughtText.style.opacity = '0';
            // Wait random time before next thought (organic silence)
            setTimeout(cycleThoughts, Math.random() * 6000 + 3000);
        });
    }

    // Start cycle
    setTimeout(cycleThoughts, 2000);

    // Click handler to open/close popover
    petBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        petCard.classList.toggle('active');

        if (petCard.classList.contains('active')) {
            if (petThought) petThought.style.display = 'none';
            // Gather system details
            const petCardIp = document.getElementById('petCardIp');
            const petCardLoc = document.getElementById('petCardLoc');
            // OS / Platform
            const petCardRes = document.getElementById('petCardRes');
            if (petCardRes) {
                petCardRes.textContent = `${window.screen.width}x${window.screen.height}`;
            }

            const petCardOs = document.getElementById('petCardOs');
            if (petCardOs) {
                const ua = navigator.userAgent;
                let os = navigator.platform || "Unknown OS";
                if (ua.indexOf("Win") !== -1) os = "Windows";
                else if (ua.indexOf("Mac") !== -1) os = "macOS";
                else if (ua.indexOf("Linux") !== -1) os = "Linux";
                else if (ua.indexOf("Android") !== -1) os = "Android";
                else if (ua.indexOf("like Mac") !== -1) os = "iOS";
                petCardOs.textContent = `${os} [${navigator.platform}]`;
            }

            // CPU and RAM
            const petCardCpu = document.getElementById('petCardCpu');
            if (petCardCpu) petCardCpu.textContent = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Unknown';
            
            const petCardRam = document.getElementById('petCardRam');
            if (petCardRam) {
                if (navigator.deviceMemory) {
                    petCardRam.textContent = `${navigator.deviceMemory} GB`;
                } else {
                    petCardRam.textContent = 'Unknown';
                }
            }

            // GPU Renderer
            const petCardGpu = document.getElementById('petCardGpu');
            if (petCardGpu) {
                try {
                    const canvas = document.createElement('canvas');
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    petCardGpu.textContent = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
                } catch (e) {
                    petCardGpu.textContent = 'Hardware Accel Disabled';
                }
            }

            // Browser Engine
            const petCardBrowser = document.getElementById('petCardBrowser');
            if (petCardBrowser) {
                const ua = navigator.userAgent;
                let browser = "Unknown";
                if (ua.includes("Firefox")) browser = "Firefox (Gecko)";
                else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
                else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
                else if (ua.includes("Trident")) browser = "Internet Explorer";
                else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge (Blink)";
                else if (ua.includes("Chrome")) browser = "Chrome (Blink)";
                else if (ua.includes("Safari")) browser = "Safari (WebKit)";
                petCardBrowser.textContent = browser;
            }

            // Cookies & Touch & Referrer & Dark Mode
            const petCardCookies = document.getElementById('petCardCookies');
            if (petCardCookies) petCardCookies.textContent = navigator.cookieEnabled ? 'True' : 'False';

            const petCardTouch = document.getElementById('petCardTouch');
            if (petCardTouch) petCardTouch.textContent = (navigator.maxTouchPoints > 0) ? `Yes (${navigator.maxTouchPoints} pts)` : 'No';



            const petCardLang = document.getElementById('petCardLang');
            const petCardTimezone = document.getElementById('petCardTimezone');

            if (petCardLang) petCardLang.textContent = navigator.language || 'Unknown';
            
            if (petCardTimezone) {
                try {
                    petCardTimezone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
                } catch (e) {
                    petCardTimezone.textContent = 'Unknown';
                }
            }

            // Fetch IP and Location only once
            if (petCardIp && petCardIp.textContent === 'Detecting...') {
                fetch('https://ipwho.is/')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            if (petCardIp) petCardIp.textContent = data.ip;
                            if (petCardLoc) petCardLoc.textContent = `${data.city || data.region}, ${data.country_code || data.country}`;
                        } else {
                            throw new Error('API failed');
                        }
                    })
                    .catch(() => {
                        // Fallback API
                        fetch('https://api.ipify.org?format=json')
                            .then(res => res.json())
                            .then(data => {
                                if (petCardIp) petCardIp.textContent = data.ip;
                                if (petCardLoc) petCardLoc.textContent = 'Protected';
                            })
                            .catch(() => {
                                if (petCardIp) petCardIp.textContent = 'Local Client';
                                if (petCardLoc) petCardLoc.textContent = 'Protected';
                            });
                    });
            }
        } else {
            if (petThought) petThought.style.display = '';
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            petCard.classList.remove('active');
            if (petThought) petThought.style.display = '';
        });
    }

    // Close card when clicking anywhere outside
    document.addEventListener('click', (e) => {
        if (petCard.classList.contains('active') && !petCard.contains(e.target) && !petBtn.contains(e.target)) {
            petCard.classList.remove('active');
            if (petThought) petThought.style.display = '';
        }
    });

    // Random eye movement (thinking) and blinking logic for cyber bot
    let currentEyeY = 48; // Base Y position
    
    function randomBlink() {
        const leftEye = document.getElementById('petLeftEye');
        const rightEye = document.getElementById('petRightEye');
        
        if (leftEye && rightEye) {
            // Squint eyes (blink down)
            leftEye.setAttribute('height', '2');
            leftEye.setAttribute('y', currentEyeY + 4);
            rightEye.setAttribute('height', '2');
            rightEye.setAttribute('y', currentEyeY + 4);
            
            // Open eyes after 150ms
            setTimeout(() => {
                leftEye.setAttribute('height', '10');
                leftEye.setAttribute('y', currentEyeY);
                rightEye.setAttribute('height', '10');
                rightEye.setAttribute('y', currentEyeY);
            }, 150);
        }
        
        // Schedule next blink (between 1s and 6s for realism)
        setTimeout(randomBlink, Math.random() * 5000 + 1000);
    }

    // Mouse tracking logic for cyber bot eyes
    // petBtn is already defined at the top of the IIFE
    
    document.addEventListener('mousemove', (e) => {
        const leftEye = document.getElementById('petLeftEye');
        const rightEye = document.getElementById('petRightEye');
        
        if (leftEye && rightEye && petBtn) {
            // Very slight transition for smooth organic tracking
            leftEye.style.transition = "all 0.1s ease-out";
            rightEye.style.transition = "all 0.1s ease-out";
            
            const rect = petBtn.getBoundingClientRect();
            const petCenterX = rect.left + rect.width / 2;
            const petCenterY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const diffX = mouseX - petCenterX;
            const diffY = mouseY - petCenterY;
            
            // Use atan to smoothly clamp the eye movement based on distance
            // maxMoveX = 5, maxMoveY = 4
            const dx = (Math.atan(diffX * 0.003) / (Math.PI / 2)) * 5; 
            const dy = (Math.atan(diffY * 0.003) / (Math.PI / 2)) * 4;
            
            currentEyeY = 48 + dy;
            
            leftEye.setAttribute('x', 37 + dx);
            leftEye.setAttribute('y', currentEyeY);
            rightEye.setAttribute('x', 53 + dx);
            rightEye.setAttribute('y', currentEyeY);
        }
    });
    
    // Start blinking loop
    setTimeout(randomBlink, 2000);
})();

// Cyber Pet Appearance Logic
document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.getElementById('projects');
    const petContainer = document.getElementById('cyberPetContainer');

    if (projectsSection && petContainer) {
        const checkScroll = () => {
            // Once visible, we don't need to check anymore
            if (petContainer.classList.contains('pet-visible')) {
                window.removeEventListener('scroll', checkScroll);
                return;
            }
            
            const rect = projectsSection.getBoundingClientRect();
            // Trigger when the top of the projects section is within the viewport
            if (rect.top < window.innerHeight - 100) {
                petContainer.classList.add('pet-visible');
            }
        };

        window.addEventListener('scroll', checkScroll);
        // Check immediately on load in case they refreshed halfway down the page
        checkScroll();
    }
});
