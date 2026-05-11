/* ============================================
   MOUSE TRAIL PARTICLES
   Neon particle trail following the cursor
   ============================================ */

(function() {
    'use strict';

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'mouse-trail';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1001;';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle array
    var particles = [];
    var maxParticles = 30;
    var colors = ['#00ffff', '#ff00ff', '#fff700', '#00ff41', '#ff006e'];

    var mouseX = -100, mouseY = -100;
    var lastX = -100, lastY = -100;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function spawnParticle(x, y) {
        return {
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            decay: 0.015 + Math.random() * 0.035,
            size: 1.5 + Math.random() * 2.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Spawn particles between last and current mouse position
        if (mouseX > 0 && mouseY > 0) {
            var dx = mouseX - lastX;
            var dy = mouseY - lastY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var steps = Math.min(Math.floor(dist / 5), 5);

            if (dist > 3) {
                for (var i = 0; i <= steps; i++) {
                    var t = steps > 0 ? i / steps : 0;
                    var px = lastX + dx * t;
                    var py = lastY + dy * t;
                    if (particles.length < maxParticles) {
                        particles.push(spawnParticle(px, py));
                    }
                }
            } else if (particles.length < maxParticles && Math.random() > 0.5) {
                particles.push(spawnParticle(mouseX, mouseY));
            }
        }

        lastX = mouseX;
        lastY = mouseY;

        // Update and draw particles
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life * 0.8;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    function tick() {
        draw();
        requestAnimationFrame(tick);
    }
    tick();
})();
