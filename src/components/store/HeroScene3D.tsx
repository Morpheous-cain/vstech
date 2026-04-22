"use client";
/**
 * HeroScene3D — Space-themed Three.js hero with detailed phone model.
 * - Deep space background: star field, nebula glow, cosmic dust
 * - Continuously rotating phone with realistic materials
 * - Mouse parallax on camera
 * - Optimized: single RAF loop, dispose on unmount
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.Fog(0x020408, 10, 30);

    const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 300);
    camera.position.set(0, 0, 11);

    // ── Space background gradient plane ──────────────────────────────────
    const bgGeo = new THREE.PlaneGeometry(80, 50);
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTop:    { value: new THREE.Color(0x000208) },
        uMid:    { value: new THREE.Color(0x020b1a) },
        uBot:    { value: new THREE.Color(0x050010) },
        uNebula: { value: new THREE.Color(0x1a0640) },
        uTime:   { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform vec3 uTop, uMid, uBot, uNebula;
        uniform float uTime;
        varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){
          vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }
        void main(){
          // Vertical gradient
          float t = vUv.y;
          vec3 col = mix(uBot, uMid, smoothstep(0.0, 0.5, t));
          col = mix(col, uTop, smoothstep(0.5, 1.0, t));
          // Nebula clouds
          float n1 = noise(vUv * 3.0 + uTime * 0.012);
          float n2 = noise(vUv * 5.5 - uTime * 0.008);
          float nebula = n1 * n2;
          // Blue nebula patch left-centre
          float d1 = 1.0 - length((vUv - vec2(0.25, 0.55)) * vec2(1.8, 1.2));
          d1 = clamp(d1, 0.0, 1.0);
          col += uNebula * nebula * d1 * 0.7;
          // Faint violet patch right
          float d2 = 1.0 - length((vUv - vec2(0.78, 0.42)) * vec2(2.0, 1.5));
          d2 = clamp(d2, 0.0, 1.0);
          col += vec3(0.08, 0.02, 0.18) * nebula * d2 * 0.5;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.z = -12;
    bgMesh.renderOrder = -2;
    scene.add(bgMesh);

    // ── Star field ───────────────────────────────────────────────────────
    const STAR_COUNT = 1800;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const starBright = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i*3]   = (Math.random()-0.5)*80;
      starPos[i*3+1] = (Math.random()-0.5)*50;
      starPos[i*3+2] = (Math.random()-0.5)*30 - 8;
      starSizes[i]   = 0.5 + Math.random() * 2.0;
      starBright[i]  = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute("brightness", new THREE.BufferAttribute(starBright, 1));
    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute float brightness;
        varying float vBright;
        uniform float uTime;
        void main(){
          vBright = brightness;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vBright;
        uniform float uTime;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + vBright * 12.566);
          float alpha = (1.0 - d*2.0) * twinkle;
          vec3 col = mix(vec3(0.7,0.8,1.0), vec3(1.0,0.95,0.85), vBright);
          gl_FragColor = vec4(col, alpha * 0.9);
        }
      `,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);


    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x111133, 1.2));

    // Primary: cool blue-white from front-left
    const keyLight = new THREE.DirectionalLight(0xc8d8ff, 3.5);
    keyLight.position.set(-4, 6, 8);
    scene.add(keyLight);

    // Rim: warm violet from behind-right
    const rimLight = new THREE.DirectionalLight(0x9060ff, 2.0);
    rimLight.position.set(5, 2, -5);
    scene.add(rimLight);

    // Screen glow: cool white from front
    const screenLight = new THREE.PointLight(0xaabbff, 6, 10);
    screenLight.position.set(0, 0, 5);
    scene.add(screenLight);

    // Indigo fill from below
    const fillLight = new THREE.PointLight(0x4040cc, 3, 12);
    fillLight.position.set(0, -5, 2);
    scene.add(fillLight);

    // ── Phone model ───────────────────────────────────────────────────────
    const phoneGroup = new THREE.Group();

    const W = 1.9, H = 4.0, D = 0.15;
    const FRAME = 0.030;

    // Body — deep midnight blue/black
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x080c1a, metalness: 0.35, roughness: 0.04, envMapIntensity: 1.5,
    });
    phoneGroup.add(new THREE.Mesh(new THREE.BoxGeometry(W, H, D, 2, 4, 1), bodyMat));

    // Back panel — subtle blue shimmer
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x0d1428, metalness: 0.2, roughness: 0.03,
      transparent: true, opacity: 0.96, envMapIntensity: 2.5,
    });
    const back = new THREE.Mesh(new THREE.BoxGeometry(W-0.06, H-0.06, 0.006), backMat);
    back.position.z = -(D/2 + 0.001);
    phoneGroup.add(back);

    // Frame — indigo chrome
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x5560ff, metalness: 0.98, roughness: 0.02, envMapIntensity: 5,
    });
    ([
      [W+FRAME, FRAME, D+FRAME,  0,        H/2+FRAME/2, 0],
      [W+FRAME, FRAME, D+FRAME,  0,       -H/2-FRAME/2, 0],
      [FRAME,  H+FRAME, D+FRAME, -W/2-FRAME/2, 0,       0],
      [FRAME,  H+FRAME, D+FRAME,  W/2+FRAME/2, 0,       0],
    ] as [number,number,number,number,number,number][]).forEach(([fw,fh,fd,fx,fy,fz]) => {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(fw,fh,fd,2,2,1), frameMat);
      seg.position.set(fx,fy,fz);
      phoneGroup.add(seg);
    });

    // Edge glow lines
    phoneGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(W+0.035, H+0.035, D+0.035)),
      new THREE.LineBasicMaterial({ color: 0x7080ff, transparent: true, opacity: 0.8 })
    ));

    // Screen bezel
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x02050f, roughness: 0.95 });
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(W-0.06, H-0.06, 0.009), bezelMat);
    bezel.position.z = D/2 + 0.002;
    phoneGroup.add(bezel);

    // Screen — glowing indigo-blue
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f2e,
      emissive: 0x2030a0,
      emissiveIntensity: 0.6,
      roughness: 0.05,
      metalness: 0,
    });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(W-0.17, H-0.17, 0.003), screenMat);
    screen.position.z = D/2 + 0.006;
    phoneGroup.add(screen);

    const SZ = D/2 + 0.012;

    // UI helper
    const ui = (w: number, h: number, x: number, y: number, color: number, ei: number, op = 1.0) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.002),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: ei, transparent: op<1, opacity: op, roughness: 0.1 })
      );
      m.position.set(x, y, SZ);
      return m;
    };

    // Status bar
    phoneGroup.add(ui(1.65, 0.065, 0, 1.93, 0x0d1440, 0.2, 0.5));
    phoneGroup.add(ui(0.25, 0.03, -0.55, 1.93, 0x6677ff, 0.9));
    phoneGroup.add(ui(0.12, 0.03, 0.62, 1.93, 0x6677ff, 0.9));

    // Dynamic island
    const di = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.013),
      new THREE.MeshStandardMaterial({ color: 0x000510, metalness: 0.2, roughness: 0.6 }));
    di.position.set(0, H/2-0.16, D/2+0.009);
    phoneGroup.add(di);

    // Logo circle — indigo
    const logoCircle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.003, 48),
      new THREE.MeshStandardMaterial({ color: 0x1a2060, emissive: 0x3040c0, emissiveIntensity: 0.6 })
    );
    logoCircle.rotation.x = Math.PI/2;
    logoCircle.position.set(0, 0.5, SZ+0.001);
    phoneGroup.add(logoCircle);

    // Logo ring
    const logoRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.37, 0.002, 48, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x7080ff, emissive: 0x7080ff, emissiveIntensity: 1.5, side: THREE.BackSide, transparent: true, opacity: 0.9 })
    );
    logoRing.rotation.x = Math.PI/2;
    logoRing.position.set(0, 0.5, SZ+0.001);
    phoneGroup.add(logoRing);

    // V mark — white on logo circle
    const vMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaabbff, emissiveIntensity: 0.5 });
    [[-0.42, -0.13], [0.42, 0.13]].forEach(([rz, ox]) => {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.004), vMat);
      v.rotation.z = rz;
      v.position.set(ox, 0.48, SZ+0.003);
      phoneGroup.add(v);
    });

    // Brand text bars under logo
    phoneGroup.add(ui(0.55, 0.04, 0, 0.08, 0x9aaeff, 1.0));
    phoneGroup.add(ui(0.30, 0.025, 0, 0.00, 0x4455cc, 0.7));

    // Divider
    phoneGroup.add(ui(1.2, 0.006, 0, -0.14, 0x3344aa, 0.5, 0.5));

    // Product rows — lit in indigo/cyan/violet
    const rowAccents = [0x4466ff, 0x22ddcc, 0x9944ff];
    [-0.36, -0.70, -1.04].forEach((y, i) => {
      phoneGroup.add(ui(1.38, 0.19, 0, y, 0x0d1840, 0.3, 0.7));
      phoneGroup.add(ui(0.014, 0.19, -0.67, y, rowAccents[i], 1.5));
      phoneGroup.add(ui(0.52, 0.037, -0.24, y+0.05, 0xbbc8ff, 0.7));
      phoneGroup.add(ui(0.26, 0.028, -0.24, y-0.05, rowAccents[i], 1.0));
      phoneGroup.add(ui(0.20, 0.028, 0.44, y, rowAccents[i], 1.1));
    });

    // CTA button — glowing indigo
    phoneGroup.add(ui(1.22, 0.10, 0, -1.40, 0x4455ee, 1.6));
    phoneGroup.add(ui(0.50, 0.035, 0, -1.40, 0xffffff, 0.9));

    // Home bar
    phoneGroup.add(ui(0.32, 0.018, 0, -1.88, 0x5566cc, 0.5, 0.6));

    // Camera island — back
    const CAM_X = -0.30, CAM_Y = 1.30;
    const camIsland = new THREE.Mesh(
      new THREE.BoxGeometry(0.90, 0.90, 0.048),
      new THREE.MeshStandardMaterial({ color: 0x060c20, metalness: 0.7, roughness: 0.22 })
    );
    camIsland.position.set(CAM_X, CAM_Y, -(D/2+0.020));
    phoneGroup.add(camIsland);

    phoneGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.93, 0.93, 0.050)),
      new THREE.LineBasicMaterial({ color: 0x5560ff, transparent: true, opacity: 0.45 })
    ));

    // Lenses
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x080e22, metalness: 0.96, roughness: 0.03 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x5060dd, metalness: 0.99, roughness: 0.05 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, emissive: 0x5577cc, emissiveIntensity: 1.0, transparent: true, opacity: 0.75 });

    ([[-0.10, 0.12], [0.12, 0.12], [-0.10, -0.12]] as [number,number][]).forEach(([lx, ly]) => {
      const lz = -(D/2 + 0.040);
      const cx = CAM_X+lx, cy = CAM_Y+ly;
      const ring = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.014), ringMat);
      ring.position.set(cx, cy, lz-0.002); phoneGroup.add(ring);
      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.030), lensMat);
      lens.position.set(cx, cy, lz); phoneGroup.add(lens);
      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.095, 0.005), glowMat);
      glow.position.set(cx, cy, lz+0.010); phoneGroup.add(glow);
    });

    // Flash
    phoneGroup.add((() => {
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.020),
        new THREE.MeshStandardMaterial({ color: 0xdde8ff, emissive: 0x8899ff, emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.4 }));
      f.position.set(CAM_X+0.12, CAM_Y-0.12, -(D/2+0.038));
      return f;
    })());

    // Side buttons — indigo chrome
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x4455cc, metalness: 0.97, roughness: 0.14 });
    const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.31, 0.042), btnMat);
    pwrBtn.position.set(W/2+0.030, 0.40, 0); phoneGroup.add(pwrBtn);
    [0.56, 0.14].forEach(y => {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.22, 0.042), btnMat);
      v.position.set(-(W/2+0.030), y, 0); phoneGroup.add(v);
    });

    // Corner glints — violet
    const glintMat = new THREE.MeshStandardMaterial({ color: 0x8899ff, emissive: 0x7088ee, emissiveIntensity: 2.5 });
    ([[1,1],[1,-1],[-1,1],[-1,-1]] as [number,number][]).forEach(([sx,sy]) => {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.036, 0.022), glintMat);
      g.position.set(sx*(W/2+0.008), sy*(H/2+0.008), 0); phoneGroup.add(g);
    });

    // Phone screen glow halo
    const haloGeo = new THREE.PlaneGeometry(2.0, 4.2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x3344cc, transparent: true, opacity: 0.0, side: THREE.FrontSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = D/2 - 0.05;
    phoneGroup.add(halo);

    phoneGroup.position.set(1.8, 0, 0);
    scene.add(phoneGroup);

    // ── Floating geometric accent crystals ────────────────────────────────
    const crystalMatA = new THREE.MeshStandardMaterial({
      color: 0x4455ff, metalness: 0.8, roughness: 0.1,
      transparent: true, opacity: 0.4, emissive: 0x3344dd, emissiveIntensity: 0.25,
    });
    const crystalMatB = new THREE.MeshStandardMaterial({
      color: 0x9944ff, metalness: 0.7, roughness: 0.15,
      transparent: true, opacity: 0.32, emissive: 0x7722cc, emissiveIntensity: 0.2,
    });
    const crystalMatC = new THREE.MeshStandardMaterial({
      color: 0x22ccff, metalness: 0.75, roughness: 0.12,
      transparent: true, opacity: 0.28, emissive: 0x1199cc, emissiveIntensity: 0.22,
    });

    interface Crystal { mesh: THREE.Mesh; wire: THREE.LineSegments; phase: number; speed: number; }
    const crystals: Crystal[] = [];

    const addCrystal = (geo: THREE.BufferGeometry, mat: THREE.MeshStandardMaterial, pos: [number,number,number]) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x6677ff, transparent: true, opacity: 0.28 })
      );
      wire.position.copy(mesh.position);
      scene.add(wire);
      crystals.push({ mesh, wire, phase: Math.random()*Math.PI*2, speed: 0.25+Math.random()*0.55 });
    };

    addCrystal(new THREE.OctahedronGeometry(0.44),   crystalMatA, [-4.5,  2.2,  0.8]);
    addCrystal(new THREE.IcosahedronGeometry(0.28),   crystalMatB, [ 5.8,  1.6, -1.2]);
    addCrystal(new THREE.TetrahedronGeometry(0.38),   crystalMatC, [-5.0, -1.8,  0.6]);
    addCrystal(new THREE.OctahedronGeometry(0.22),    crystalMatA, [ 5.2, -1.4,  1.2]);
    addCrystal(new THREE.IcosahedronGeometry(0.18),   crystalMatC, [ 0.5,  3.2, -0.8]);
    addCrystal(new THREE.TetrahedronGeometry(0.25),   crystalMatB, [ 3.8,  3.0,  0.4]);
    addCrystal(new THREE.OctahedronGeometry(0.15),    crystalMatC, [-3.0, -2.8,  0.2]);

    // ── Orbit ring ────────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(3.5, 0.012, 8, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x3344aa, transparent: true, opacity: 0.35 });
    const orbitRing = new THREE.Mesh(ringGeo, ringMaterial);
    orbitRing.rotation.x = Math.PI * 0.32;
    orbitRing.position.set(1.8, 0, 0);
    scene.add(orbitRing);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.008, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x220066, transparent: true, opacity: 0.2 })
    );
    ring2.rotation.x = Math.PI * 0.18;
    ring2.rotation.y = Math.PI * 0.3;
    ring2.position.set(1.8, 0, 0);
    scene.add(ring2);

    // ── Mouse + resize ────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      camera.aspect = w / h;
      if (w < 768) {
        camera.fov = 55;
        camera.position.set(0, 0.4, 13.5);
        phoneGroup.position.set(0, 0, 0);
      } else if (w < 1024) {
        camera.fov = 50;
        camera.position.set(0, 0.2, 12);
        phoneGroup.position.set(1.2, 0, 0);
      } else {
        camera.fov = 45;
        camera.position.set(0, 0, 11);
        phoneGroup.position.set(1.8, 0, 0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize();

    // ── Animation loop ────────────────────────────────────────────────────
    let clock = 0;
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clock += 0.008;

      // Update shader time
      bgMat.uniforms.uTime.value = clock;
      starMat.uniforms.uTime.value = clock;

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      camera.position.x = targetX * 1.2;
      camera.position.y = -targetY * 0.8;
      camera.lookAt(1.8, 0, 0);

      // Phone: continuous slow rotation + float
      phoneGroup.rotation.y = clock * 0.28;
      phoneGroup.position.y = Math.sin(clock * 0.6) * 0.18;
      phoneGroup.rotation.x = Math.sin(clock * 0.45) * 0.04 - targetY * 0.04;

      // Rings
      orbitRing.rotation.z = clock * 0.12;
      ring2.rotation.z = -clock * 0.08;

      // Screen glow pulse
      screenLight.intensity = 5.5 + Math.sin(clock * 1.5) * 1.0;
      screenMat.emissiveIntensity = 0.5 + Math.sin(clock * 1.2) * 0.15;

      // Crystals
      crystals.forEach((c, i) => {
        const t = clock * c.speed + c.phase;
        c.mesh.position.y += Math.sin(t) * 0.003;
        c.wire.position.y = c.mesh.position.y;
        c.mesh.rotation.x += 0.005 + i * 0.001;
        c.mesh.rotation.y += 0.007 + i * 0.0012;
        c.wire.rotation.copy(c.mesh.rotation);
      });

      // Stars drift
      stars.rotation.y = clock * 0.006;


      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      // Dispose
      renderer.dispose();
      [bgGeo, starGeo,].forEach(g => g.dispose());
      [bgMat, starMat, bodyMat, backMat, frameMat, bezelMat, screenMat].forEach(m => m.dispose());
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}
