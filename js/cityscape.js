/* ============================================
   3D CYBERPUNK CITY BACKGROUND
   Low-poly buildings, neon edges, fog, orbit cam
   ============================================ */

(function() {
    'use strict';

    if (typeof THREE === 'undefined') return;

    var container = document.createElement('div');
    container.id = 'cityscape-bg';
    container.style.cssText = 'position:fixed;inset:0;z-index:-2;pointer-events:none;';
    document.body.insertBefore(container, document.body.firstChild);

    // Scene
    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.00012);

    var isMobile = window.innerWidth < 768;
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.set(0, 100, 350);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x111133, 0.4));
    var dirLight = new THREE.DirectionalLight(0x00ffff, 0.25);
    dirLight.position.set(1, 0.5, 0.5);
    scene.add(dirLight);

    // Ground
    var groundGeo = new THREE.PlaneGeometry(1400, 1400);
    var groundMat = new THREE.MeshPhongMaterial({
        color: 0x050510,
        emissive: 0x000011,
        emissiveIntensity: 0.2,
        specular: 0x001122,
        shininess: 8
    });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    scene.add(ground);

    // Grid
    var gridHelper = new THREE.GridHelper(1400, 50, 0x00ffff, 0x002233);
    gridHelper.position.y = -2.8;
    gridHelper.material.opacity = 0.12;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Buildings
    var gridCount = isMobile ? 10 : 20;
    var blockSize = 32;
    var gapSize = 10;
    var seed = 42;

    function pseudoRandom(x, z) {
        var h = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
        return h - Math.floor(h);
    }

    var buildingMat = new THREE.MeshPhongMaterial({
        color: 0x080a14,
        emissive: 0x000011,
        emissiveIntensity: 0.15,
        specular: 0x111133,
        shininess: 4,
        flatShading: true
    });

    var edgeColors = [0x00ffff, 0xff00ff, 0xfff700, 0x00ff41];

    var half = gridCount / 2;
    var buildingCount = 0;

    for (var gx = -half; gx < half; gx++) {
        for (var gz = -half; gz < half; gz++) {
            var r = pseudoRandom(gx, gz);
            if (r < 0.18) continue;

            var bx = gx * (blockSize + gapSize);
            var bz = gz * (blockSize + gapSize);

            var bw = 5 + r * 20;
            var bd = 5 + pseudoRandom(gx + 100, gz + 100) * 20;
            var bh = 4 + r * 55;

            var distFromCenter = Math.sqrt(gx * gx + gz * gz) / half;
            if (distFromCenter < 0.35) bh *= 1.6;
            if (distFromCenter > 0.8 && r < 0.55) bh *= 0.45;

            var geo = new THREE.BoxGeometry(bw, bh, bd);
            var mesh = new THREE.Mesh(geo, buildingMat);
            mesh.position.set(bx, bh / 2 - 3, bz);

            // Neon edge wireframe (only for visible/tall buildings)
            if (bh > 12 || distFromCenter < 0.5) {
                var edgeGeo = new THREE.EdgesGeometry(geo);
                var edgeColor = edgeColors[Math.floor(pseudoRandom(gx + 200, gz + 200) * edgeColors.length)];
                var edgeLine = new THREE.LineSegments(
                    edgeGeo,
                    new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: 0.08 + r * 0.18 })
                );
                mesh.add(edgeLine);
            }

            // Window lights on tall buildings
            if (bh > 22) {
                addWindowDots(mesh, bw, bh, bd, r);
            }

            scene.add(mesh);
            buildingCount++;
        }
    }

    function addWindowDots(parent, w, h, d, r) {
        var group = new THREE.Group();
        var dotGeo = new THREE.SphereGeometry(0.25, 3, 3);
        var dotMat = new THREE.MeshBasicMaterial({ color: 0xfff700 });

        // Front face only
        for (var row = 0; row < Math.floor(h / 4.5); row++) {
            for (var col = 0; col < Math.floor(w / 3.5); col++) {
                if (Math.random() < 0.45) continue;
                var dot = new THREE.Mesh(dotGeo, dotMat);
                dot.position.set(-w / 2 + 1.5 + col * 3.5, -h / 2 + 2 + row * 4.5, d / 2 + 0.15);
                group.add(dot);
            }
        }
        parent.add(group);
    }

    // Floating data particles above city
    var dataCount = isMobile ? 200 : 400;
    var dataGeo = new THREE.BufferGeometry();
    var dataPositions = new Float32Array(dataCount * 3);
    for (var i = 0; i < dataCount; i++) {
        dataPositions[i * 3] = (Math.random() - 0.5) * 700;
        dataPositions[i * 3 + 1] = 8 + Math.random() * 120;
        dataPositions[i * 3 + 2] = (Math.random() - 0.5) * 700;
    }
    dataGeo.setAttribute('position', new THREE.BufferAttribute(dataPositions, 3));
    var dataMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.7,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    var dataParticles = new THREE.Points(dataGeo, dataMat);
    scene.add(dataParticles);

    // Mouse interaction
    var mouseTargetX = 0, mouseTargetY = 0;

    window.addEventListener('mousemove', function(e) {
        mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 50;
        mouseTargetY = -(e.clientY / window.innerHeight - 0.5) * 25 + 10;
    });

    // Touch pan
    window.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1) {
            mouseTargetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 50;
            mouseTargetY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 25 + 10;
        }
    }, { passive: true });

    // Animation
    var clock = new THREE.Clock();
    var cameraBaseY = 100;
    var cameraBaseZ = isMobile ? 400 : 350;

    function animate() {
        requestAnimationFrame(animate);
        var dt = Math.min(clock.getDelta(), 0.1);

        var t = Date.now() * 0.00008;
        var targetX = Math.sin(t) * 180 + mouseTargetX;
        var targetY = cameraBaseY + mouseTargetY;
        var targetZ = cameraBaseZ + Math.cos(t) * 60;

        camera.position.x += (targetX - camera.position.x) * 0.015;
        camera.position.y += (targetY - camera.position.y) * 0.015;
        camera.position.z += (targetZ - camera.position.z) * 0.015;
        camera.lookAt(0, 0, 0);

        // Rotate data particles
        dataParticles.rotation.y += 0.00025;
        dataParticles.position.y = Math.sin(Date.now() * 0.0004) * 4;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
