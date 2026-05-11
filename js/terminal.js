/* ============================================
   INTERACTIVE TERMINAL
   Playable command-line UI with i18n support
   ============================================ */

(function() {
    var input = document.getElementById('terminal-input');
    var output = document.getElementById('terminal-output');
    var body = document.getElementById('terminal-body');
    if (!input || !output || !body) return;

    var history = [];
    var historyIdx = -1;

    // ===== Render utilities =====
    function addLine(html) {
        var div = document.createElement('div');
        div.className = 'out-line';
        div.innerHTML = html;
        output.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function(c) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
        });
    }

    // ===== Hack animation =====
    function animateHack() {
        var steps = [
            I18N.t('term-hack-1'), I18N.t('term-hack-2'), I18N.t('term-hack-3'),
            I18N.t('term-hack-4'), I18N.t('term-hack-5'), I18N.t('term-hack-6')
        ];
        var i = 0;
        addLine('<span class="out-info">' + I18N.t('term-hack-init') + '</span>');

        function next() {
            if (i >= steps.length) {
                addLine('<span class="out-success">' + I18N.t('term-hack-ok') + '</span>');
                addLine('<span class="out-info">' + I18N.t('term-hack-disclaimer') + '</span>');
                return;
            }
            var step = steps[i++];
            addLine('<span class="out-info">[' + i + '/' + steps.length + ']</span> ' + step + '<span class="cursor-blink">...</span>');
            setTimeout(function() {
                var last = output.lastChild;
                last.innerHTML = '<span class="out-info">[' + i + '/' + steps.length + ']</span> ' + step + '... <span class="out-success">' + I18N.t('term-hack-done') + '</span>';
                next();
            }, 400 + Math.random() * 400);
        }
        next();
    }

    // ===== Command registry =====
    function getCommands() {
        var t = I18N.t.bind(I18N);
        return {
            help: {
                desc: t('cmd-help-desc'),
                run: function() {
                    var cmds = getCommands();
                    var lines = [
                        '╔════════════════════════════════════════════════╗',
                        '║          ' + t('term-cmd-title') + '          ║',
                        '╚════════════════════════════════════════════════╝',
                        ''
                    ];
                    Object.keys(cmds).forEach(function(name) {
                        lines.push('  <span class="out-cmd">' + name.padEnd(12) + '</span> <span class="out-info">' + cmds[name].desc + '</span>');
                    });
                    lines.push('');
                    lines.push('<span class="out-info">' + t('term-cmd-tip') + '</span>');
                    return lines.join('\n');
                }
            },
            about: {
                desc: t('cmd-about-desc'),
                run: function() {
                    return [
                        '┌─ ' + t('term-about-profile') + ' ────────────────────────────────────────┐',
                        '│                                             │',
                        '│  ' + t('term-about-codename') + '  : NEXUS                          │',
                        '│  ' + t('term-about-role') + '      : Digital Architect              │',
                        '│  ' + t('term-about-loc') + '  : The Net                        │',
                        '│  ' + t('term-about-status') + '    : <span class="out-success">' + t('term-about-status-val') + '</span>                       │',
                        '│  ' + t('term-about-clearance') + ' : ' + t('term-about-clearance-val') + '                    │',
                        '│                                             │',
                        '└────────────────────────────────────────────────┘',
                        '',
                        t('term-about-line-1'),
                        t('term-about-line-2'),
                        t('term-about-line-3')
                    ].join('\n');
                }
            },
            skills: {
                desc: t('cmd-skills-desc'),
                run: function() {
                    return [
                        '<span class="out-info">' + t('term-skills-frontend') + '</span>',
                        '  ▰▰▰▰▰▰▰▰▰▱  JavaScript / TypeScript     [95%]',
                        '  ▰▰▰▰▰▰▰▰▰▱  React / Vue / Svelte         [92%]',
                        '  ▰▰▰▰▰▰▰▰▰▱  CSS / Tailwind                [90%]',
                        '  ▰▰▰▰▰▰▰▰▱▱  Three.js / WebGL              [85%]',
                        '',
                        '<span class="out-info">' + t('term-skills-backend') + '</span>',
                        '  ▰▰▰▰▰▰▰▰▰▱  Node.js / Express             [93%]',
                        '  ▰▰▰▰▰▰▰▰▰▱  Python / Django               [87%]',
                        '  ▰▰▰▰▰▰▰▰▰▱  PostgreSQL / MongoDB          [89%]',
                        '',
                        '<span class="out-info">' + t('term-skills-devops') + '</span>',
                        '  ▰▰▰▰▰▰▰▰▱▱  Docker / Kubernetes           [86%]',
                        '  ▰▰▰▰▰▰▰▰▰▱  AWS / Vercel                  [90%]'
                    ].join('\n');
                }
            },
            projects: {
                desc: t('cmd-projects-desc'),
                run: function() {
                    return [
                        '<span class="out-info">' + t('term-proj-loading') + '</span>',
                        '',
                        '┌── ' + t('term-proj-1-title') + ' ──────────────────────────────────────┐',
                        '│ <span class="out-cmd">' + t('term-proj-1-title') + '</span>    [' + t('term-proj-1-status') + ']            │',
                        '│ ' + t('term-proj-1-desc') + '          │',
                        '└────────────────────────────────────────────────┘',
                        '',
                        '┌── ' + t('term-proj-2-title') + ' ──────────────────────────────────────┐',
                        '│ <span class="out-cmd">' + t('term-proj-2-title') + '</span>    [' + t('term-proj-2-status') + ']             │',
                        '│ ' + t('term-proj-2-desc') + '             │',
                        '└────────────────────────────────────────────────┘',
                        '',
                        '┌── ' + t('term-proj-3-title') + ' ─────────────────────────────────────┐',
                        '│ <span class="out-cmd">' + t('term-proj-3-title') + '</span>   [' + t('term-proj-3-status') + ']        │',
                        '│ ' + t('term-proj-3-desc') + '             │',
                        '└────────────────────────────────────────────────┘',
                        '',
                        '<span class="out-info">' + t('term-proj-more') + '</span>'
                    ].join('\n');
                }
            },
            contact: {
                desc: t('cmd-contact-desc'),
                run: function() {
                    return [
                        '<span class="out-info">' + t('term-contact-init') + '</span>',
                        '<span class="out-success">' + t('term-contact-ok') + '</span>',
                        '',
                        '  📡 ' + t('term-contact-email') + '    : <span class="out-link">' + t('term-contact-email-val') + '</span>',
                        '  🔗 ' + t('term-contact-gh') + '   : <span class="out-link">' + t('term-contact-gh-val') + '</span>',
                        '  𝕏  ' + t('term-contact-tw') + '  : <span class="out-link">' + t('term-contact-tw-val') + '</span>',
                        '  💼 ' + t('term-contact-li') + ' : <span class="out-link">' + t('term-contact-li-val') + '</span>',
                        '',
                        '<span class="out-info">' + t('term-contact-hint') + '</span>'
                    ].join('\n');
                }
            },
            whoami: {
                desc: t('cmd-whoami-desc'),
                run: function() { return t('term-whoami-out'); }
            },
            date: {
                desc: t('cmd-date-desc'),
                run: function() {
                    var now = new Date();
                    return [
                        '<span class="out-info">' + t('term-date-sys') + '</span> : ' + now.toLocaleString('en-US', { hour12: false }),
                        '<span class="out-info">' + t('term-date-utc') + '</span>      : ' + now.toUTCString(),
                        '<span class="out-info">' + t('term-date-epoch') + '</span>    : ' + Math.floor(now.getTime() / 1000),
                        '<span class="out-info">' + t('term-date-year') + '</span>     : ' + t('term-date-year-val')
                    ].join('\n');
                }
            },
            matrix: {
                desc: t('cmd-matrix-desc'),
                run: function() {
                    var canvas = document.getElementById('matrix-rain');
                    if (canvas) {
                        var cur = parseFloat(canvas.style.opacity || '0.15');
                        canvas.style.opacity = cur > 0.4 ? '0.15' : '0.5';
                        return '<span class="out-success">' + (cur > 0.4 ? t('term-matrix-normal') : t('term-matrix-intense')) + '</span>';
                    }
                    return '<span class="out-error">' + t('term-matrix-err') + '</span>';
                }
            },
            hack: {
                desc: t('cmd-hack-desc'),
                run: function() { animateHack(); return ''; }
            },
            joke: {
                desc: t('cmd-joke-desc'),
                run: function() {
                    var jokes = [
                        t('term-joke-1'), t('term-joke-2'), t('term-joke-3'),
                        t('term-joke-4'), t('term-joke-5'), t('term-joke-6'),
                        t('term-joke-7')
                    ];
                    return '<span class="out-info">' + t('term-joke-label') + '</span> ' + jokes[Math.floor(Math.random() * jokes.length)];
                }
            },
            coffee: {
                desc: t('cmd-coffee-desc'),
                run: function() {
                    return [
                        '      ( (', '       ) )', '    ┌──────┐', '    │      │]',
                        '    │      │', '    └──────┘', '',
                        '<span class="out-success">' + t('term-coffee-brew') + '</span>',
                        '<span class="out-info">' + t('term-coffee-level') + '</span>'
                    ].join('\n');
                }
            },
            clear: {
                desc: t('cmd-clear-desc'),
                run: function() { output.innerHTML = ''; return null; }
            },
            cls: {
                desc: t('cmd-cls-desc'),
                run: function() { output.innerHTML = ''; return null; }
            },
            exit: {
                desc: t('cmd-exit-desc'),
                run: function() {
                    setTimeout(function() {
                        addLine('<span class="out-error">' + t('term-exit-done') + '</span>');
                        addLine('<span class="out-info">' + t('term-exit-jk') + '</span>');
                    }, 800);
                    return '<span class="out-info">' + t('term-exit-closing') + '</span>';
                }
            },
            sudo: {
                desc: t('cmd-sudo-desc'),
                run: function(args) {
                    if (args.includes('rm')) return '<span class="out-error">' + t('term-sudo-rm') + '</span>';
                    return '<span class="out-error">' + t('term-sudo-err') + '</span>';
                }
            },
            echo: {
                desc: t('cmd-echo-desc'),
                run: function(args) { return args.join(' ') || ''; }
            },
            theme: {
                desc: t('cmd-theme-desc'),
                run: function() {
                    var themes = [
                        { cyan: '#00ffff', magenta: '#ff00ff' },
                        { cyan: '#00ff41', magenta: '#fff700' },
                        { cyan: '#ff006e', magenta: '#b400ff' },
                        { cyan: '#ff6b00', magenta: '#00ffff' }
                    ];
                    var idx = parseInt(document.body.dataset.themeIdx || '0', 10);
                    var next = (idx + 1) % themes.length;
                    document.body.dataset.themeIdx = next;
                    document.documentElement.style.setProperty('--color-cyan', themes[next].cyan);
                    document.documentElement.style.setProperty('--color-magenta', themes[next].magenta);
                    return '<span class="out-success">' + t('term-theme-switch') + ' #' + (next + 1) + '</span>';
                }
            },
            snake: {
                desc: t('cmd-snake-desc'),
                run: function() { startSnakeGame(); return ''; }
            },
            banner: {
                desc: t('cmd-banner-desc'),
                run: function() {
                    return [
                        '<span class="out-cmd">',
                        ' ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗',
                        ' ████╗  ██║██╔═════╗╚██╗██╔╝██║   ██║██╔═════╗',
                        ' ██╔██╗ ██║███████╗   ╚███╔╝ ██║   ██║███████╗',
                        ' ██║╚██╗██║██╔════╝   ██╔██╗ ██║   ██║╚════██║',
                        ' ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║',
                        ' ╚═╝  ╚═══╚═╝╚═══════╝╚═╝  ╚═╝ ╚═════╝ ╚═══════╝',
                        '</span>',
                        '<span class="out-info">       ' + t('term-banner-tag') + '</span>'
                    ].join('\n');
                }
            }
        };
    }

    // ===== SNAKE GAME =====
    var snakeInterval = null;
    var snakeState = null;

    function startSnakeGame() {
        var t = I18N.t.bind(I18N);
        var W = 20, H = 12;
        var snake = [{x:5,y:Math.floor(H/2)}];
        var dir = {x:1,y:0};
        var nextDir = {x:1,y:0};
        var food = spawnFood(snake, W, H);
        var score = 0;
        var gameOver = false;

        function spawnFood(s, w, h) {
            var f;
            do { f = {x:Math.floor(Math.random()*w), y:Math.floor(Math.random()*h)}; }
            while (s.some(function(p){return p.x===f.x&&p.y===f.y;}));
            return f;
        }

        var container = document.createElement('div');
        container.style.cssText = 'font-family:monospace;line-height:1.2;color:var(--color-green);';
        var statusLine = document.createElement('div');
        container.appendChild(statusLine);
        var grid = document.createElement('pre');
        grid.style.cssText = 'margin:0;line-height:1.3;letter-spacing:0.2rem;';
        container.appendChild(grid);
        addLine('');
        output.appendChild(container);
        body.scrollTop = body.scrollHeight;

        // Instructions
        statusLine.innerHTML = '<span class="out-info">' + t('term-snake-ready') + '</span>';

        function render() {
            var board = [];
            for (var y = 0; y < H; y++) {
                var row = '';
                for (var x = 0; x < W; x++) {
                    var isSnake = snake.some(function(p){return p.x===x&&p.y===y;});
                    var isHead = snake[snake.length-1].x===x && snake[snake.length-1].y===y;
                    var isFood = food.x===x && food.y===y;
                    if (isHead) row += '◈';
                    else if (isSnake) row += '◆';
                    else if (isFood) row += '<span style="color:var(--color-magenta)">●</span>';
                    else row += '·';
                }
                board.push(row);
            }
            grid.innerHTML = board.join('\n');
            statusLine.innerHTML = '<span class="out-info">[SNAKE] Score: ' + score + '</span>';
        }

        function tick() {
            if (gameOver) return;
            dir = {x:nextDir.x, y:nextDir.y};
            var head = snake[snake.length-1];
            var newHead = {x:head.x+dir.x, y:head.y+dir.y};

            if (newHead.x < 0 || newHead.x >= W || newHead.y < 0 || newHead.y >= H ||
                snake.some(function(p){return p.x===newHead.x&&p.y===newHead.y;})) {
                gameOver = true;
                clearInterval(snakeInterval);
                statusLine.innerHTML = '<span class="out-error">' + t('term-snake-over') + score + '</span>';
                if (score === W*H - 1) {
                    statusLine.innerHTML = '<span class="out-success">' + t('term-snake-win') + score + '</span>';
                }
                return;
            }

            snake.push(newHead);
            if (newHead.x === food.x && newHead.y === food.y) {
                score++;
                NexusAudio.clickThud();
                food = spawnFood(snake, W, H);
            } else {
                snake.shift();
            }
            render();
            body.scrollTop = body.scrollHeight;
        }

        // Key handler for snake
        function snakeKeyHandler(e) {
            if (e.key === 'Enter' && !snakeInterval) {
                e.preventDefault();
                snakeInterval = setInterval(tick, 100);
                render();
                return;
            }
            if (e.key === 'Escape') {
                clearInterval(snakeInterval);
                gameOver = true;
                input.value = '';
                statusLine.innerHTML = '<span class="out-info">' + t('term-snake-escape') + '</span>';
                document.removeEventListener('keydown', snakeKeyHandler);
                input.focus();
                return;
            }
            var keyMap = {w:{x:0,y:-1},a:{x:-1,y:0},s:{x:0,y:1},d:{x:1,y:0},
                          ArrowUp:{x:0,y:-1},ArrowLeft:{x:-1,y:0},ArrowDown:{x:0,y:1},ArrowRight:{x:1,y:0}};
            var d = keyMap[e.key.toLowerCase()];
            if (d && !(d.x === -dir.x && d.y === -dir.y)) {
                e.preventDefault();
                nextDir = d;
                NexusAudio.keyBlip();
            }
        }

        document.addEventListener('keydown', snakeKeyHandler);
        render();

        // Cleanup happens when user presses Escape or game over
        // Input focus stays on game
        setTimeout(function() { input.blur(); }, 50);
    }

    // ===== Show welcome =====
    function showWelcome() {
        var t = I18N.t.bind(I18N);
        var lines = [
            '<span class="out-cmd">╔════════════════════════════════════════════════╗</span>',
            '<span class="out-cmd">║' + t('term-welcome-title') + '║</span>',
            '<span class="out-cmd">║' + t('term-welcome-copy') + '║</span>',
            '<span class="out-cmd">╚════════════════════════════════════════════════╝</span>',
            '',
            '<span class="out-info">' + t('term-welcome-ok') + '</span>',
            '<span class="out-info">' + t('term-welcome-help') + '</span>',
            '<span class="out-info">' + t('term-welcome-try') + '</span>',
            ''
        ];
        lines.forEach(function(l) { addLine(l); });
    }

    // ===== Process command =====
    function processCommand(raw) {
        var t = I18N.t.bind(I18N);
        var trimmed = raw.trim();
        if (!trimmed) return;

        addLine('<span class="terminal-prompt">' + t('term-prompt') + '</span> ' + escapeHtml(trimmed));

        var parts = trimmed.split(/\s+/);
        var name = parts[0].toLowerCase();
        var args = parts.slice(1);

        var cmds = getCommands();
        var cmd = cmds[name];
        if (cmd) {
            var result = cmd.run(args);
            if (result) addLine(result);
        } else {
            addLine('<span class="out-error">' + t('term-unknown') + ' ' + escapeHtml(name) + '</span>');
            addLine('<span class="out-info">' + t('term-unknown-help') + '</span>');
        }
    }

    // ===== Input handling =====
    input.addEventListener('keydown', function(e) {
        NexusAudio.keyBlip();
        if (e.key === 'Enter') {
            e.preventDefault();
            var value = input.value;
            if (value.trim()) {
                history.unshift(value);
                if (history.length > 50) history.pop();
            }
            historyIdx = -1;
            processCommand(value);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIdx < history.length - 1) {
                historyIdx++;
                input.value = history[historyIdx];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                historyIdx--;
                input.value = history[historyIdx];
            } else {
                historyIdx = -1;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            var partial = input.value.trim().toLowerCase();
            if (partial) {
                var cmds = getCommands();
                var matches = Object.keys(cmds).filter(function(c) { return c.startsWith(partial); });
                if (matches.length === 1) {
                    input.value = matches[0];
                } else if (matches.length > 1) {
                    addLine('<span class="out-info">' + matches.join('  ') + '</span>');
                }
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            output.innerHTML = '';
        }
    });

    body.addEventListener('click', function() { input.focus(); });

    // Auto-focus when terminal section is in view
    var terminalSection = document.getElementById('terminal');
    if (terminalSection && 'IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    setTimeout(function() { input.focus(); }, 300);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(terminalSection);
    }

    // ===== Language change handler =====
    window.addEventListener('langchange', function() {
        var promptEl = document.querySelector('.terminal-prompt');
        var hintCmdEl = document.querySelector('.hint-cmd');
        if (promptEl) promptEl.textContent = I18N.t('term-prompt');
        if (hintCmdEl) hintCmdEl.textContent = I18N.t('term-hint-cmd');
    });

    // Boot up
    showWelcome();
})();
