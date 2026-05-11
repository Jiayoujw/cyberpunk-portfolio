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
        initBackToTop();
        initProjectModal();
        initProjectFlip();
        initRadarChart();
        initTheme();
        initContactForm();
        initEasterDismiss();
        initGithubHeatmap();
        initMobileNav();
        initGlitchTrigger();
        initWindowManager();
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
    // BACK TO TOP
    // ============================================================
    function initBackToTop() {
        var btn = document.getElementById('back-to-top');
        var canvas = document.getElementById('btop-canvas');
        if (!btn || !canvas) return;

        var ctx = canvas.getContext('2d');
        var cx = 25, cy = 25, r = 22;

        function updateProgress() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

            if (scrollTop > window.innerHeight) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }

            // Draw progress ring
            ctx.clearRect(0, 0, 50, 50);
            ctx.beginPath();
            ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, r - 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.strokeStyle = progress > 0.99 ? '#ff00ff' : '#00ffff';
            ctx.shadowColor = progress > 0.99 ? '#ff00ff' : '#00ffff';
            ctx.shadowBlur = 6;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        window.addEventListener('scroll', updateProgress);
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        updateProgress();
    }

    // ============================================================
    // PROJECT MODAL
    // ============================================================
    function initProjectModal() {
        var overlay = document.getElementById('modal-overlay');
        var closeBtn = document.getElementById('modal-close');
        var titleEl = document.getElementById('modal-title');
        var descEl = document.getElementById('modal-desc');
        var techEl = document.getElementById('modal-tech');
        var thumbEl = document.getElementById('modal-thumb');
        var linkEl = document.getElementById('modal-link');

        if (!overlay || !closeBtn) return;

        function openModal(card) {
            var title = card.querySelector('.project-title').textContent;
            var desc = card.querySelector('.project-desc').textContent;
            var techs = card.querySelectorAll('.tech-tag');
            var thumbClass = card.querySelector('.project-thumb');
            var thumbIcon = card.querySelector('.project-thumb-icon');

            titleEl.textContent = title;
            descEl.textContent = desc;
            techEl.innerHTML = '';
            techs.forEach(function(t) {
                var span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = t.textContent;
                techEl.appendChild(span);
            });

            // Copy thumb gradient
            if (thumbClass && thumbEl) {
                var bgStyle = getComputedStyle(thumbClass, '::before').background;
                thumbEl.style.background = bgStyle || 'linear-gradient(135deg, #001a1a, #001a2e)';
            }

            linkEl.innerHTML = '<span class="project-link" data-i18n="prj-link">' + I18N.t('prj-link') + '</span>';

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        var cards = document.querySelectorAll('.project-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function() { openModal(card); });
        });

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ============================================================
    // PROJECT CARD 3D FLIP
    // ============================================================
    function initProjectFlip() {
        var cards = document.querySelectorAll('.project-card[data-flip]');
        if (!cards.length) return;

        // Back face content per project ID
        var backData = {
            'PRJ_001': {
                descLong: I18N.t('prj-1-desc-long'),
                features: [I18N.t('prj-1-feat-1'), I18N.t('prj-1-feat-2'), I18N.t('prj-1-feat-3')]
            },
            'PRJ_002': {
                descLong: I18N.t('prj-2-desc-long'),
                features: [I18N.t('prj-2-feat-1'), I18N.t('prj-2-feat-2'), I18N.t('prj-2-feat-3')]
            },
            'PRJ_003': {
                descLong: I18N.t('prj-3-desc-long'),
                features: [I18N.t('prj-3-feat-1'), I18N.t('prj-3-feat-2'), I18N.t('prj-3-feat-3')]
            },
            'PRJ_004': {
                descLong: I18N.t('prj-4-desc-long'),
                features: [I18N.t('prj-4-feat-1'), I18N.t('prj-4-feat-2'), I18N.t('prj-4-feat-3')]
            },
            'PRJ_005': {
                descLong: I18N.t('prj-5-desc-long'),
                features: [I18N.t('prj-5-feat-1'), I18N.t('prj-5-feat-2'), I18N.t('prj-5-feat-3')]
            },
            'PRJ_006': {
                descLong: I18N.t('prj-6-desc-long'),
                features: [I18N.t('prj-6-feat-1'), I18N.t('prj-6-feat-2'), I18N.t('prj-6-feat-3')]
            }
        };

        cards.forEach(function(card) {
            // Wrap existing children in card-inner > card-front
            var children = Array.prototype.slice.call(card.children);
            var inner = document.createElement('div');
            inner.className = 'card-inner';

            var front = document.createElement('div');
            front.className = 'card-front';
            children.forEach(function(c) { front.appendChild(c); });

            // Build back face
            var idEl = front.querySelector('.project-id');
            var id = idEl ? idEl.textContent.trim() : '';
            var titleEl = front.querySelector('.project-title');
            var title = titleEl ? titleEl.textContent : '';
            var techEls = front.querySelectorAll('.tech-tag');
            var data = backData[id] || { descLong: '', features: [] };

            var back = document.createElement('div');
            back.className = 'card-back';
            var html = '<button class="card-back-close">[X] ' + I18N.t('card-flip-close') + '</button>';
            html += '<div class="card-back-thumb"></div>';
            html += '<h3 class="card-back-title">' + title + '</h3>';
            html += '<p class="card-back-desc-long">' + data.descLong + '</p>';
            html += '<div class="card-back-tech">';
            techEls.forEach(function(t) { html += '<span class="tech-tag">' + t.textContent + '</span>'; });
            html += '</div>';
            if (data.features.length) {
                html += '<div class="card-back-extra">';
                data.features.forEach(function(f) { html += '<span class="card-back-feature">' + f + '</span>'; });
                html += '</div>';
            }
            back.innerHTML = html;

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);

            // Click to flip
            card.addEventListener('click', function(e) {
                if (e.target.closest('.card-back-close') || e.target.closest('a')) return;
                card.classList.toggle('flipped');
            });

            // Close button
            var closeBtn = back.querySelector('.card-back-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    card.classList.remove('flipped');
                });
            }
        });
    }

    // ============================================================
    // SKILLS RADAR CHART
    // ============================================================
    function initRadarChart() {
        var canvas = document.getElementById('radar-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        function sizeRadar() {
            var size = Math.min(400, window.innerWidth - 40);
            canvas.width = size;
            canvas.height = size;
            return size;
        }
        var S = sizeRadar();
        var cx = S / 2, cy = S / 2, maxR = S * 0.375;
        window.addEventListener('resize', function() {
            S = sizeRadar();
            cx = S / 2; cy = S / 2; maxR = S * 0.375;
            draw(animProgress || 1);
        });

        var labels = [
            I18N.t('radar-frontend'), I18N.t('radar-backend'),
            I18N.t('radar-devops'), I18N.t('radar-design'),
            I18N.t('radar-arch'), I18N.t('radar-perf')
        ];
        var values = [95, 93, 86, 82, 88, 90];
        var angles = labels.map(function(_, i) { return -Math.PI / 2 + (Math.PI * 2 * i) / labels.length; });

        var animProgress = 0;
        var animationActive = false;
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !animationActive) {
                    animationActive = true;
                    animateIn();
                }
            });
        }, { threshold: 0.3 });
        obs.observe(canvas);

        function draw(p) {
            ctx.clearRect(0, 0, S, S);

            // Grid circles
            [0.2, 0.4, 0.6, 0.8, 1].forEach(function(s) {
                ctx.beginPath();
                ctx.arc(cx, cy, maxR * s, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0,255,255,' + (0.05 + s * 0.08) + ')';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Axes
            angles.forEach(function(a) {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + maxR * Math.cos(a), cy + maxR * Math.sin(a));
                ctx.strokeStyle = 'rgba(0,255,255,0.1)';
                ctx.stroke();
            });

            // Data polygon
            ctx.beginPath();
            values.forEach(function(v, i) {
                var r = (v / 100) * maxR * p;
                var x = cx + r * Math.cos(angles[i]);
                var y = cy + r * Math.sin(angles[i]);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fillStyle = 'rgba(0,255,255,0.08)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,255,255,0.6)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Data points
            values.forEach(function(v, i) {
                var r = (v / 100) * maxR * p;
                var x = cx + r * Math.cos(angles[i]);
                var y = cy + r * Math.sin(angles[i]);
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ff00ff';
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Label
                var lx = cx + (maxR + 25) * Math.cos(angles[i]);
                var ly = cy + (maxR + 25) * Math.sin(angles[i]);
                ctx.fillStyle = '#c4f0ff';
                ctx.font = '11px "Share Tech Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(labels[i] + ' ' + v, lx, ly);
            });
        }

        function animateIn() {
            animProgress += 0.03;
            if (animProgress > 1) animProgress = 1;
            draw(Math.min(1, animProgress * animProgress)); // ease-in
            if (animProgress < 1) requestAnimationFrame(animateIn);
        }

        // Redraw on language change
        window.addEventListener('langchange', function() {
            labels[0] = I18N.t('radar-frontend');
            labels[1] = I18N.t('radar-backend');
            labels[2] = I18N.t('radar-devops');
            labels[3] = I18N.t('radar-design');
            labels[4] = I18N.t('radar-arch');
            labels[5] = I18N.t('radar-perf');
            draw(1);
        });

        draw(0); // Initial empty draw
    }

    // ============================================================
    // DAY/NIGHT THEME
    // ============================================================
    function initTheme() {
        function updateTheme() {
            var hour = new Date().getHours();
            var was = document.body.dataset.themeState || '';
            var next = hour >= 6 && hour < 18 ? 'day' : 'night';
            if (was !== next) {
                document.body.dataset.themeState = next;
                document.body.className = document.body.className.replace(/theme-day|theme-night|theme-transition/g, '');
                document.body.classList.add('theme-' + next);
                document.body.classList.add('theme-transition');
                setTimeout(function() {
                    document.body.classList.remove('theme-transition');
                }, 1500);
            }
        }
        updateTheme();
        setInterval(updateTheme, 60000);
    }

    // ============================================================
    // CONTACT FORM
    // ============================================================
    function initContactForm() {
        var form = document.getElementById('contact-form');
        var status = document.getElementById('form-status');
        if (!form || !status) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(form);
            status.textContent = '';
            status.className = 'form-status';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function(response) {
                if (response.ok) {
                    status.textContent = I18N.t('form-success');
                    status.className = 'form-status';
                    form.reset();
                } else {
                    throw new Error('fail');
                }
            }).catch(function() {
                status.textContent = I18N.t('form-error');
                status.className = 'form-status error';
            });
        });
    }

    // ============================================================
    // EASTER EGG DISMISS
    // ============================================================
    function initEasterDismiss() {
        var overlay = document.getElementById('easter-overlay');
        var dismissBtn = document.getElementById('easter-dismiss');
        if (!overlay || !dismissBtn) return;

        dismissBtn.addEventListener('click', function() {
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    }

    // ============================================================
    // GITHUB HEATMAP
    // ============================================================
    function initGithubHeatmap() {
        var container = document.getElementById('github-container');
        if (!container) return;

        // Try to fetch GitHub contribution SVG
        var img = new Image();
        img.onload = function() {
            container.innerHTML = '';
            var wrapper = document.createElement('div');
            wrapper.className = 'github-calendar';
            wrapper.appendChild(img);
            container.appendChild(wrapper);
        };
        img.onerror = function() {
            container.innerHTML = '<p class="github-loading" data-i18n="github-error">' + I18N.t('github-error') + '</p>';
        };
        img.src = 'https://ghchart.rshah.org/00ffff/Jiayoujw';
    }

    // ============================================================
    // MOBILE NAVIGATION
    // ============================================================
    function initMobileNav() {
        var hamburger = document.getElementById('hamburger');
        var overlay = document.getElementById('mobile-nav-overlay');
        var links = overlay ? overlay.querySelectorAll('.mobile-nav-link') : [];
        if (!hamburger || !overlay) return;

        function open() {
            hamburger.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', function() {
            if (overlay.classList.contains('active')) { close(); }
            else { open(); }
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                close();
            }
        });

        // Close on overlay click (outside links)
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    close();
                    var target = document.querySelector(href);
                    if (target) {
                        setTimeout(function() {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 350);
                    }
                }
            });
        });
    }

    // ============================================================
    // WINDOW MANAGER
    // ============================================================
    function initWindowManager() {
        if (!window.NexusWM) return;
        // Window manager initialized — floating windows available via terminal commands
    }

    // ============================================================
    // GLITCH TRIGGER (double-click)
    // ============================================================
    function initGlitchTrigger() {
        document.body.addEventListener('dblclick', function(e) {
            if (e.target.closest('input, textarea, a, button, .terminal-window, .os-window, .project-card[data-flip]')) return;
            if (window.NexusGlitch) window.NexusGlitch.trigger(500);
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
                NexusAudio.keyBlip();
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
        // Save achievement
        var unlocked = JSON.parse(localStorage.getItem('nexus-achievements') || '[]');
        if (unlocked.indexOf('konami') === -1) {
            unlocked.push('konami');
            localStorage.setItem('nexus-achievements', JSON.stringify(unlocked));
        }
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
