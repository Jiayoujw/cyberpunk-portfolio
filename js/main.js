/* ============================================
   MAIN CONTROLLER
   Boot, cursor, time, scroll, animations
   ============================================ */

(function() {
    'use strict';

    // ============================================================
    // BOOT SEQUENCE
    // ============================================================
    var bootScreen = document.getElementById('boot-screen');
    var bootText = document.getElementById('boot-text');
    var bootProgressBar = document.getElementById('boot-progress-bar');
    var bootStatus = document.getElementById('boot-status');
    var bootIdx = 0;
    var bootProgress = 0;

    function getBootMessages() {
        return [
            I18N.t('boot-1'), I18N.t('boot-2'), I18N.t('boot-3'),
            I18N.t('boot-4'), I18N.t('boot-5'), I18N.t('boot-6'),
            I18N.t('boot-7'), I18N.t('boot-8'), I18N.t('boot-9'),
            I18N.t('boot-10'), I18N.t('boot-11'), I18N.t('boot-12')
        ];
    }

    function bootStep() {
        var msgs = getBootMessages();
        if (bootIdx < msgs.length) {
            bootText.textContent += msgs[bootIdx] + '\n';
            bootIdx++;
            bootProgress = (bootIdx / msgs.length) * 100;
            bootProgressBar.style.width = bootProgress + '%';
            var delay = 100 + Math.random() * 150;
            setTimeout(bootStep, delay);
        } else {
            bootStatus.textContent = I18N.t('boot-ready');
            bootStatus.style.color = 'var(--color-green)';
            setTimeout(function() {
                bootScreen.classList.add('fade-out');
                setTimeout(function() {
                    bootScreen.style.display = 'none';
                    initInteractions();
                }, 600);
            }, 500);
        }
    }

    // Skip boot screen on click/key
    bootScreen.addEventListener('click', skipBoot);
    document.addEventListener('keydown', function(e) {
        if (bootScreen.style.display !== 'none' && e.key === 'Escape') {
            skipBoot();
        }
    }, { once: true });

    function skipBoot() {
        bootScreen.classList.add('fade-out');
        setTimeout(function() {
            bootScreen.style.display = 'none';
            initInteractions();
        }, 300);
    }

    // Start boot
    setTimeout(bootStep, 200);

    // Failsafe: hide after 8s
    setTimeout(function() {
        if (bootScreen.style.display !== 'none') skipBoot();
    }, 8000);

    // ============================================================
    // INITIALIZE INTERACTIONS (after boot)
    // ============================================================
    function initInteractions() {
        initLangToggle();
        initAudioToggle();
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
        initAudioHooks();
        initVisitorCounter();
        initPageTransitions();
    }

    // ============================================================
    // LANGUAGE TOGGLE
    // ============================================================
    function initLangToggle() {
        var btn = document.getElementById('lang-toggle');
        if (!btn) return;

        btn.addEventListener('click', function() {
            var next = I18N.getLang() === 'zh' ? 'en' : 'zh';
            I18N.setLanguage(next);
            restartTypewriter();
        });
    }

    // ============================================================
    // AUDIO TOGGLE
    // ============================================================
    function initAudioToggle() {
        var btn = document.getElementById('audio-toggle');
        if (!btn) return;

        NexusAudio.initMuteButton();
        btn.addEventListener('click', function() {
            NexusAudio.toggleMute();
        });
    }

    // ============================================================
    // AUDIO HOOKS (hover/click sounds)
    // ============================================================
    function initAudioHooks() {
        // Hover sound on cards and links
        var hoverables = document.querySelectorAll('a, button, .holo-card, .project-card, .contact-card');
        hoverables.forEach(function(el) {
            el.addEventListener('mouseenter', function() { NexusAudio.hoverSweep(); });
        });

        // Click sound on buttons
        var clickables = document.querySelectorAll('.cyber-btn, .lang-toggle, #audio-toggle, .contact-card, .nav-link');
        clickables.forEach(function(el) {
            el.addEventListener('click', function() { NexusAudio.clickThud(); });
        });

        // Terminal key blip is handled in terminal.js
    }

    // ============================================================
    // VISITOR COUNTER
    // ============================================================
    function initVisitorCounter() {
        var el = document.getElementById('visitor-number');
        if (!el) return;

        var key = 'nexus-visitor-count';
        var base = 1337;
        if (!localStorage.getItem('nexus-visited')) {
            localStorage.setItem('nexus-visited', '1');
            var globalCount = parseInt(localStorage.getItem(key) || '0', 10) + 1;
            localStorage.setItem(key, globalCount);
        }
        var count = parseInt(localStorage.getItem(key) || '0', 10);
        count = count || 1;
        var display = base + count;
        el.textContent = '#' + String(display).padStart(4, '0');
    }

    // ============================================================
    // PAGE TRANSITIONS
    // ============================================================
    function initPageTransitions() {
        var overlay = document.getElementById('page-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            overlay.id = 'page-transition-overlay';
            document.body.appendChild(overlay);
        }

        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    var target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        // Trigger overlay
                        overlay.classList.add('active');
                        var dir = target.getBoundingClientRect().top > window.scrollY ? 1 : -1;
                        NexusAudio.navSwoosh(dir);
                        setTimeout(function() {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            target.classList.add('section-entering');
                            setTimeout(function() {
                                target.classList.remove('section-entering');
                                overlay.classList.remove('active');
                            }, 600);
                        }, 150);
                    }
                }
            });
        });
    }

    // ============================================================
    // CUSTOM CURSOR
    // ============================================================
    function initCursor() {
        var dot = document.getElementById('cursor-dot');
        var outline = document.getElementById('cursor-outline');
        if (!dot || !outline) return;

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            dot.style.display = 'none';
            outline.style.display = 'none';
            document.body.style.cursor = 'auto';
            return;
        }

        var mouseX = 0, mouseY = 0;
        var outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function tick() {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
            requestAnimationFrame(tick);
        }
        tick();

        var hoverables = document.querySelectorAll('a, button, .holo-card, .terminal-input, input');
        hoverables.forEach(function(el) {
            el.addEventListener('mouseenter', function() { outline.classList.add('hover'); });
            el.addEventListener('mouseleave', function() { outline.classList.remove('hover'); });
        });

        document.addEventListener('mouseleave', function() {
            dot.style.opacity = '0';
            outline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function() {
            dot.style.opacity = '1';
            outline.style.opacity = '1';
        });
    }

    // ============================================================
    // CLOCK + COORDS
    // ============================================================
    function initClock() {
        var timeEl = document.getElementById('hud-time');
        var coordsEl = document.getElementById('hud-coords');
        if (!timeEl) return;

        function update() {
            var now = new Date();
            var hh = String(now.getHours()).padStart(2, '0');
            var mm = String(now.getMinutes()).padStart(2, '0');
            var ss = String(now.getSeconds()).padStart(2, '0');
            timeEl.textContent = hh + ':' + mm + ':' + ss;
        }
        update();
        setInterval(update, 1000);

        if (coordsEl) {
            var lat = 35.6;
            var lon = 139.7;
            setInterval(function() {
                lat += (Math.random() - 0.5) * 0.02;
                lon += (Math.random() - 0.5) * 0.02;
                coordsEl.textContent = I18N.t('hud-coords');
            }, 2000);
        }
    }

    // ============================================================
    // TYPEWRITER (Hero subtitle)
    // ============================================================
    var typewriterTimer = null;

    function initTypewriter() {
        restartTypewriter();
    }

    function restartTypewriter() {
        if (typewriterTimer) clearTimeout(typewriterTimer);

        var el = document.getElementById('typewriter');
        if (!el) return;

        var phrases = [
            I18N.t('type-1'), I18N.t('type-2'), I18N.t('type-3'),
            I18N.t('type-4'), I18N.t('type-5')
        ];

        var phraseIdx = 0;
        var charIdx = 0;
        var isDeleting = false;

        function tick() {
            var phrase = phrases[phraseIdx];

            if (!isDeleting) {
                el.textContent = phrase.slice(0, ++charIdx);
                if (charIdx === phrase.length) {
                    isDeleting = true;
                    typewriterTimer = setTimeout(tick, 2000);
                    return;
                }
            } else {
                el.textContent = phrase.slice(0, --charIdx);
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            }

            var delay = isDeleting ? 30 : (60 + Math.random() * 60);
            typewriterTimer = setTimeout(tick, delay);
        }

        typewriterTimer = setTimeout(tick, 1800);
    }

    // ============================================================
    // SCROLL REVEAL
    // ============================================================
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) return;

        var targets = document.querySelectorAll('.section-header, .holo-card, .about-grid > *, .about-stats > *, .skill-category, .terminal-window, .contact-grid > *');
        targets.forEach(function(el) { el.classList.add('reveal'); });

        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        targets.forEach(function(el) { obs.observe(el); });
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    function initNavigation() {
        var sections = document.querySelectorAll('section[id]');
        var links = document.querySelectorAll('.nav-link');
        if (!sections.length || !links.length) return;

        function updateActive() {
            var scrollPos = window.scrollY + 150;
            sections.forEach(function(sec) {
                var top = sec.offsetTop;
                var bot = top + sec.offsetHeight;
                if (scrollPos >= top && scrollPos < bot) {
                    var id = sec.id;
                    links.forEach(function(l) {
                        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                    });
                }
            });
        }

        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    updateActive();
                    ticking = false;
                });
                ticking = true;
            }
        });
        updateActive();
    }

    // ============================================================
    // STAT COUNTERS
    // ============================================================
    function initStatCounters() {
        var stats = document.querySelectorAll('.stat-num');
        if (!stats.length) return;

        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    countTo(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(function(s) { obs.observe(s); });

        function countTo(el) {
            var target = parseInt(el.dataset.target, 10);
            var duration = 1800;
            var start = performance.now();

            function step(now) {
                var t = Math.min(1, (now - start) / duration);
                var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
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
        var bars = document.querySelectorAll('.skill-bar');
        if (!bars.length) return;

        bars.forEach(function(bar) {
            var track = document.createElement('div');
            track.className = 'skill-bar-track';
            var fill = document.createElement('div');
            fill.className = 'skill-bar-fill';
            track.appendChild(fill);
            bar.appendChild(track);
        });

        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var fill = entry.target.querySelector('.skill-bar-fill');
                    var level = entry.target.dataset.level;
                    if (fill) {
                        setTimeout(function() {
                            fill.style.width = level + '%';
                        }, 100);
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(function(b) { obs.observe(b); });
    }

    // ============================================================
    // PROJECT CARD 3D TILT
    // ============================================================
    function initProjectTilt() {
        var cards = document.querySelectorAll('[data-tilt]');
        if (!cards.length) return;

        cards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var cx = rect.width / 2;
                var cy = rect.height / 2;
                var rotX = -((y - cy) / cy) * 8;
                var rotY = ((x - cx) / cx) * 8;
                card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ============================================================
    // HERO FRAME TILT
    // ============================================================
    function initHeroFrameTilt() {
        var frame = document.querySelector('.hero-frame');
        if (!frame) return;

        document.addEventListener('mousemove', function(e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 4;
            var y = (e.clientY / window.innerHeight - 0.5) * 4;
            frame.style.transform = 'perspective(1500px) rotateX(' + (-y) + 'deg) rotateY(' + x + 'deg)';
        });
    }

    // ============================================================
    // HOVER EFFECTS
    // ============================================================
    function initHoverEffects() {
        var flashable = document.querySelectorAll('.section-title');
        flashable.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                el.style.animation = 'none';
                requestAnimationFrame(function() { el.style.animation = ''; });
            });
        });
    }

    // ============================================================
    // KONAMI CODE EASTER EGG
    // ============================================================
    var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var kIdx = 0;
    document.addEventListener('keydown', function(e) {
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
        var banner = document.createElement('div');
        banner.style.cssText = [
            'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
            'background:rgba(0,0,0,0.9);border:2px solid var(--color-magenta);',
            'padding:2rem 3rem;z-index:99999;',
            'font-family:var(--font-display);font-size:2rem;',
            'color:var(--color-yellow);text-shadow:0 0 20px var(--color-yellow);',
            'letter-spacing:0.3rem;text-align:center;'
        ].join('');
        banner.innerHTML = I18N.t('konami-title') + '<br><span style="font-size:1rem;color:var(--color-cyan);">' + I18N.t('konami-sub') + '</span>';
        document.body.appendChild(banner);
        setTimeout(function() {
            banner.remove();
            document.body.style.animation = '';
        }, 3000);
    }

    // ============================================================
    // CONSOLE EASTER EGG
    // ============================================================
    console.log('%c╔══════════════════════════════════════╗', 'color: #00ffff; font-family: monospace;');
    console.log('%c║      ' + I18N.t('console-1') + '      ║', 'color: #00ffff; font-family: monospace; font-weight: bold;');
    console.log('%c║       ' + I18N.t('console-2') + '         ║', 'color: #ff00ff; font-family: monospace;');
    console.log('%c╚══════════════════════════════════════╝', 'color: #00ffff; font-family: monospace;');
    console.log('%c' + I18N.t('console-3'), 'color: #fff700; font-style: italic;');
})();
