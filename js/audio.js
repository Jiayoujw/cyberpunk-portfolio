/* ============================================
   SYNTH SOUND ENGINE
   Web Audio API — synthesized cyberpunk SFX
   ============================================ */

(function() {
    'use strict';

    var ctx = null;
    var muted = localStorage.getItem('nexus-muted') === 'true';

    function getCtx() {
        if (!ctx) {
            try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch (e) { ctx = null; }
        }
        return ctx;
    }

    // Resume context on first user interaction
    document.addEventListener('click', function() { var c = getCtx(); if (c && c.state === 'suspended') c.resume(); }, { once: true });
    document.addEventListener('keydown', function() { var c = getCtx(); if (c && c.state === 'suspended') c.resume(); }, { once: true });

    function isMuted() { return muted || !getCtx(); }

    // ===== KEYPRESS BLIP =====
    function keyBlip() {
        if (isMuted()) return;
        var c = getCtx();
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.06);
    }

    // ===== HOVER SWEEP =====
    function hoverSweep() {
        if (isMuted()) return;
        var c = getCtx();
        var osc = c.createOscillator();
        var filter = c.createBiquadFilter();
        var gain = c.createGain();
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.08);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, c.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.1);
    }

    // ===== CLICK THUD =====
    function clickThud() {
        if (isMuted()) return;
        var c = getCtx();
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.12);
    }

    // ===== NAV SWOOSH =====
    function navSwoosh(dir) {
        if (isMuted()) return;
        var c = getCtx();
        var duration = 0.3;
        var now = c.currentTime;

        var noise = c.createBufferSource();
        var buffer = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
        noise.buffer = buffer;

        var filter = c.createBiquadFilter();
        var gain = c.createGain();
        var merger = c.createChannelMerger(2);

        // Left channel
        var gainL = c.createGain();
        // Right channel
        var gainR = c.createGain();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(gainL);
        gain.connect(gainR);
        gainL.connect(merger, 0, 0);
        gainR.connect(merger, 0, 1);
        merger.connect(c.destination);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + duration);
        filter.Q.setValueAtTime(5, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Pan direction
        if (dir > 0) {
            gainL.gain.setValueAtTime(0.3, now);
            gainL.gain.exponentialRampToValueAtTime(1, now + duration);
            gainR.gain.setValueAtTime(1, now);
            gainR.gain.exponentialRampToValueAtTime(0.3, now + duration);
        } else {
            gainL.gain.setValueAtTime(1, now);
            gainL.gain.exponentialRampToValueAtTime(0.3, now + duration);
            gainR.gain.setValueAtTime(0.3, now);
            gainR.gain.exponentialRampToValueAtTime(1, now + duration);
        }

        noise.start(now);
        noise.stop(now + duration);
    }

    // ===== MUTE TOGGLE =====
    function toggleMute() {
        muted = !muted;
        localStorage.setItem('nexus-muted', muted);
        updateMuteButton();
        return muted;
    }

    function updateMuteButton() {
        var btn = document.getElementById('audio-toggle');
        if (btn) btn.textContent = muted ? '[♪ OFF]' : '[♪]';
    }

    // ===== PUBLIC API =====
    window.NexusAudio = {
        keyBlip: keyBlip,
        hoverSweep: hoverSweep,
        clickThud: clickThud,
        navSwoosh: navSwoosh,
        toggleMute: toggleMute,
        isMuted: function() { return muted; },
        getMuted: function() { return muted; },
        getCtx: getCtx,
        initMuteButton: updateMuteButton
    };

    // Init button on boot
    document.addEventListener('DOMContentLoaded', updateMuteButton);
    updateMuteButton();
})();
