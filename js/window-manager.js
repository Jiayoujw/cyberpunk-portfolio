/* ============================================
   OS WINDOW MANAGER
   Draggable, resizable, minimizable windows
   ============================================ */

(function() {
    'use strict';

    var windows = [];
    var zBase = 100;
    var viewportW = window.innerWidth;
    var viewportH = window.innerHeight;

    window.addEventListener('resize', function() {
        viewportW = window.innerWidth;
        viewportH = window.innerHeight;
    });

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    // ===== CREATE WINDOW =====
    function createWindow(options) {
        var opts = options || {};
        var id = opts.id || 'win-' + Date.now();
        var isMobile = viewportW <= 768;
        var w = isMobile ? viewportW : (opts.width || 600);
        var h = isMobile ? viewportH - 60 : (opts.height || 400);
        var top = isMobile ? 30 : (opts.top || 80 + windows.length * 40);
        var left = opts.left === 'center' ? (viewportW - w) / 2 : (isMobile ? 0 : (opts.left || 100 + windows.length * 30));

        // Build DOM
        var el = document.createElement('div');
        el.className = 'os-window';
        el.setAttribute('data-window-id', id);
        el.style.width = w + 'px';
        el.style.height = h + 'px';
        el.style.top = top + 'px';
        el.style.left = left + 'px';
        el.style.zIndex = ++zBase;

        el.innerHTML = [
            '<div class="os-window-header">',
            '  <div class="os-window-controls">',
            '    <span class="os-ctrl os-ctrl-close" data-action="close"></span>',
            '    <span class="os-ctrl os-ctrl-min" data-action="minimize"></span>',
            '    <span class="os-ctrl os-ctrl-max" data-action="maximize"></span>',
            '  </div>',
            '  <span class="os-window-title">' + (opts.title || 'window.exe') + '</span>',
            '  <span class="os-window-spacer"></span>',
            '</div>',
            '<div class="os-window-body"></div>',
            '<div class="os-window-resize"></div>'
        ].join('');

        document.body.appendChild(el);

        var headerEl = el.querySelector('.os-window-header');
        var bodyEl = el.querySelector('.os-window-body');
        var resizeHandle = el.querySelector('.os-window-resize');
        var titleEl = el.querySelector('.os-window-title');

        if (opts.content) {
            if (typeof opts.content === 'string') bodyEl.innerHTML = opts.content;
            else bodyEl.appendChild(opts.content);
        }

        var win = {
            id: id,
            el: el,
            headerEl: headerEl,
            bodyEl: bodyEl,
            titleEl: titleEl,
            resizeHandle: resizeHandle,
            isMinimized: false,
            isMaximized: false,
            isVisible: true,
            savedTop: top + 'px',
            savedLeft: left + 'px',
            savedWidth: w + 'px',
            savedHeight: h + 'px'
        };

        // ===== CONTROLS =====
        headerEl.addEventListener('click', function(e) {
            var action = e.target.dataset.action;
            if (!action) return;
            if (action === 'close') {
                win.el.style.opacity = '0';
                win.el.style.transform = 'scale(0.9)';
                win.el.style.transition = 'opacity 0.2s, transform 0.2s';
                setTimeout(function() {
                    win.el.style.display = 'none';
                    win.isVisible = false;
                }, 200);
            } else if (action === 'minimize') {
                win.el.classList.toggle('minimized');
                win.isMinimized = !win.isMinimized;
            } else if (action === 'maximize') {
                if (win.isMaximized) {
                    win.el.style.top = win.savedTop;
                    win.el.style.left = win.savedLeft;
                    win.el.style.width = win.savedWidth;
                    win.el.style.height = win.savedHeight;
                    win.el.style.transition = 'all 0.25s ease';
                    win.isMaximized = false;
                } else {
                    win.savedTop = win.el.style.top;
                    win.savedLeft = win.el.style.left;
                    win.savedWidth = win.el.style.width;
                    win.savedHeight = win.el.style.height;
                    win.el.style.top = '0';
                    win.el.style.left = '0';
                    win.el.style.width = viewportW + 'px';
                    win.el.style.height = viewportH + 'px';
                    win.el.style.transition = 'all 0.25s ease';
                    win.isMaximized = true;
                }
                setTimeout(function() { win.el.style.transition = 'none'; }, 260);
            }
        });

        // ===== DRAG =====
        enableDrag(win);
        // ===== RESIZE =====
        enableResize(win);
        // ===== FOCUS =====
        enableFocus(win);

        windows.push(win);
        return win;
    }

    // ===== FOCUS ON CLICK =====
    function enableFocus(win) {
        win.el.addEventListener('mousedown', function() {
            if (zBase > 500) resetZIndexes();
            win.el.style.zIndex = ++zBase;
            windows.forEach(function(w) { w.el.classList.remove('focused'); });
            win.el.classList.add('focused');
        });
    }

    function resetZIndexes() {
        zBase = 100;
        windows.forEach(function(w) {
            w.el.style.zIndex = ++zBase;
        });
    }

    // ===== DRAG LOGIC =====
    function enableDrag(win) {
        var header = win.headerEl;
        var el = win.el;
        var startX, startY, origLeft, origTop;
        var dragging = false;

        function onStart(e) {
            if (win.isMaximized) return;
            if (e.target.closest('.os-ctrl')) return;
            dragging = true;
            var point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            var rect = el.getBoundingClientRect();
            origLeft = rect.left;
            origTop = rect.top;
            el.style.transition = 'none';
            header.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function onMove(e) {
            if (!dragging) return;
            var point = e.touches ? e.touches[0] : e;
            var dx = point.clientX - startX;
            var dy = point.clientY - startY;
            var newLeft = clamp(origLeft + dx, -el.offsetWidth + 60, viewportW - 60);
            var newTop = clamp(origTop + dy, 0, viewportH - 35);
            el.style.left = newLeft + 'px';
            el.style.top = newTop + 'px';
        }

        function onEnd() {
            if (!dragging) return;
            dragging = false;
            header.style.cursor = '';
        }

        header.addEventListener('mousedown', onStart);
        header.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    }

    // ===== RESIZE LOGIC =====
    function enableResize(win) {
        var handle = win.resizeHandle;
        var el = win.el;
        var startX, startY, origW, origH;
        var resizing = false;

        function onStart(e) {
            if (win.isMaximized) return;
            resizing = true;
            var point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            var rect = el.getBoundingClientRect();
            origW = rect.width;
            origH = rect.height;
            e.preventDefault();
            e.stopPropagation();
        }

        function onMove(e) {
            if (!resizing) return;
            var point = e.touches ? e.touches[0] : e;
            el.style.width = Math.max(300, origW + (point.clientX - startX)) + 'px';
            el.style.height = Math.max(200, origH + (point.clientY - startY)) + 'px';
        }

        function onEnd() { resizing = false; }

        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    }

    // ===== FACTORY: Terminal Window =====
    function createTerminalWindow() {
        var existingTerminal = document.querySelector('.terminal-window');
        if (!existingTerminal) return null;
        var terminalSection = document.getElementById('terminal');
        // Move terminal into floating window
        var win = createWindow({
            id: 'terminal',
            title: 'terminal.exe',
            width: 750,
            height: 500,
            top: 120,
            left: 'center'
        });
        existingTerminal.style.maxWidth = 'none';
        existingTerminal.style.margin = '0';
        existingTerminal.style.boxShadow = 'none';
        existingTerminal.style.border = 'none';
        win.bodyEl.appendChild(existingTerminal);
        // Re-focus the input since it moved
        var input = existingTerminal.querySelector('.terminal-input');
        if (input) setTimeout(function() { input.focus(); }, 100);
        return win;
    }

    // ===== FACTORY: About Window =====
    function createAboutWindow() {
        var aboutText1 = I18N.t('about-text-1');
        var aboutText2 = I18N.t('about-text-2');
        var content = '<div style="padding:1.5rem;font-family:var(--font-mono);color:var(--color-text);line-height:1.7;">' +
            '<h3 style="color:var(--color-cyan);margin-bottom:1rem;font-family:var(--font-display);text-shadow:0 0 10px var(--color-cyan);">NEXUS // DIGITAL ARCHITECT</h3>' +
            '<p style="margin-bottom:0.75rem;">' + aboutText1 + '</p>' +
            '<p>' + aboutText2 + '</p>' +
            '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px dashed var(--color-border);font-size:0.8rem;color:var(--color-text-dim);">' +
            '<span style="color:var(--color-cyan);">STATUS:</span> <span style="color:var(--color-green);">JACKED IN</span><br>' +
            '<span style="color:var(--color-cyan);">NODE:</span> ' + (window.location ? window.location.hostname : 'cyberdeck.local') + '</div>' +
            '</div>';
        return createWindow({
            id: 'about',
            title: 'about.sys',
            width: 480,
            height: 380,
            top: 180,
            left: 80,
            content: content
        });
    }

    // ===== FACTORY: Projects Window =====
    function createProjectsWindow() {
        var projKeys = ['prj-1-title','prj-2-title','prj-3-title','prj-4-title','prj-5-title','prj-6-title'];
        var rows = '';
        projKeys.forEach(function(key, i) {
            rows += '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0;border-bottom:1px solid rgba(0,255,255,0.08);">' +
                '<span style="color:var(--color-cyan);font-family:var(--font-display);font-size:0.8rem;">PRJ_00' + (i+1) + '</span>' +
                '<span style="color:var(--color-text-bright);">' + I18N.t(key) + '</span>' +
                '<span style="margin-left:auto;color:var(--color-green);font-size:0.7rem;">[ACTIVE]</span></div>';
        });
        var content = '<div style="padding:1rem;font-family:var(--font-mono);color:var(--color-text);">' +
            '<div style="color:var(--color-yellow);margin-bottom:1rem;font-size:0.85rem;">> Project archive loaded. 6 entries.</div>' +
            rows + '</div>';
        return createWindow({
            id: 'projects',
            title: 'projects.dat',
            width: 500,
            height: 350,
            top: 220,
            left: 200,
            content: content
        });
    }

    // ===== PUBLIC API =====
    window.NexusWM = {
        createWindow: createWindow,
        createTerminalWindow: createTerminalWindow,
        createAboutWindow: createAboutWindow,
        createProjectsWindow: createProjectsWindow
    };
})();
