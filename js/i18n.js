/* ============================================
   I18N — Internationalization System
   All user-facing strings in EN + ZH
   ============================================ */

const I18N = {
    // Current language
    lang: localStorage.getItem('nexus-lang') || 'zh',

    // ========== TRANSLATIONS ==========
    dict: {
        en: {
            // --- HTML: Head ---
            'title': 'NEXUS // CYBER PORTFOLIO',
            'meta-desc': 'Cyberpunk Portfolio — Code in the Neon Light',

            // --- Boot ---
            'boot-status': 'INITIALIZING...',
            'boot-ready': 'SYSTEM READY',
            'boot-1':  '> [BIOS] Initializing N3X.OS v2.077.1...',
            'boot-2':  '> [BIOS] Memory check: 16384MB OK',
            'boot-3':  '> [BIOS] Neural interface: DETECTED',
            'boot-4':  '> [SYS]  Loading kernel modules...',
            'boot-5':  '> [SYS]  Mounting /dev/cyberdeck...',
            'boot-6':  '> [NET]  Establishing encrypted tunnel...',
            'boot-7':  '> [NET]  Connection: SECURE',
            'boot-8':  '> [SYS]  Loading user profile: nexus',
            'boot-9':  '> [GFX]  Initializing holographic display...',
            'boot-10': '> [GFX]  Particle system: ONLINE',
            'boot-11': '> [SYS]  All systems nominal.',
            'boot-12': '> [SYS]  Welcome back, choomba.',

            // --- HUD ---
            'hud-status': 'ONLINE',
            'hud-coords': 'N 35.6° / E 139.7°',
            'nav-home': 'HOME',
            'nav-about': 'ABOUT',
            'nav-projects': 'PROJECTS',
            'nav-skills': 'SKILLS',
            'nav-terminal': 'TERMINAL',
            'nav-contact': 'CONTACT',

            // --- Hero ---
            'hero-tag': '[ SYS_USER://NEXUS ]',
            'hero-title-1': 'DIGITAL',
            'hero-title-2': 'ARCHITECT',
            'meta-label-1': 'CODE_LEVEL:',
            'meta-label-2': 'NEURAL_LINK:',
            'meta-label-3': 'ENCRYPTION:',
            'meta-value-2': 'ACTIVE',
            'meta-value-3': 'ENABLED',
            'btn-projects': 'VIEW_PROJECTS >>',
            'btn-terminal': 'RUN_TERMINAL [-]',
            'scroll-down': 'SCROLL_DOWN',

            // --- Typewriter ---
            'type-1': 'Building digital experiences with neon and code',
            'type-2': 'Crafting interfaces that pulse with electric life',
            'type-3': 'Pixels by day. Particles by night.',
            'type-4': 'Where art meets the machine — that\'s home.',
            'type-5': 'In the neon-lit bridge between code and dreams.',

            // --- About ---
            'section-num-1': '01',
            'about-title': '// ABOUT_ME',
            'about-who': 'WHO_AM_I',
            'about-text-1': 'Full-stack developer operating in the neon-lit shadows of the digital realm. Crafting interactive experiences where code meets art. Specialized in building high-performance web applications with cutting-edge technologies.',
            'about-text-2': '一个游走在代码与艺术之间的开发者。擅长打造具有视觉冲击力的网络体验，沉迷于像素与霓虹的交响。',
            'stat-label-1': 'PROJECTS_DONE',
            'stat-label-2': 'COMMITS_PUSHED',
            'stat-label-3': 'CLIENTS_HACKED',
            'stat-label-4': 'DAYS_CODING',

            // --- Projects ---
            'section-num-2': '02',
            'projects-title': '// PROJECTS',
            'prj-1-title': 'NEURAL_NET',
            'prj-1-desc': 'AI-powered neural network visualization platform with real-time training metrics and 3D model architecture rendering.',
            'prj-2-title': 'CYBER_DASH',
            'prj-2-desc': 'Real-time data dashboard with WebSocket streaming, particle effects, and holographic UI components inspired by sci-fi interfaces.',
            'prj-3-title': 'CHAIN_VAULT',
            'prj-3-desc': 'Decentralized storage protocol with end-to-end encryption, zero-knowledge proofs, and a stunning glassmorphism interface.',
            'prj-4-title': 'PIXEL_FORGE',
            'prj-4-desc': 'Generative art studio that creates unique digital artworks using procedural algorithms, fluid simulations, and shader magic.',
            'prj-5-title': 'GHOST_PROTOCOL',
            'prj-5-desc': 'Privacy-first messaging app with quantum-resistant encryption, self-destructing messages, and a brutalist cyberpunk UI.',
            'prj-6-title': 'AI_ORACLE',
            'prj-6-desc': 'Conversational AI interface with voice synthesis, real-time emotion analysis, and a holographic 3D avatar that responds to user input.',
            'prj-link': 'ACCESS_NODE >>',

            // --- Blog ---
            'nav-blog': 'BLOG',
            'blog-title': '// ARCHIVE',
            'blog-item-1-date': '2026.04',
            'blog-item-1-title': 'Building a Real-time Neural Visualization',
            'blog-item-1-desc': 'How we built a 3D neural network visualizer with Three.js and WebSocket streaming.',
            'blog-item-2-date': '2026.03',
            'blog-item-2-title': 'The Art of Cyberpunk UI Design',
            'blog-item-2-desc': 'Lessons learned from designing neon-drenched interfaces that feel alive.',
            'blog-item-3-date': '2026.02',
            'blog-item-3-title': 'Zero-Knowledge Proofs for Frontend Devs',
            'blog-item-3-desc': 'A practical guide to understanding and implementing ZK proofs in web apps.',
            'blog-item-4-date': '2026.01',
            'blog-item-4-title': 'Rust + WebAssembly: The Future of Web Perf',
            'blog-item-4-desc': 'Porting computation-heavy modules to WASM for 10x performance gains.',
            'blog-item-5-date': '2025.12',
            'blog-item-5-title': 'Generative Art with WebGL Shaders',
            'blog-item-5-desc': 'Creating real-time fluid simulations and fractal patterns on the GPU.',
            'blog-readmore': 'READ_MORE >>',
            'blog-section-label': 'BLOG',

            // --- Skills ---
            'section-num-3': '03',
            'skills-title': '// SKILL_MATRIX',
            'skill-cat-1': '[FRONTEND]',
            'skill-cat-2': '[BACKEND]',
            'skill-cat-3': '[DEVOPS]',

            // --- Terminal ---
            'section-num-4': '04',
            'terminal-title': '// TERMINAL_ACCESS',
            'term-header': 'nexus@cyberdeck:~ — bash — 80x24',
            'term-status': '[ENCRYPTED]',
            'term-prompt': 'nexus@cyberdeck:~$',
            'term-hint': 'TIP: Type',
            'term-hint-cmd': 'help',

            // --- Contact ---
            'section-num-5': '05',
            'contact-title': '// ESTABLISH_CONNECTION',
            'contact-line-1': '> Ready to jack in?',
            'contact-line-2': '> Drop a signal through any of these channels:',
            'contact-label-1': 'EMAIL',
            'contact-label-2': 'GITHUB',
            'contact-label-3': 'TWITTER',
            'contact-label-4': 'LINKEDIN',

            // --- Footer ---
            'footer-center': '© 2077 NEXUS // ALL_RIGHTS_RESERVED',
            'footer-status': 'SYSTEM_OPERATIONAL',

            // --- Audio & Visitor ---
            'audio-toggle-title': 'Toggle Sound',
            'visitor-label': 'VISITOR',

            // --- Konami ---
            'konami-title': 'KONAMI MODE ACTIVATED',
            'konami-sub': '+30 STYLE POINTS',

            // --- Console ---
            'console-1': 'NEXUS // DIGITAL ARCHITECT',
            'console-2': 'Code in the Neon Light',
            'console-3': 'Try the Konami code, or scroll to the terminal section :)',

            // ===== TERMINAL COMMANDS =====
            'cmd-help-desc': 'List all available commands',
            'cmd-about-desc': 'Display info about the operator',
            'cmd-skills-desc': 'List combat-grade tech stack',
            'cmd-projects-desc': 'Browse mission archive',
            'cmd-contact-desc': 'Establish secure connection',
            'cmd-whoami-desc': 'Identify current session',
            'cmd-date-desc': 'Display system datetime',
            'cmd-matrix-desc': 'Toggle reality',
            'cmd-hack-desc': 'Initiate hack sequence',
            'cmd-joke-desc': 'Tell a programming joke',
            'cmd-coffee-desc': 'Brew coffee.exe',
            'cmd-clear-desc': 'Clear terminal output',
            'cmd-cls-desc': 'Alias for clear',
            'cmd-exit-desc': 'Terminate session',
            'cmd-sudo-desc': 'Try to elevate privileges',
            'cmd-echo-desc': 'Display a message',
            'cmd-theme-desc': 'Cycle accent color',
            'cmd-banner-desc': 'Show ASCII banner',
            'cmd-snake-desc': 'Play Snake game',
            'cmd-weather-desc': 'Fetch weather data',
            'cmd-jackin-desc': '???',
            'cmd-2077-desc': '???',

            'term-snake-ready': '[SNAKE] Press ENTER to start. WASD to move.',
            'term-snake-over': '[SNAKE] GAME OVER! Score: ',
            'term-snake-escape': '[SNAKE] Game escaped. Type snake to play again.',
            'term-snake-win': '[SNAKE] WINNER! Perfect score: ',

            // --- Modal ---
            'modal-close': 'CLOSE',
            'modal-tech': 'TECH_STACK',
            // --- Contact Form ---
            'form-name': 'NAME',
            'form-email': 'EMAIL',
            'form-message': 'MESSAGE',
            'form-send': 'TRANSMIT_SIGNAL >>',
            'form-success': '[OK] Signal transmitted. Response within 24h.',
            'form-error': '[ERR] Transmission failed. Try direct email.',
            'form-name-placeholder': 'Enter your handle...',
            'form-email-placeholder': 'Your@email.address',
            'form-message-placeholder': 'Type your message...',
            // --- Weather ---
            'weather-fetching': 'Fetching atmospheric data...',
            'weather-city': 'CITY',
            'weather-temp': 'TEMP',
            'weather-wind': 'WIND',
            'weather-humidity': 'HUMID',
            'weather-condition': 'SKY',
            'weather-error': 'Weather data unavailable. Check your connection.',
            'weather-ms': 'm/s',
            'weather-percent': '%',
            'weather-default-city': 'Tokyo',
            // --- Easter Egg ---
            'easter-triggered': 'ACCESS GRANTED',
            'easter-subtitle': 'LEVEL ALPHA CLEARANCE UNLOCKED',
            'easter-achievement': 'ACHIEVEMENT UNLOCKED',
            'easter-hint': 'Hidden protocols discovered. Try other codewords...',
            // --- Back to top ---
            'back-to-top': 'Back to top',
            // --- Radar ---
            'radar-title': '[CAPABILITY_MATRIX]',
            'radar-frontend': 'Frontend',
            'radar-backend': 'Backend',
            'radar-devops': 'DevOps',
            'radar-design': 'Design',
            'radar-arch': 'Architecture',
            'radar-perf': 'Performance',
            // --- GitHub ---
            'github-title': '// ACTIVITY_LOG',
            'github-loading': 'Loading contribution data...',
            'github-error': 'Unable to load activity data.',
            // --- Theme ---
            'theme-day': 'Day mode activated',
            'theme-night': 'Night mode activated',
            'theme-auto': 'Auto theme mode',

            'term-welcome-title': '   NEXUS TERMINAL [v2.077.1] — encrypted',
            'term-welcome-copy': '   © 2077 N3X.OS — All rights reserved',
            'term-welcome-ok': 'Connection established.',
            'term-welcome-help': 'Type help to see available commands.',
            'term-welcome-try': 'Try: about, projects, hack, joke, theme',

            'term-cmd-title': 'AVAILABLE COMMANDS [v2.077]',
            'term-cmd-tip': 'Tip: Use ↑/↓ to navigate history. Tab to autocomplete.',

            'term-about-profile': 'OPERATOR PROFILE',
            'term-about-codename': 'CODENAME',
            'term-about-role': 'ROLE',
            'term-about-loc': 'LOCATION',
            'term-about-status': 'STATUS',
            'term-about-status-val': 'JACKED IN',
            'term-about-clearance': 'CLEARANCE',
            'term-about-clearance-val': 'LEVEL ALPHA',
            'term-about-line-1': '> Building digital experiences at the',
            'term-about-line-2': '> intersection of code, art, and chaos.',
            'term-about-line-3': '> 在代码与艺术的交界处，创造无限可能。',

            'term-skills-frontend': '[FRONTEND_ARSENAL]',
            'term-skills-backend': '[BACKEND_ARSENAL]',
            'term-skills-devops': '[DEVOPS_ARSENAL]',

            'term-proj-loading': '▶ Loading project archive...',
            'term-proj-1-title': 'NEURAL_NET',
            'term-proj-1-status': 'STATUS: SHIPPED',
            'term-proj-1-desc': 'AI viz platform with 3D rendering',
            'term-proj-2-title': 'CYBER_DASH',
            'term-proj-2-status': 'STATUS: ACTIVE',
            'term-proj-2-desc': 'Real-time data dashboard',
            'term-proj-3-title': 'CHAIN_VAULT',
            'term-proj-3-status': 'STATUS: OPERATIONAL',
            'term-proj-3-desc': 'Decentralized storage protocol',
            'term-proj-more': '  ... and more above. Scroll up to see all 6 projects.',

            'term-contact-init': 'Establishing encrypted channel...',
            'term-contact-ok': '[OK] Quantum tunnel active',
            'term-contact-email': 'EMAIL',
            'term-contact-email-val': 'hello@nexus.dev',
            'term-contact-gh': 'GITHUB',
            'term-contact-gh-val': '@nexus_dev',
            'term-contact-tw': 'TWITTER',
            'term-contact-tw-val': '@nexus_dev',
            'term-contact-li': 'LINKEDIN',
            'term-contact-li-val': '/in/nexus',
            'term-contact-hint': 'Drop a signal — response time: ~24h',

            'term-whoami-out': 'nexus@cyberdeck — guest session [READ_ONLY]',

            'term-date-sys': 'SYS_TIME',
            'term-date-utc': 'UTC',
            'term-date-epoch': 'EPOCH',
            'term-date-year': 'YEAR',
            'term-date-year-val': '2077 (in spirit)',

            'term-matrix-normal': 'Reality distortion: NORMAL',
            'term-matrix-intense': 'Reality distortion: INTENSIFIED',
            'term-matrix-err': 'Matrix not available.',

            'term-hack-init': '[INITIATING HACK SEQUENCE]',
            'term-hack-1': 'Bypassing firewall',
            'term-hack-2': 'Cracking encryption',
            'term-hack-3': 'Locating mainframe',
            'term-hack-4': 'Injecting payload',
            'term-hack-5': 'Extracting data',
            'term-hack-6': 'Covering tracks',
            'term-hack-done': 'DONE',
            'term-hack-ok': '[OK] Hack complete. We\'re in.',
            'term-hack-disclaimer': '(disclaimer: this is purely cosmetic)',

            'term-joke-1': 'There are 10 types of people: those who understand binary and those who don\'t.',
            'term-joke-2': 'Why do programmers prefer dark mode? Because light attracts bugs.',
            'term-joke-3': 'How many programmers does it take to change a light bulb? None — it\'s a hardware issue.',
            'term-joke-4': 'I would tell you a UDP joke, but you might not get it.',
            'term-joke-5': '!false — it\'s funny because it\'s true.',
            'term-joke-6': '"99 little bugs in the code, 99 little bugs. Take one down, patch it around — 117 little bugs in the code."',
            'term-joke-7': 'A SQL query walks into a bar, walks up to two tables and asks: "Can I JOIN you?"',
            'term-joke-label': '[JOKE.exe]',

            'term-coffee-brew': '☕ Coffee brewed successfully.',
            'term-coffee-level': 'Caffeine level: MAXIMUM',

            'term-exit-closing': 'Closing session...',
            'term-exit-done': 'Connection terminated.',
            'term-exit-jk': 'Just kidding. You can\'t leave that easily.',

            'term-sudo-rm': '[SECURITY] Nice try, choomba. Permission denied.',
            'term-sudo-err': '[ERROR] User \'guest\' is not in the sudoers file. This incident will be reported.',

            'term-theme-switch': 'Theme switched to variant',

            'term-banner-tag': ':: Code in the Neon Light ::',

            'term-unknown': 'command not found:',
            'term-unknown-help': 'Type \'help\' for available commands.',
        },

        zh: {
            // --- HTML: Head ---
            'title': 'NEXUS // 赛博作品集',
            'meta-desc': '赛博朋克作品集 — 霓虹光影中的代码',

            // --- Boot ---
            'boot-status': '初始化中...',
            'boot-ready': '系统就绪',
            'boot-1':  '> [BIOS] 初始化 N3X.OS v2.077.1...',
            'boot-2':  '> [BIOS] 内存检查: 16384MB 正常',
            'boot-3':  '> [BIOS] 神经接口: 已检测',
            'boot-4':  '> [SYS]  加载内核模块...',
            'boot-5':  '> [SYS]  挂载 /dev/cyberdeck...',
            'boot-6':  '> [NET]  建立加密隧道...',
            'boot-7':  '> [NET]  连接: 安全',
            'boot-8':  '> [SYS]  加载用户档案: nexus',
            'boot-9':  '> [GFX]  初始化全息显示...',
            'boot-10': '> [GFX]  粒子系统: 在线',
            'boot-11': '> [SYS]  所有系统正常。',
            'boot-12': '> [SYS]  欢迎回来，choomba。',

            // --- HUD ---
            'hud-status': '在线',
            'hud-coords': '北纬 35.6° / 东经 139.7°',
            'nav-home': '首页',
            'nav-about': '关于',
            'nav-projects': '项目',
            'nav-skills': '技能',
            'nav-terminal': '终端',
            'nav-contact': '联系',

            // --- Hero ---
            'hero-tag': '[ SYS_USER://NEXUS ]',
            'hero-title-1': '数字',
            'hero-title-2': '建筑师',
            'meta-label-1': '代码等级:',
            'meta-label-2': '神经链接:',
            'meta-label-3': '加密状态:',
            'meta-value-1-en-only': '99.9%',
            'meta-value-2': '已激活',
            'meta-value-3': '已启用',
            'btn-projects': '查看项目 >>',
            'btn-terminal': '启动终端 [-]',
            'scroll-down': '向下滚动',

            // --- Typewriter ---
            'type-1': '在霓虹与代码之间，构建数字奇迹。',
            'type-2': '打造充满电流感的交互界面。',
            'type-3': '白天写像素，夜里写粒子。',
            'type-4': '艺术与机器相遇的地方——那就是家。',
            'type-5': 'Building digital experiences with neon and code',

            // --- About ---
            'section-num-1': '01',
            'about-title': '// 关于我',
            'about-who': '我是谁',
            'about-text-1': '一个游走在代码与艺术之间的开发者。擅长打造具有视觉冲击力的网络体验，沉迷于像素与霓虹的交响。专注于使用前沿技术构建高性能的 Web 应用，在数字世界的霓虹阴影中穿梭。',
            'about-text-2': 'Full-stack developer operating in the neon-lit shadows of the digital realm. Crafting interactive experiences where code meets art. Specialized in building high-performance web applications with cutting-edge technologies.',
            'stat-label-1': '已完成项目',
            'stat-label-2': '代码提交',
            'stat-label-3': '攻破客户端',
            'stat-label-4': '持续编码天数',

            // --- Projects ---
            'section-num-2': '02',
            'projects-title': '// 项目展示',
            'prj-1-title': '神经网络',
            'prj-1-desc': 'AI驱动的神经网络可视化平台，支持实时训练指标监控和3D模型架构渲染。',
            'prj-2-title': '赛博仪表盘',
            'prj-2-desc': '实时数据仪表盘，集成WebSocket流式传输、粒子特效和全息UI组件，灵感来自科幻界面。',
            'prj-3-title': '链上保险库',
            'prj-3-desc': '去中心化存储协议，端到端加密、零知识证明，配以炫目的毛玻璃风格界面。',
            'prj-4-title': '像素锻造',
            'prj-4-desc': '生成艺术工作室，利用程序化算法、流体模拟和着色器魔法创造独特的数字艺术作品。',
            'prj-5-title': '幽灵协议',
            'prj-5-desc': '隐私优先的通讯应用，量子抗性加密、自毁消息，搭配粗野主义赛博朋克UI。',
            'prj-6-title': 'AI神谕',
            'prj-6-desc': '对话式AI界面，集成语音合成、实时情绪分析，全息3D形象根据用户输入做出反应。',
            'prj-link': '访问节点 >>',

            // --- Blog ---
            'nav-blog': '博客',
            'blog-title': '// 技术动态',
            'blog-item-1-date': '2026.04',
            'blog-item-1-title': '构建实时神经网络可视化',
            'blog-item-1-desc': '如何使用 Three.js 和 WebSocket 流式传输构建 3D 神经网络可视化平台。',
            'blog-item-2-date': '2026.03',
            'blog-item-2-title': '赛博朋克 UI 设计之道',
            'blog-item-2-desc': '设计充满霓虹光影、富有生命力的界面——经验与教训。',
            'blog-item-3-date': '2026.02',
            'blog-item-3-title': '前端开发者的零知识证明入门',
            'blog-item-3-desc': '理解零知识证明并在 Web 应用中实践——一份实用指南。',
            'blog-item-4-date': '2026.01',
            'blog-item-4-title': 'Rust + WebAssembly: Web 性能的未来',
            'blog-item-4-desc': '将计算密集型模块移植到 WASM，获得 10 倍性能提升。',
            'blog-item-5-date': '2025.12',
            'blog-item-5-title': 'WebGL 着色器生成艺术',
            'blog-item-5-desc': '在 GPU 上创建实时流体模拟和分形图案。',
            'blog-readmore': '阅读更多 >>',
            'blog-section-label': '博客',

            // --- Skills ---
            'section-num-3': '03',
            'skills-title': '// 技能矩阵',
            'skill-cat-1': '[前端]',
            'skill-cat-2': '[后端]',
            'skill-cat-3': '[运维]',

            // --- Terminal ---
            'section-num-4': '04',
            'terminal-title': '// 终端访问',
            'term-header': 'nexus@cyberdeck:~ — bash — 80x24',
            'term-status': '[已加密]',
            'term-prompt': 'nexus@cyberdeck:~$',
            'term-hint': '提示: 输入',
            'term-hint-cmd': 'help',

            // --- Contact ---
            'section-num-5': '05',
            'contact-title': '// 建立连接',
            'contact-line-1': '> 准备好了吗？',
            'contact-line-2': '> 通过以下任意渠道发出信号：',
            'contact-label-1': '邮箱',
            'contact-label-2': 'GitHub',
            'contact-label-3': 'Twitter',
            'contact-label-4': '领英',

            // --- Footer ---
            'footer-center': '© 2077 NEXUS // 版权所有',
            'footer-status': '系统运行中',

            // --- Audio & Visitor ---
            'audio-toggle-title': '切换音效',
            'visitor-label': '访客',

            // --- Konami ---
            'konami-title': '科乐美模式已激活',
            'konami-sub': '+30 酷炫点数',

            // --- Console ---
            'console-1': 'NEXUS // 数字建筑师',
            'console-2': '霓虹光影中的代码',
            'console-3': '试试科乐美秘技，或者滚动到终端区 :)',

            // ===== TERMINAL COMMANDS =====
            'cmd-help-desc': '列出所有可用命令',
            'cmd-about-desc': '显示操作者信息',
            'cmd-skills-desc': '列出战斗级技术栈',
            'cmd-projects-desc': '浏览任务档案',
            'cmd-contact-desc': '建立安全连接',
            'cmd-whoami-desc': '识别当前会话',
            'cmd-date-desc': '显示系统时间',
            'cmd-matrix-desc': '切换现实密度',
            'cmd-hack-desc': '启动入侵序列',
            'cmd-joke-desc': '讲个程序员笑话',
            'cmd-coffee-desc': '冲泡咖啡.exe',
            'cmd-clear-desc': '清空终端',
            'cmd-cls-desc': '清空别名',
            'cmd-exit-desc': '终止会话',
            'cmd-sudo-desc': '尝试提权',
            'cmd-echo-desc': '回显消息',
            'cmd-theme-desc': '切换主题配色',
            'cmd-banner-desc': '显示ASCII横幅',
            'cmd-snake-desc': '玩贪吃蛇游戏',
            'cmd-weather-desc': '获取天气数据',
            'cmd-jackin-desc': '???',
            'cmd-2077-desc': '???',

            'term-snake-ready': '[贪吃蛇] 按 ENTER 开始，WASD 移动。',
            'term-snake-over': '[贪吃蛇] 游戏结束！得分: ',
            'term-snake-escape': '[贪吃蛇] 已退出。输入 snake 再来一局。',
            'term-snake-win': '[贪吃蛇] 恭喜！满分: ',

            // --- Modal ---
            'modal-close': '关闭',
            'modal-tech': '技术栈',
            // --- Contact Form ---
            'form-name': '名称',
            'form-email': '邮箱',
            'form-message': '留言',
            'form-send': '发送信号 >>',
            'form-success': '[OK] 信号已发送，24小时内回复。',
            'form-error': '[ERR] 发送失败，请尝试直接发邮件。',
            'form-name-placeholder': '输入你的代号...',
            'form-email-placeholder': '你的@邮箱.地址',
            'form-message-placeholder': '在此输入留言...',
            // --- Weather ---
            'weather-fetching': '获取大气数据中...',
            'weather-city': '城市',
            'weather-temp': '温度',
            'weather-wind': '风速',
            'weather-humidity': '湿度',
            'weather-condition': '天气',
            'weather-error': '天气数据不可用，请检查网络连接。',
            'weather-ms': '米/秒',
            'weather-percent': '%',
            'weather-default-city': '东京',
            // --- Easter Egg ---
            'easter-triggered': '访问已授权',
            'easter-subtitle': '阿尔法级权限已解锁',
            'easter-achievement': '成就已解锁',
            'easter-hint': '隐藏协议已发现。试试其他暗号...',
            // --- Back to top ---
            'back-to-top': '回到顶部',
            // --- Radar ---
            'radar-title': '[能力矩阵]',
            'radar-frontend': '前端',
            'radar-backend': '后端',
            'radar-devops': '运维',
            'radar-design': '设计',
            'radar-arch': '架构',
            'radar-perf': '性能',
            // --- GitHub ---
            'github-title': '// 活动日志',
            'github-loading': '加载贡献数据...',
            'github-error': '无法加载活动数据。',
            // --- Theme ---
            'theme-day': '日间模式已激活',
            'theme-night': '夜间模式已激活',
            'theme-auto': '自动主题模式',

            'term-welcome-title': '   NEXUS 终端 [v2.077.1] — 已加密',
            'term-welcome-copy': '   © 2077 N3X.OS — 版权所有',
            'term-welcome-ok': '连接已建立。',
            'term-welcome-help': '输入 help 查看可用命令。',
            'term-welcome-try': '试试: about、projects、hack、joke、theme',

            'term-cmd-title': '可用命令 [v2.077]',
            'term-cmd-tip': '提示: 使用 ↑/↓ 浏览历史，Tab 自动补全。',

            'term-about-profile': '操作者档案',
            'term-about-codename': '代号',
            'term-about-role': '角色',
            'term-about-loc': '位置',
            'term-about-status': '状态',
            'term-about-status-val': '已接入',
            'term-about-clearance': '权限等级',
            'term-about-clearance-val': '阿尔法级',
            'term-about-line-1': '> 在代码、艺术与混沌的交界处，',
            'term-about-line-2': '> 构建数字体验。',
            'term-about-line-3': '> Building digital experiences at the intersection of code, art, and chaos.',

            'term-skills-frontend': '[前端武器库]',
            'term-skills-backend': '[后端武器库]',
            'term-skills-devops': '[运维武器库]',

            'term-proj-loading': '▶ 加载项目档案...',
            'term-proj-1-title': '神经网络',
            'term-proj-1-status': '状态: 已交付',
            'term-proj-1-desc': 'AI可视化平台，3D渲染',
            'term-proj-2-title': '赛博仪表盘',
            'term-proj-2-status': '状态: 活跃中',
            'term-proj-2-desc': '实时数据仪表盘',
            'term-proj-3-title': '链上保险库',
            'term-proj-3-status': '状态: 运行中',
            'term-proj-3-desc': '去中心化存储协议',
            'term-proj-more': '  ... 还有更多。向上滚动查看全部 6 个项目。',

            'term-contact-init': '建立加密通道...',
            'term-contact-ok': '[OK] 量子隧道已激活',
            'term-contact-email': '邮箱',
            'term-contact-email-val': 'hello@nexus.dev',
            'term-contact-gh': 'GitHub',
            'term-contact-gh-val': '@nexus_dev',
            'term-contact-tw': 'Twitter',
            'term-contact-tw-val': '@nexus_dev',
            'term-contact-li': '领英',
            'term-contact-li-val': '/in/nexus',
            'term-contact-hint': '发出信号——回复时间: ~24小时',

            'term-whoami-out': 'nexus@cyberdeck — 访客会话 [只读]',

            'term-date-sys': '系统时间',
            'term-date-utc': 'UTC',
            'term-date-epoch': '纪元',
            'term-date-year': '年份',
            'term-date-year-val': '2077 (精神上)',

            'term-matrix-normal': '现实扭曲: 正常',
            'term-matrix-intense': '现实扭曲: 增强',
            'term-matrix-err': '矩阵不可用。',

            'term-hack-init': '[启动入侵序列]',
            'term-hack-1': '绕过防火墙',
            'term-hack-2': '破解加密',
            'term-hack-3': '定位主机',
            'term-hack-4': '注入载荷',
            'term-hack-5': '提取数据',
            'term-hack-6': '清除痕迹',
            'term-hack-done': '完成',
            'term-hack-ok': '[OK] 入侵完成。我们进来了。',
            'term-hack-disclaimer': '(免责声明: 纯属娱乐效果)',

            'term-joke-1': '世界上有10种人：懂二进制的和不懂的。',
            'term-joke-2': '程序员为什么喜欢深色模式？因为亮色会招虫子（bug）。',
            'term-joke-3': '换一个灯泡需要几个程序员？一个都不用——那是硬件问题。',
            'term-joke-4': '我想给你讲个UDP笑话，但你可能会漏掉。',
            'term-joke-5': '!false —— 它好笑是因为它是真的。',
            'term-joke-6': '"99个小bug在代码里，99个小bug。修了一个，打了补丁——117个小bug在代码里。"',
            'term-joke-7': '一个SQL查询走进酒吧，走到两张桌子前问："我能JOIN你们吗？"',
            'term-joke-label': '[笑话.exe]',

            'term-coffee-brew': '☕ 咖啡冲泡成功。',
            'term-coffee-level': '咖啡因等级: 峰值',

            'term-exit-closing': '关闭会话...',
            'term-exit-done': '连接已终止。',
            'term-exit-jk': '开玩笑的。想走没那么容易。',

            'term-sudo-rm': '[安全] 想得美，choomba。权限被拒绝。',
            'term-sudo-err': '[错误] 用户 \'guest\' 不在 sudoers 文件中。此事件将被上报。',

            'term-theme-switch': '主题已切换到变体',

            'term-banner-tag': ':: 霓虹光影中的代码 ::',

            'term-unknown': '未找到命令:',
            'term-unknown-help': '输入 \'help\' 查看可用命令。',
        }
    },

    // ===== GET TRANSLATION =====
    t(key) {
        return this.dict[this.lang][key] || this.dict['en'][key] || `[${key}]`;
    },

    // ===== GET LANGUAGE =====
    getLang() { return this.lang; },

    // ===== SET LANGUAGE =====
    setLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('nexus-lang', lang);

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = this.t(key);
            if (text) el.textContent = text;
        });

        // Update data-i18n-placeholder elements
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const text = this.t(key);
            if (text) el.placeholder = text;
        });

        // Update data-i18n-datatext (glitch effect)
        document.querySelectorAll('[data-i18n-datatext]').forEach(el => {
            const key = el.dataset.i18nDatatext;
            const text = this.t(key);
            if (text) el.setAttribute('data-text', text);
        });

        // Update title and meta
        document.title = this.t('title');
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', this.t('meta-desc'));

        // Update lang toggle button
        const btn = document.getElementById('lang-toggle');
        if (btn) btn.textContent = lang === 'zh' ? '中文' : 'EN';

        // Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    },

    // ===== INIT =====
    init() {
        this.setLanguage(this.lang);
    }
};

// Auto-init
window.I18N = I18N;
I18N.init();
