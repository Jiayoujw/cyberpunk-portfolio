/* ============================================
   FULL-SCREEN GLITCH EFFECT
   Terminal command + double-click trigger
   ============================================ */

(function() {
    'use strict';

    var glitchOverlay = null;
    var isActive = false;
    var shakeTimer = null;
    var flickerTimer = null;

    function ensureOverlay() {
        if (glitchOverlay) return;
        glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay';
        document.body.appendChild(glitchOverlay);
    }

    function trigger(duration) {
        if (isActive) return;
        isActive = true;
        duration = duration || 600;

        ensureOverlay();

        var body = document.body;
        var noiseEl = document.querySelector('.noise-overlay');
        var scanEl = document.querySelector('.scanlines');

        var origTransform = body.style.transform;
        var origNoise = noiseEl ? noiseEl.style.opacity : null;
        var origScan = scanEl ? scanEl.style.opacity : null;

        // Intensify overlays
        if (noiseEl) noiseEl.style.opacity = '0.25';
        if (scanEl) scanEl.classList.add('glitch-active');

        // CSS animation class
        body.classList.add('glitch-fullscreen');

        // JS screen shake for randomness
        shakeTimer = setInterval(function() {
            var sx = (Math.random() - 0.5) * 10;
            var sy = (Math.random() - 0.5) * 6;
            body.style.transform = 'translate(' + sx + 'px,' + sy + 'px)';
        }, 25);

        // Glitch overlay flicker
        var flickerCount = 0;
        flickerTimer = setInterval(function() {
            glitchOverlay.style.opacity = flickerCount % 2 === 0 ? '0.5' : '0.05';
            glitchOverlay.style.backgroundPosition = (Math.random() * 100) + 'px ' + (Math.random() * 100) + 'px';
            flickerCount++;
        }, 45);

        // Cleanup
        setTimeout(function() {
            clearInterval(shakeTimer);
            clearInterval(flickerTimer);
            body.classList.remove('glitch-fullscreen');
            body.style.transform = origTransform;
            glitchOverlay.style.opacity = '0';
            if (noiseEl) noiseEl.style.opacity = origNoise;
            if (scanEl) scanEl.classList.remove('glitch-active');
            isActive = false;
        }, duration);
    }

    window.NexusGlitch = { trigger: trigger };
})();
