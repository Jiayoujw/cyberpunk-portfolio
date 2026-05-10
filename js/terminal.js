/* ============================================
   INTERACTIVE TERMINAL
   Playable command-line UI with custom commands
   ============================================ */

(function() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');

    if (!input || !output || !body) return;

    // Command history
    const history = [];
    let historyIdx = -1;

    // ----- Command registry -----
    const commands = {
        help: {
            desc: 'List all available commands',
            run: () => {
                const lines = [
                    '╔══════════════════════════════════════════════╗',
                    '║         AVAILABLE COMMANDS [v2.077]          ║',
                    '╚══════════════════════════════════════════════╝',
                    ''
                ];
                Object.keys(commands).forEach(name => {
                    lines.push(`  <span class="out-cmd">${name.padEnd(12)}</span> <span class="out-info">${commands[name].desc}</span>`);
                });
                lines.push('');
                lines.push('<span class="out-info">Tip: Use ↑/↓ to navigate history. Tab to autocomplete.</span>');
                return lines.join('\n');
            }
        },

        about: {
            desc: 'Display info about the operator',
            run: () => [
                '┌─ OPERATOR PROFILE ──────────────────────────┐',
                '│                                             │',
                '│  CODENAME  : NEXUS                          │',
                '│  ROLE      : Digital Architect              │',
                '│  LOCATION  : The Net                        │',
                '│  STATUS    : <span class="out-success">JACKED IN</span>                       │',
                '│  CLEARANCE : LEVEL ALPHA                    │',
                '│                                             │',
                '└─────────────────────────────────────────────┘',
                '',
                '> Building digital experiences at the',
                '> intersection of code, art, and chaos.',
                '> 在代码与艺术的交界处，创造无限可能。'
            ].join('\n')
        },

        skills: {
            desc: 'List combat-grade tech stack',
            run: () => [
                '<span class="out-info">[FRONTEND_ARSENAL]</span>',
                '  ▰▰▰▰▰▰▰▰▰▱  JavaScript / TypeScript     [95%]',
                '  ▰▰▰▰▰▰▰▰▰▱  React / Vue / Svelte         [92%]',
                '  ▰▰▰▰▰▰▰▰▰▱  CSS / Tailwind                [90%]',
                '  ▰▰▰▰▰▰▰▰▱▱  Three.js / WebGL              [85%]',
                '',
                '<span class="out-info">[BACKEND_ARSENAL]</span>',
                '  ▰▰▰▰▰▰▰▰▰▱  Node.js / Express             [93%]',
                '  ▰▰▰▰▰▰▰▰▰▱  Python / Django               [87%]',
                '  ▰▰▰▰▰▰▰▰▱▱  PostgreSQL / MongoDB          [89%]',
                '',
                '<span class="out-info">[DEVOPS_ARSENAL]</span>',
                '  ▰▰▰▰▰▰▰▰▱▱  Docker / Kubernetes           [86%]',
                '  ▰▰▰▰▰▰▰▰▰▱  AWS / Vercel                  [90%]'
            ].join('\n')
        },

        projects: {
            desc: 'Browse mission archive',
            run: () => [
                '<span class="out-info">▶ Loading project archive...</span>',
                '',
                '┌── PRJ_001 ─────────────────────────────────┐',
                '│ <span class="out-cmd">NEURAL_NET</span>    [STATUS: SHIPPED]            │',
                '│ AI viz platform with 3D rendering          │',
                '└────────────────────────────────────────────┘',
                '',
                '┌── PRJ_002 ─────────────────────────────────┐',
                '│ <span class="out-cmd">CYBER_DASH</span>    [STATUS: ACTIVE]             │',
                '│ Real-time data dashboard                   │',
                '└────────────────────────────────────────────┘',
                '',
                '┌── PRJ_003 ─────────────────────────────────┐',
                '│ <span class="out-cmd">CHAIN_VAULT</span>   [STATUS: OPERATIONAL]        │',
                '│ Decentralized storage protocol             │',
                '└────────────────────────────────────────────┘',
                '',
                '<span class="out-info">  ... and more above. Scroll up to see all 6 projects.</span>'
            ].join('\n')
        },

        contact: {
            desc: 'Establish secure connection',
            run: () => [
                '<span class="out-info">Establishing encrypted channel...</span>',
                '<span class="out-success">[OK] Quantum tunnel active</span>',
                '',
                '  📡 EMAIL    : <span class="out-link">hello@nexus.dev</span>',
                '  🔗 GITHUB   : <span class="out-link">@nexus_dev</span>',
                '  𝕏  TWITTER  : <span class="out-link">@nexus_dev</span>',
                '  💼 LINKEDIN : <span class="out-link">/in/nexus</span>',
                '',
                '<span class="out-info">Drop a signal — response time: ~24h</span>'
            ].join('\n')
        },

        whoami: {
            desc: 'Identify current session',
            run: () => 'nexus@cyberdeck — guest session [READ_ONLY]'
        },

        date: {
            desc: 'Display system datetime',
            run: () => {
                const now = new Date();
                return [
                    `<span class="out-info">SYS_TIME</span> : ${now.toLocaleString('en-US', { hour12: false })}`,
                    `<span class="out-info">UTC</span>      : ${now.toUTCString()}`,
                    `<span class="out-info">EPOCH</span>    : ${Math.floor(now.getTime() / 1000)}`,
                    `<span class="out-info">YEAR</span>     : 2077 (in spirit)`
                ].join('\n');
            }
        },

        matrix: {
            desc: 'Toggle reality',
            run: () => {
                const canvas = document.getElementById('matrix-rain');
                if (canvas) {
                    const cur = parseFloat(canvas.style.opacity || '0.15');
                    canvas.style.opacity = cur > 0.4 ? '0.15' : '0.5';
                    return `<span class="out-success">Reality distortion: ${cur > 0.4 ? 'NORMAL' : 'INTENSIFIED'}</span>`;
                }
                return '<span class="out-error">Matrix not available.</span>';
            }
        },

        hack: {
            desc: 'Initiate hack sequence',
            run: () => {
                animateHack();
                return '';
            }
        },

        joke: {
            desc: 'Tell a programming joke',
            run: () => {
                const jokes = [
                    'There are 10 types of people: those who understand binary and those who don\'t.',
                    'Why do programmers prefer dark mode? Because light attracts bugs.',
                    'How many programmers does it take to change a light bulb? None — it\'s a hardware issue.',
                    'I would tell you a UDP joke, but you might not get it.',
                    '!false — it\'s funny because it\'s true.',
                    '"99 little bugs in the code, 99 little bugs. Take one down, patch it around — 117 little bugs in the code."',
                    'A SQL query walks into a bar, walks up to two tables and asks: "Can I JOIN you?"'
                ];
                const j = jokes[Math.floor(Math.random() * jokes.length)];
                return `<span class="out-info">[JOKE.exe]</span> ${j}`;
            }
        },

        coffee: {
            desc: 'Brew coffee.exe',
            run: () => [
                '      ( (',
                '       ) )',
                '    ┌──────┐',
                '    │      │]',
                '    │      │',
                '    └──────┘',
                '',
                '<span class="out-success">☕ Coffee brewed successfully.</span>',
                '<span class="out-info">Caffeine level: MAXIMUM</span>'
            ].join('\n')
        },

        clear: {
            desc: 'Clear terminal output',
            run: () => {
                output.innerHTML = '';
                return null;
            }
        },

        cls: {
            desc: 'Alias for clear',
            run: () => {
                output.innerHTML = '';
                return null;
            }
        },

        exit: {
            desc: 'Terminate session',
            run: () => {
                setTimeout(() => {
                    addLine('<span class="out-error">Connection terminated.</span>');
                    addLine('<span class="out-info">Just kidding. You can\'t leave that easily.</span>');
                }, 800);
                return '<span class="out-info">Closing session...</span>';
            }
        },

        sudo: {
            desc: 'Try to elevate privileges',
            run: (args) => {
                if (args.includes('rm')) {
                    return '<span class="out-error">[SECURITY] Nice try, choomba. Permission denied.</span>';
                }
                return '<span class="out-error">[ERROR] User \'guest\' is not in the sudoers file. This incident will be reported.</span>';
            }
        },

        echo: {
            desc: 'Display a message',
            run: (args) => args.join(' ') || ''
        },

        theme: {
            desc: 'Cycle accent color',
            run: () => {
                const themes = [
                    { cyan: '#00ffff', magenta: '#ff00ff' },
                    { cyan: '#00ff41', magenta: '#fff700' },
                    { cyan: '#ff006e', magenta: '#b400ff' },
                    { cyan: '#ff6b00', magenta: '#00ffff' }
                ];
                const idx = parseInt(document.body.dataset.themeIdx || '0', 10);
                const next = (idx + 1) % themes.length;
                document.body.dataset.themeIdx = next;
                document.documentElement.style.setProperty('--color-cyan', themes[next].cyan);
                document.documentElement.style.setProperty('--color-magenta', themes[next].magenta);
                return `<span class="out-success">Theme switched to variant #${next + 1}</span>`;
            }
        },

        banner: {
            desc: 'Show ASCII banner',
            run: () => [
                '<span class="out-cmd">',
                ' ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗',
                ' ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝',
                ' ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗',
                ' ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║',
                ' ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║',
                ' ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
                '</span>',
                '<span class="out-info">       :: Code in the Neon Light ::</span>'
            ].join('\n')
        }
    };

    // ----- Render utilities -----
    function addLine(html) {
        const div = document.createElement('div');
        div.className = 'out-line';
        div.innerHTML = html;
        output.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function animateHack() {
        const steps = [
            'Bypassing firewall',
            'Cracking encryption',
            'Locating mainframe',
            'Injecting payload',
            'Extracting data',
            'Covering tracks'
        ];
        let i = 0;
        addLine('<span class="out-info">[INITIATING HACK SEQUENCE]</span>');

        function next() {
            if (i >= steps.length) {
                addLine('<span class="out-success">[OK] Hack complete. We\'re in.</span>');
                addLine('<span class="out-info">(disclaimer: this is purely cosmetic)</span>');
                return;
            }
            const step = steps[i++];
            addLine(`<span class="out-info">[${i}/${steps.length}]</span> ${step}<span class="cursor-blink">...</span>`);
            setTimeout(() => {
                const last = output.lastChild;
                last.innerHTML = `<span class="out-info">[${i}/${steps.length}]</span> ${step}... <span class="out-success">DONE</span>`;
                next();
            }, 400 + Math.random() * 400);
        }
        next();
    }

    // ----- Welcome message -----
    function showWelcome() {
        const lines = [
            '<span class="out-cmd">╔══════════════════════════════════════════════╗</span>',
            '<span class="out-cmd">║   NEXUS TERMINAL [v2.077.1] - encrypted      ║</span>',
            '<span class="out-cmd">║   © 2077 N3X.OS  -  All rights reserved      ║</span>',
            '<span class="out-cmd">╚══════════════════════════════════════════════╝</span>',
            '',
            '<span class="out-info">Connection established.</span>',
            '<span class="out-info">Type <span class="out-cmd">help</span> to see available commands.</span>',
            '<span class="out-info">Try: <span class="out-cmd">about</span>, <span class="out-cmd">projects</span>, <span class="out-cmd">hack</span>, <span class="out-cmd">joke</span>, <span class="out-cmd">theme</span></span>',
            ''
        ];
        lines.forEach(l => addLine(l));
    }

    // ----- Process command -----
    function processCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        // Echo command back to output
        addLine(`<span class="terminal-prompt">nexus@cyberdeck:~$</span> ${escapeHtml(trimmed)}`);

        const parts = trimmed.split(/\s+/);
        const name = parts[0].toLowerCase();
        const args = parts.slice(1);

        const cmd = commands[name];
        if (cmd) {
            const result = cmd.run(args);
            if (result) addLine(result);
        } else {
            addLine(`<span class="out-error">command not found: ${escapeHtml(name)}</span>`);
            addLine(`<span class="out-info">Type 'help' for available commands.</span>`);
        }
    }

    // ----- Input handling -----
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.value;
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
            const partial = input.value.trim().toLowerCase();
            if (partial) {
                const matches = Object.keys(commands).filter(c => c.startsWith(partial));
                if (matches.length === 1) {
                    input.value = matches[0];
                } else if (matches.length > 1) {
                    addLine(`<span class="out-info">${matches.join('  ')}</span>`);
                }
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            output.innerHTML = '';
        }
    });

    // Focus terminal when section comes into view or clicked
    body.addEventListener('click', () => input.focus());

    // Auto-focus when terminal section is in view
    const terminalSection = document.getElementById('terminal');
    if (terminalSection && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    setTimeout(() => input.focus(), 300);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(terminalSection);
    }

    // Boot up
    showWelcome();
})();
