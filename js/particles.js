/* ============================================
   THREE.JS PARTICLE BACKGROUND
   Floating cyberpunk particles with mouse interaction
   ============================================ */

(function() {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded — particles disabled');
        return;
    }

    const container = document.getElementById('particles-bg');
    if (!container) return;

    // ----- Scene Setup -----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ----- Particles -----
    const particleCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const cyanColor = new THREE.Color(0x00ffff);
    const magentaColor = new THREE.Color(0xff00ff);
    const yellowColor = new THREE.Color(0xfff700);

    for (let i = 0; i < particleCount; i++) {
        // Random spherical distribution
        positions[i * 3] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

        // Pick random color from cyber palette
        const r = Math.random();
        let color;
        if (r < 0.5) color = cyanColor;
        else if (r < 0.85) color = magentaColor;
        else color = yellowColor;

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ----- Connecting Lines (web effect) -----
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });

    const linePositions = new Float32Array(particleCount * 6); // each line = 2 points × 3 coords
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // ----- Mouse Interaction -----
    const mouse = new THREE.Vector2(0, 0);
    const targetRotation = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        targetRotation.x = mouse.y * 0.1;
        targetRotation.y = mouse.x * 0.1;
    });

    // ----- Animation Loop -----
    var frameCount = 0;

    // ===== AUDIO SPECTRUM SETUP =====
    var analyser = null;
    var freqData = null;
    var hasRealAudio = false;

    function setupAudioVis() {
        try {
            var audioCtx = null;
            // Try to hook into NexusAudio's context
            if (window.NexusAudio && typeof window.NexusAudio.getCtx === 'function') {
                audioCtx = window.NexusAudio.getCtx();
            }
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 128;
            analyser.smoothingTimeConstant = 0.7;

            // Try to connect to any existing audio destination
            // If no real audio, create a silent oscillator for visual rhythm
            try {
                // Check if there are connections to destination (audio might be playing)
                // For now, create a simulated pulse oscillator
                var simOsc = audioCtx.createOscillator();
                var simGain = audioCtx.createGain();
                simOsc.connect(simGain);
                simGain.connect(analyser);
                // Don't connect to destination — silent visualization
                simOsc.type = 'sawtooth';
                simOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low note with harmonics
                simGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                simOsc.start();
                hasRealAudio = false;
            } catch (e) {
                analyser = null;
            }

            freqData = new Uint8Array(analyser.frequencyBinCount);
        } catch (e) {
            // Audio visualization unavailable
            analyser = null;
        }
    }

    // Try setup after user interaction
    document.addEventListener('click', function trySetup() {
        if (!analyser) setupAudioVis();
    }, { once: true });
    document.addEventListener('keydown', function trySetup() {
        if (!analyser) setupAudioVis();
    }, { once: true });

    function getAudioEnergy() {
        if (!analyser || !freqData) return 0;
        analyser.getByteFrequencyData(freqData);
        var sum = 0;
        for (var i = 0; i < freqData.length; i++) sum += freqData[i];
        return sum / freqData.length / 255; // 0..1
    }

    function animate() {
        requestAnimationFrame(animate);

        // Audio-reactive energy
        var energy = getAudioEnergy();
        var pulse = 1 + energy * 0.4;

        // Smooth rotation following mouse
        particles.rotation.x += (targetRotation.x - particles.rotation.x) * 0.04;
        particles.rotation.y += (targetRotation.y - particles.rotation.y) * 0.04;

        // Slow autonomous drift
        particles.rotation.z += 0.0005;

        // Audio-reactive scale and Y displacement
        if (energy > 0.01) {
            particles.scale.setScalar(pulse);
            particles.position.y = Math.sin(Date.now() * 0.003) * energy * 30;
        }

        // Update connecting lines every few frames (perf)
        if (frameCount % 4 === 0) {
            updateLines();
        }
        frameCount++;

        renderer.render(scene, camera);
    }

    function updateLines() {
        const posArr = particlesGeometry.attributes.position.array;
        let lineIdx = 0;
        const maxLines = 200;
        const maxDistSq = 80 * 80;

        for (let i = 0; i < particleCount && lineIdx < maxLines; i++) {
            for (let j = i + 1; j < particleCount && lineIdx < maxLines; j++) {
                const dx = posArr[i * 3] - posArr[j * 3];
                const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < maxDistSq) {
                    linePositions[lineIdx * 6] = posArr[i * 3];
                    linePositions[lineIdx * 6 + 1] = posArr[i * 3 + 1];
                    linePositions[lineIdx * 6 + 2] = posArr[i * 3 + 2];
                    linePositions[lineIdx * 6 + 3] = posArr[j * 3];
                    linePositions[lineIdx * 6 + 4] = posArr[j * 3 + 1];
                    linePositions[lineIdx * 6 + 5] = posArr[j * 3 + 2];
                    lineIdx++;
                }
            }
        }

        // Zero out unused lines
        for (let i = lineIdx; i < maxLines; i++) {
            linePositions[i * 6] = linePositions[i * 6 + 3] = 0;
            linePositions[i * 6 + 1] = linePositions[i * 6 + 4] = 0;
            linePositions[i * 6 + 2] = linePositions[i * 6 + 5] = 0;
        }

        lineGeometry.attributes.position.needsUpdate = true;
    }

    // ----- Resize -----
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
})();
