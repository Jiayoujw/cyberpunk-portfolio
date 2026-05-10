/* ============================================
   MATRIX RAIN - Digital rain background
   ============================================ */

(function() {
    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Characters (mix of katakana, latin, and symbols for cyberpunk feel)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+-=<>?/'.split('');
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);

    // Drops position - one per column
    let drops = Array(columns).fill(1);

    function recalcColumns() {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }
    window.addEventListener('resize', recalcColumns);

    function draw() {
        // Translucent black to leave a fade effect
        ctx.fillStyle = 'rgba(5, 5, 7, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Head of the rain - brighter
            if (Math.random() > 0.975) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00ff41';
                ctx.shadowBlur = 8;
            } else {
                ctx.fillStyle = '#00ff41';
                ctx.shadowBlur = 0;
            }

            ctx.fillText(text, x, y);

            // Reset drop randomly
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    let animationId;
    function animate() {
        draw();
        animationId = setTimeout(() => requestAnimationFrame(animate), 50);
    }

    // Start when boot screen finishes
    setTimeout(animate, 100);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearTimeout(animationId);
        } else {
            animate();
        }
    });
})();
