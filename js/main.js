/* ============================================
   MAIN CONTROLLER
   Boot, cursor, time, scroll, animations
   ============================================ */

(function() {
    'use strict';

    // ============================================================
    // BOOT SEQUENCE
    // ============================================================
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const bootProgressBar = document.getElementById('boot-progress-bar');
    const bootStatus = document.getElementById('boot-status');

    const bootMessages = [
        '> [BIOS] Initializing N3X.OS v2.077.1...',
        '> [BIOS] Memory check: 16384MB OK',
        '> [BIOS] Neural interface: DETECTED',
        '> [SYS]  Loading kernel modules...',
        '> [SYS]  Mounting /dev/cyberdeck...',
        '> [NET]  Establishing encrypted tunnel...',
        '> [NET]  Connection: SECURE',
        '> [SYS]  Loading user profile: nexus',
        '> [GFX]  Initializing holographic display...',
        '> [GFX]  Particle system: ONLINE',
        '> [SYS]  All systems nominal.',
        '> [SYS]  Welcome back, choomba.'
    ];

    let bootIdx = 0;
    let bootProgress = 0;

    function bootStep() {
        if (bootIdx < bootMessages.length) {
            bootText.textContent += bootMessages[bootIdx] + '\n';
            bootIdx++;
            bootProgress = (bootIdx / bootMessages.length) * 100;
            bootProgressBar.style.width = bootProgress + '%';

            const delay = 100 + Math.random() * 150;
            setTimeout(bootStep, delay);
        } else {
            bootStatus.textContent = 'SYSTEM READY';
            bootStatus.style.color = 'var(--color-green)';
            setTimeout(() => {
                bootScreen.classList.add('fade-out');
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    initInteractions();
                }, 600);
            }, 500);
        }
    }

    // Skip boot screen on click/key
    bootScreen.addEventListener('click', skipBoot);
    document.addEventListener('keydown', (e) => {
        if (bootScreen.style.display !== 'none' && e.key === 'Escape') {
            skipBoot();
        }
    }, { once: true });

    function skipBoot() {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.style.display = 'none';
            initInteractions();
        }, 300);
    }

    // Start boot
    setTimeout(bootStep, 200);

    // Failsafe: hide after 8s no matter what
    setTimeout(() => {
        if (bootScreen.style.display !== 'none') {
            skipBoot();
        }
    }, 8000);

    // ============================================================
    // INITIALIZE INTERACTIONS (after boot)
    // ============================================================
    function initInteractions() {
        initCursor();
        initClock();
        initTypewriter();
        initScrollReveal();
        initNavigation();
        initStatCounters();
        initSkillBars();
        initProjectTilt();
        initHoverEffects();
        initHeroFrameTilt();
    }

    // ============================================================
    // CUSTOM CURSOR
    // ============================================================
    function initCursor() {
        const dot = document.getElementById('cursor-dot');
        const outline = document.getElementById('cursor-outline');
        if (!dot || !outline) return;

        // Skip on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            dot.style.display = 'none';
            outline.style.display = 'none';
            document.body.style.cursor = 'auto';
            return;
        }

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Smoothly lag the outline
        function tick() {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
            requestAnimationFrame(tick);
        }
        tick();

        // Hover state for interactive elements
        const hoverables = document.querySelectorAll('a, button, .holo-card, .terminal-input, input');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            outline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity = '1';
            outline.style.opacity = '1';
        });
    }

    // ============================================================
    // CLOCK + COORDS
    // ============================================================
    function initClock() {
        const timeEl = document.getElementById('hud-time');
        const coordsEl = document.getElementById('hud-coords');
        if (!timeEl) return;

        function update() {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            timeEl.textContent = `${hh}:${mm}:${ss}`;
        }
        update();
        setInterval(update, 1000);

        // Slowly drifting "coordinates" for vibes
        if (coordsEl) {
            let lat = 35.6;
            let lon = 139.7;
            setInterval(() => {
                lat += (Math.random() - 0.5) * 0.02;
                lon += (Math.random() - 0.5) * 0.02;
                coordsEl.textContent = `N ${lat.toFixed(1)}° / E ${lon.toFixed(1)}°`;
            }, 2000);
        }
    }

    // ============================================================
    // TYPEWRITER (Hero subtitle)
    // ============================================================
    function initTypewriter() {
        const el = document.getElementById('typewriter');
        if (!el) return;

        const phrases = [
            'Building digital experiences with neon and code',
            'Crafting interfaces that pulse with electric life',
            'Pixels by day. Particles by night.',
            'Where art meets the machine — that\'s home.',
            '在霓虹与代码之间，构建数字奇迹。'
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function tick() {
            const phrase = phrases[phraseIdx];

            if (!isDeleting) {
                el.textContent = phrase.slice(0, ++charIdx);
                if (charIdx === phrase.length) {
                    isDeleting = true;
                    setTimeout(tick, 2000);
                    return;
                }
            } else {
                el.textContent = phrase.slice(0, --charIdx);
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            }

            const delay = isDeleting ? 30 : (60 + Math.random() * 60);
            setTimeout(tick, delay);
        }

        setTimeout(tick, 1800);
    }

    // ============================================================
    // SCROLL REVEAL (IntersectionObserver)
    // ============================================================
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) return;

        // Auto-tag sections for reveal
        const targets = document.querySelectorAll('.section-header, .holo-card, .about-grid > *, .about-stats > *, .skill-category, .terminal-window, .contact-grid > *');
        targets.forEach(el => el.classList.add('reveal'));

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        targets.forEach(el => obs.observe(el));
    }

    // ============================================================
    // NAVIGATION (active link based on scroll)
    // ============================================================
    function initNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');

        if (!sections.length || !links.length) return;

        // Scroll-based active detection
        function updateActive() {
            const scrollPos = window.scrollY + 150;
            sections.forEach(sec => {
                const top = sec.offsetTop;
                const bot = top + sec.offsetHeight;
                if (scrollPos >= top && scrollPos < bot) {
                    const id = sec.id;
                    links.forEach(l => {
                        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                    });
                }
            });
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActive();
                    ticking = false;
                });
                ticking = true;
            }
        });
        updateActive();

        // Smooth scroll on click (handled by CSS scroll-behavior, but ensure offset)
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    // ============================================================
    // STAT COUNTERS
    // ============================================================
    function initStatCounters() {
        const stats = document.querySelectorAll('.stat-num');
        if (!stats.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countTo(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(s => obs.observe(s));

        function countTo(el) {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const t = Math.min(1, (now - start) / duration);
                // Easing (easeOutExpo)
                const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                el.textContent = Math.floor(eased * target).toLocaleString();
                if (t < 1) requestAnimationFrame(step);
                else el.textContent = target.toLocaleString();
            }
            requestAnimationFrame(step);
        }
    }

    // ============================================================
    // SKILL BARS
    // ============================================================
    function initSkillBars() {
        const bars = document.querySelectorAll('.skill-bar');
        if (!bars.length) return;

        // Inject the track + fill into each skill-bar
        bars.forEach(bar => {
            const track = document.createElement('div');
            track.className = 'skill-bar-track';
            const fill = document.createElement('div');
            fill.className = 'skill-bar-fill';
            track.appendChild(fill);
            bar.appendChild(track);
        });

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.skill-bar-fill');
                    const level = entry.target.dataset.level;
                    if (fill) {
                        setTimeout(() => {
                            fill.style.width = level + '%';
                        }, 100);
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(b => obs.observe(b));
    }

    // ============================================================
    // PROJECT CARD 3D TILT
    // ============================================================
    function initProjectTilt() {
        const cards = document.querySelectorAll('[data-tilt]');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const cx = rect.width / 2;
                const cy = rect.height / 2;

                const rotX = -((y - cy) / cy) * 8;
                const rotY = ((x - cx) / cx) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ============================================================
    // HERO FRAME TILT (subtle)
    // ============================================================
    function initHeroFrameTilt() {
        const frame = document.querySelector('.hero-frame');
        if (!frame) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 4;
            const y = (e.clientY / window.innerHeight - 0.5) * 4;
            frame.style.transform = `perspective(1500px) rotateX(${-y}deg) rotateY(${x}deg)`;
        });
    }

    // ============================================================
    // HOVER EFFECTS (random glitch)
    // ============================================================
    function initHoverEffects() {
        // Add glitch-flash class on certain elements when in view
        const flashable = document.querySelectorAll('.section-title');
        flashable.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'none';
                requestAnimationFrame(() => {
                    el.style.animation = '';
                });
            });
        });
    }

    // ============================================================
    // KONAMI CODE EASTER EGG
    // ============================================================
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let kIdx = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konami[kIdx]) {
            kIdx++;
            if (kIdx === konami.length) {
                triggerKonami();
                kIdx = 0;
            }
        } else {
            kIdx = 0;
        }
    });

    function triggerKonami() {
        document.body.style.animation = 'gradient-flow 0.5s linear 6';
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9); border: 2px solid var(--color-magenta);
            padding: 2rem 3rem; z-index: 99999;
            font-family: var(--font-display); font-size: 2rem;
            color: var(--color-yellow); text-shadow: 0 0 20px var(--color-yellow);
            letter-spacing: 0.3rem; text-align: center;
        `;
        banner.innerHTML = '🎮 KONAMI MODE ACTIVATED 🎮<br><span style="font-size:1rem;color:var(--color-cyan);">+30 STYLE POINTS</span>';
        document.body.appendChild(banner);
        setTimeout(() => {
            banner.remove();
            document.body.style.animation = '';
        }, 3000);
    }

    // ============================================================
    // CONSOLE EASTER EGG
    // ============================================================
    console.log('%c╔══════════════════════════════════════╗', 'color: #00ffff; font-family: monospace;');
    console.log('%c║      NEXUS // DIGITAL ARCHITECT      ║', 'color: #00ffff; font-family: monospace; font-weight: bold;');
    console.log('%c║       Code in the Neon Light         ║', 'color: #ff00ff; font-family: monospace;');
    console.log('%c╚══════════════════════════════════════╝', 'color: #00ffff; font-family: monospace;');
    console.log('%cTry the Konami code, or scroll to the terminal section :)', 'color: #fff700; font-style: italic;');
})();
