
let isScrolling = false;
let scrollTimeout;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            document.querySelectorAll('.nav__list-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');

            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });
});
function updateActiveLink() {
    if (isScrolling) return;

    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        document.querySelectorAll('.nav__list-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

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

updateActiveLink();
window.addEventListener('scroll', throttleScroll);
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
            scrollToProjectsEnd();
            
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

updateProjectsDisplay();

let lastParticleTime = 0;
const PARTICLE_THROTTLE = 20;

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

            // CPU — benchmark to estimate actual physical cores
            const petCardCpu = document.getElementById('petCardCpu');
            if (petCardCpu) {
                const threads = navigator.hardwareConcurrency;
                if (threads) {
                    petCardCpu.textContent = `Benchmarking...`;

                    const workerCode = 'self.onmessage=function(){var x=0;for(var i=0;i<5e6;i++)x+=Math.sqrt(i);self.postMessage(x);}';
                    const blob = new Blob([workerCode], { type: 'application/javascript' });
                    const workerUrl = URL.createObjectURL(blob);

                    function benchN(n) {
                        return new Promise(function(resolve) {
                            var done = 0, workers = [];
                            var start = performance.now();
                            for (var i = 0; i < n; i++) {
                                var w = new Worker(workerUrl);
                                w.onmessage = function() {
                                    done++;
                                    if (done === n) {
                                        var elapsed = performance.now() - start;
                                        workers.forEach(function(wk) { wk.terminate(); });
                                        resolve(elapsed);
                                    }
                                };
                                workers.push(w);
                            }
                            workers.forEach(function(wk) { wk.postMessage(0); });
                        });
                    }

                    function median(arr) {
                        var s = arr.slice().sort(function(a, b) { return a - b; });
                        var mid = Math.floor(s.length / 2);
                        return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
                    }

                    (async function() {
                        var counts = [];
                        for (var c = 1; c <= threads && c <= 20; c++) counts.push(c);

                        // Warmup: stabilize JIT and worker pool
                        await benchN(2); await benchN(2); await benchN(4);

                        // Run each count 5 times, take median for stability
                        var medians = [];
                        for (var idx = 0; idx < counts.length; idx++) {
                            var runs = [];
                            for (var r = 0; r < 5; r++) {
                                runs.push(await benchN(counts[idx]));
                            }
                            medians.push({ n: counts[idx], t: median(runs) });
                        }
                        URL.revokeObjectURL(workerUrl);

                        // Curve fitting: find core count C that best explains the data.
                        var T1 = medians[0].t;
                        var bestC = 1, bestError = Infinity;

                        for (var c = 1; c <= threads; c++) {
                            var error = 0;
                            for (var i = 0; i < medians.length; i++) {
                                var N = medians[i].n;
                                var predicted = T1 * Math.max(1, N / c);
                                var actual = medians[i].t;
                                var diff = (predicted - actual) / T1;
                                error += diff * diff;
                            }
                            if (error < bestError) {
                                bestError = error;
                                bestC = c;
                            }
                        }

                        petCardCpu.textContent = `${bestC}`;
                    })();
                } else {
                    petCardCpu.textContent = 'Unknown';
                }
            }

            // RAM — multi-signal estimation to beat browser capping
            const petCardRam = document.getElementById('petCardRam');
            if (petCardRam) {
                let bestEstimate = 0;

                // Signal 1: navigator.deviceMemory (capped & bucketed)
                if (navigator.deviceMemory) {
                    bestEstimate = navigator.deviceMemory;
                }

                // Signal 2: performance.memory.jsHeapSizeLimit (Chrome only)
                try {
                    if (performance && performance.memory && performance.memory.jsHeapSizeLimit) {
                        const heapLimitGB = performance.memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
                        let ramFromHeap = 0;
                        if (heapLimitGB >= 3.5) ramFromHeap = 16;
                        else if (heapLimitGB >= 1.5) ramFromHeap = 8;
                        else if (heapLimitGB >= 0.8) ramFromHeap = 4;
                        else ramFromHeap = 2;
                        bestEstimate = Math.max(bestEstimate, ramFromHeap);
                    }
                } catch (e) {}

                // Signal 3: Memory allocation probe
                try {
                    const testSize = 512 * 1024 * 1024; // 512 MB
                    const probe = new ArrayBuffer(testSize);
                    if (probe.byteLength === testSize) {
                        bestEstimate = Math.max(bestEstimate, 4);
                        try {
                            const probe2 = new ArrayBuffer(1536 * 1024 * 1024); // 1.5 GB
                            if (probe2.byteLength === 1536 * 1024 * 1024) {
                                bestEstimate = Math.max(bestEstimate, 8);
                            }
                        } catch (e2) {}
                    }
                } catch (e) {}

                if (bestEstimate > 0) {
                    const commonSizes = [2, 4, 6, 8, 12, 16, 24, 32, 48, 64];
                    const nearest = commonSizes.reduce((prev, curr) =>
                        Math.abs(curr - bestEstimate) < Math.abs(prev - bestEstimate) ? curr : prev
                    );
                    petCardRam.textContent = `${nearest} GB`;
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

            // Cookies & Touch
            const petCardCookies = document.getElementById('petCardCookies');
            if (petCardCookies) petCardCookies.textContent = navigator.cookieEnabled ? 'True' : 'False';

            const petCardTouch = document.getElementById('petCardTouch');
            if (petCardTouch) petCardTouch.textContent = (navigator.maxTouchPoints > 0) ? `Yes (${navigator.maxTouchPoints} pts)` : 'No';

            // Network connection
            const petCardNetwork = document.getElementById('petCardNetwork');
            if (petCardNetwork) {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (conn && conn.effectiveType) {
                    const t = conn.effectiveType.toUpperCase();
                    petCardNetwork.textContent = conn.downlink ? `${t} — ~${conn.downlink} Mbps` : t;
                } else {
                    petCardNetwork.textContent = 'Not Exposed';
                }
            }

            // Pixel Density
            const petCardDpr = document.getElementById('petCardDpr');
            if (petCardDpr) {
                const dpr = window.devicePixelRatio || 1;
                petCardDpr.textContent = `${Math.round(dpr * 100) / 100}×`;
            }

            // Referrer
            const petCardReferrer = document.getElementById('petCardReferrer');
            if (petCardReferrer) {
                const ref = document.referrer;
                if (ref) {
                    try {
                        const h = new URL(ref).hostname.replace(/^www\./, '');
                        petCardReferrer.textContent = (h === location.hostname) ? 'Direct / Internal' : h;
                    } catch (e) {
                        petCardReferrer.textContent = 'Direct';
                    }
                } else {
                    petCardReferrer.textContent = 'Direct (no referrer)';
                }
            }

            // Dark Mode
            const petCardDarkMode = document.getElementById('petCardDarkMode');
            if (petCardDarkMode) {
                if (window.matchMedia) {
                    petCardDarkMode.textContent = matchMedia('(prefers-color-scheme: dark)').matches ? 'Enabled' : 'Disabled';
                } else {
                    petCardDarkMode.textContent = 'Not Exposed';
                }
            }

            // Return Visitor
            const petCardVisits = document.getElementById('petCardVisits');
            if (petCardVisits) {
                try {
                    const k = 'sentinel_visits';
                    const n = (parseInt(localStorage.getItem(k), 10) || 0) + 1;
                    localStorage.setItem(k, n);
                    petCardVisits.textContent = n === 1 ? '1st visit' : `Visit #${n}`;
                } catch (e) {
                    petCardVisits.textContent = 'Storage Blocked';
                }
            }

            // Ad Blocker Detection
            const petCardAdblock = document.getElementById('petCardAdblock');
            if (petCardAdblock) {
                const bait = document.createElement('div');
                bait.className = 'adsbox ad-banner pub_300x250 text-ad';
                bait.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px';
                document.body.appendChild(bait);
                setTimeout(() => {
                    const blocked = bait.offsetHeight === 0 || bait.offsetParent === null || getComputedStyle(bait).display === 'none';
                    petCardAdblock.textContent = blocked ? 'Detected' : 'Not Detected';
                    try { bait.remove(); } catch (e) {}
                }, 300);
            }

            // Battery Status (async)
            const petCardBattery = document.getElementById('petCardBattery');
            if (petCardBattery && navigator.getBattery) {
                navigator.getBattery().then(b => {
                    petCardBattery.textContent = `${Math.round(b.level * 100)}%${b.charging ? ' (Charging)' : ''}`;
                }).catch(() => {
                    petCardBattery.textContent = 'Not Exposed';
                });
            } else if (petCardBattery) {
                petCardBattery.textContent = 'Not Exposed';
            }



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
