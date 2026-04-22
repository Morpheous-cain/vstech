"use client";

/**
 * HeroScene — VisionTech 3D hero.
 * White + Indigo theme redesign.
 * Improvements:
 *  1. Pure white background with soft indigo radial gradient.
 *  2. Phone has deep indigo frame (matching brand palette).
 *  3. Screen shows indigo UI elements on white background.
 *  4. Floating crystal accents in indigo/violet tones.
 *  5. Soft particle field in indigo/periwinkle.
 *  6. Premium lighting for white environment — no harsh shadows.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 8, 22);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      200
    );
    camera.position.set(4, 1.5, 9);
    camera.lookAt(1.5, 0, 0);

    // ── Background: white with soft indigo radial glow ─────────────────────
    const bgGeo = new THREE.PlaneGeometry(60, 40);
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      side: THREE.FrontSide,
      uniforms: {
        uColorCenter: { value: new THREE.Color(0xeef2ff) }, // indigo-50
        uColorMid:    { value: new THREE.Color(0xf8f9fc) }, // near white
        uColorEdge:   { value: new THREE.Color(0xffffff) }, // pure white edge
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColorCenter;
        uniform vec3 uColorMid;
        uniform vec3 uColorEdge;
        varying vec2 vUv;
        void main() {
          vec2 centre = vec2(0.65, 0.52);
          float dist = length(vUv - centre) * 1.6;
          dist = clamp(dist, 0.0, 1.0);
          float t = smoothstep(0.0, 1.0, dist);
          float t2 = smoothstep(0.0, 0.5, dist);
          vec3 col = mix(uColorCenter, uColorMid, t2);
          col = mix(col, uColorEdge, t * 0.6);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const bgPlane = new THREE.Mesh(bgGeo, bgMat);
    bgPlane.position.set(1.5, 0, -8);
    bgPlane.renderOrder = -1;
    scene.add(bgPlane);

    // Soft ambient for white environment
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    // Key light — cool white from upper right
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    // Indigo fill — left side, gives phone its cool shadow
    const indigoFill = new THREE.PointLight(0x6366f1, 12, 18);
    indigoFill.position.set(-4, 1, 5);
    scene.add(indigoFill);

    // Rim light — bright white from behind
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(-3, 3, -5);
    scene.add(rimLight);

    // Violet accent from below
    const violetAccent = new THREE.PointLight(0x818cf8, 6, 12);
    violetAccent.position.set(2, -4, 4);
    scene.add(violetAccent);

    // Screen bounce
    const screenBounce = new THREE.PointLight(0xc7d2fe, 5, 8);
    screenBounce.position.set(2.6, 0, 4);
    scene.add(screenBounce);

    // ---- Phone model -------------------------------------------------------
    const phoneGroup = new THREE.Group();

    const PHONE_W = 2.0;
    const PHONE_H = 4.1;
    const PHONE_D = 0.16;
    const FRAME_T = 0.032;

    // Body — deep indigo
    phoneGroup.add(new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W, PHONE_H, PHONE_D, 2, 4, 1),
      new THREE.MeshStandardMaterial({
        color: 0x1a1c5e, metalness: 0.3, roughness: 0.05, envMapIntensity: 2.0,
      })
    ));

    // Back glass — indigo with shimmer
    const backGlass = new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W - 0.07, PHONE_H - 0.07, 0.007),
      new THREE.MeshStandardMaterial({
        color: 0x2d30a0, metalness: 0.15, roughness: 0.02,
        transparent: true, opacity: 0.95, envMapIntensity: 3.0,
      })
    );
    backGlass.position.z = -(PHONE_D / 2) - 0.001;
    phoneGroup.add(backGlass);

    // Frame — polished indigo-violet sides
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x4f52e8, metalness: 0.99, roughness: 0.03, envMapIntensity: 4.0,
    });
    const frameSides: [number, number, number, number, number, number][] = [
      [PHONE_W + FRAME_T, FRAME_T, PHONE_D + FRAME_T,  0,                        PHONE_H / 2 + FRAME_T / 2, 0],
      [PHONE_W + FRAME_T, FRAME_T, PHONE_D + FRAME_T,  0,                       -PHONE_H / 2 - FRAME_T / 2, 0],
      [FRAME_T, PHONE_H + FRAME_T, PHONE_D + FRAME_T, -PHONE_W / 2 - FRAME_T / 2, 0,                        0],
      [FRAME_T, PHONE_H + FRAME_T, PHONE_D + FRAME_T,  PHONE_W / 2 + FRAME_T / 2, 0,                        0],
    ];
    frameSides.forEach(([w, h, d, x, y, z]) => {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 2, 1), frameMat);
      seg.position.set(x, y, z);
      phoneGroup.add(seg);
    });

    // Outer indigo rim lines
    phoneGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(PHONE_W + 0.04, PHONE_H + 0.04, PHONE_D + 0.04)),
      new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.9 })
    ));
    // Inner seam
    phoneGroup.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(PHONE_W + 0.001, PHONE_H + 0.001, PHONE_D)),
      new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.5 })
    ));

    // Screen bezel — very dark indigo
    const screenBezel = new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W - 0.07, PHONE_H - 0.07, 0.010),
      new THREE.MeshStandardMaterial({ color: 0x0d0f2e, roughness: 0.9, metalness: 0.0 })
    );
    screenBezel.position.z = PHONE_D / 2 + 0.003;
    phoneGroup.add(screenBezel);

    // Screen — clean white
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.08,
      emissive: 0xeef2ff,
      emissiveIntensity: 0.12,
    });
    const screenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(PHONE_W - 0.18, PHONE_H - 0.18, 0.004),
      screenMat
    );
    screenMesh.position.z = PHONE_D / 2 + 0.008;
    phoneGroup.add(screenMesh);

    // ── Screen UI — indigo elements on white screen ────────────────────────
    const SZ = PHONE_D / 2 + 0.014;

    const ui = (
      w: number, h: number, x: number, y: number,
      color: number, ei: number, op = 1.0
    ) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.002),
        new THREE.MeshStandardMaterial({
          color, emissive: color, emissiveIntensity: ei,
          transparent: op < 1, opacity: op, roughness: 0.1, metalness: 0.0,
        })
      );
      m.position.set(x, y, SZ);
      return m;
    };

    // Status bar
    phoneGroup.add(ui(1.60, 0.075,  0,      1.97,  0xf1f3f9, 0.3, 0.7));
    phoneGroup.add(ui(0.28, 0.035, -0.55,   1.97,  0x1a1c5e, 0.6));
    phoneGroup.add(ui(0.12, 0.035,  0.60,   1.97,  0x1a1c5e, 0.6));

    // Dynamic Island
    const diMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.10, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x0d0f2e, metalness: 0.2, roughness: 0.5 })
    );
    diMesh.position.set(0, PHONE_H / 2 - 0.17, PHONE_D / 2 + 0.010);
    phoneGroup.add(diMesh);

    const diLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.040, 0.040, 0.003),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 3.0 })
    );
    diLed.position.set(0.13, PHONE_H / 2 - 0.17, PHONE_D / 2 + 0.012);
    phoneGroup.add(diLed);

    // ── VS Logomark — indigo circle + logo ────────────────────────────────
    const logoCircle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.003, 48),
      new THREE.MeshStandardMaterial({
        color: 0x1a1c5e, metalness: 0.1, roughness: 0.3,
        emissive: 0x2d30a0, emissiveIntensity: 0.5,
      })
    );
    logoCircle.rotation.x = Math.PI / 2;
    logoCircle.position.set(0, 0.55, SZ + 0.001);
    phoneGroup.add(logoCircle);

    // Indigo ring
    const logoRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.40, 0.40, 0.002, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x818cf8, emissive: 0x818cf8, emissiveIntensity: 1.2,
        side: THREE.BackSide, transparent: true, opacity: 0.9,
      })
    );
    logoRing.rotation.x = Math.PI / 2;
    logoRing.position.set(0, 0.55, SZ + 0.001);
    phoneGroup.add(logoRing);

    // V shape — white on indigo circle
    const vMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xc7d2fe, emissiveIntensity: 0.4 });
    const vLeft = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.38, 0.004), vMat);
    vLeft.rotation.z =  0.42;
    vLeft.position.set(-0.14, 0.52, SZ + 0.003);
    phoneGroup.add(vLeft);

    const vRight = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.38, 0.004), vMat);
    vRight.rotation.z = -0.42;
    vRight.position.set(0.14, 0.52, SZ + 0.003);
    phoneGroup.add(vRight);

    // S letterform — indigo on white
    phoneGroup.add(ui(0.22, 0.040,  0.085,  0.70,  0x6366f1, 1.4));
    phoneGroup.add(ui(0.22, 0.040,  0.065,  0.56,  0x6366f1, 1.4));
    phoneGroup.add(ui(0.22, 0.040,  0.085,  0.42,  0x6366f1, 1.4));
    phoneGroup.add(ui(0.040, 0.14,  0.185,  0.63,  0x6366f1, 1.4));
    phoneGroup.add(ui(0.040, 0.14, -0.055,  0.49,  0x6366f1, 1.4));

    // Brand text bars
    phoneGroup.add(ui(0.60, 0.045,  0,      0.11,  0x1a1c5e, 0.9));
    phoneGroup.add(ui(0.32, 0.030,  0,      0.03,  0x6366f1, 0.8));

    // Divider
    phoneGroup.add(ui(1.25, 0.008,  0,     -0.12,  0xa5b4fc, 0.5, 0.5));

    // Product rows — indigo accent bars
    const rowColors = [0x10b981, 0x6366f1, 0xf59e0b];
    [-0.32, -0.65, -0.98].forEach((y, i) => {
      phoneGroup.add(ui(1.40, 0.200,  0,      y,      0xeef2ff, 0.2, 0.8));
      phoneGroup.add(ui(0.016, 0.200, -0.68,  y,      rowColors[i], 1.2));
      phoneGroup.add(ui(0.55, 0.040, -0.25,   y + 0.05, 0x1a1c5e, 0.7));
      phoneGroup.add(ui(0.28, 0.030, -0.25,   y - 0.05, 0x6366f1, 0.9));
      phoneGroup.add(ui(0.22, 0.030,  0.42,   y,      rowColors[i], 1.0));
    });

    // CTA button — indigo
    phoneGroup.add(ui(1.25, 0.110,  0,     -1.38,  0x4f52e8, 1.4));
    phoneGroup.add(ui(0.55, 0.038,  0,     -1.38,  0xffffff, 0.8));

    // Home indicator
    phoneGroup.add(ui(0.35, 0.022,  0,     -1.90,  0x9da6c8, 0.4, 0.6));

    // Camera island (back)
    const CAM_X = -0.33;
    const CAM_Y =  1.33;
    const cameraIsland = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, 0.96, 0.052),
      new THREE.MeshStandardMaterial({ color: 0x0d0f2e, metalness: 0.7, roughness: 0.25 })
    );
    cameraIsland.position.set(CAM_X, CAM_Y, -(PHONE_D / 2 + 0.022));
    phoneGroup.add(cameraIsland);

    const islandEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.99, 0.99, 0.055)),
      new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.5 })
    );
    islandEdge.position.copy(cameraIsland.position);
    phoneGroup.add(islandEdge);

    // Lenses
    const lensMat     = new THREE.MeshStandardMaterial({ color: 0x0d1f3c, metalness: 0.95, roughness: 0.04 });
    const lensRingMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.99, roughness: 0.06 });
    const lensGlowMat = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc, emissive: 0x818cf8, emissiveIntensity: 0.9,
      metalness: 0.0, roughness: 0.0, transparent: true, opacity: 0.7,
    });

    ([ [-0.11, 0.13], [0.13, 0.13], [-0.11, -0.13] ] as [number,number][]).forEach(([lx, ly]) => {
      const lz = -(PHONE_D / 2 + 0.044);
      const cx = CAM_X + lx;
      const cy = CAM_Y + ly;

      const ring = new THREE.Mesh(new THREE.BoxGeometry(0.236, 0.236, 0.015), lensRingMat);
      ring.position.set(cx, cy, lz - 0.002);
      phoneGroup.add(ring);

      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.194, 0.194, 0.033), lensMat);
      lens.position.set(cx, cy, lz);
      phoneGroup.add(lens);

      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.102, 0.102, 0.006), lensGlowMat);
      glow.position.set(cx, cy, lz + 0.011);
      phoneGroup.add(glow);
    });

    // Flash LED — white/indigo tint
    const flashLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.13, 0.022),
      new THREE.MeshStandardMaterial({
        color: 0xe0e7ff, emissive: 0xc7d2fe, emissiveIntensity: 0.6,
        metalness: 0.3, roughness: 0.4,
      })
    );
    flashLed.position.set(CAM_X + 0.13, CAM_Y - 0.13, -(PHONE_D / 2 + 0.040));
    phoneGroup.add(flashLed);

    // Side buttons — indigo
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0x4f52e8, metalness: 0.97, roughness: 0.15 });
    const pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.033, 0.33, 0.046), buttonMat);
    pwrBtn.position.set(PHONE_W / 2 + 0.033, 0.41, 0);
    phoneGroup.add(pwrBtn);

    [0.59, 0.15].forEach((y) => {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.033, 0.24, 0.046), buttonMat);
      v.position.set(-(PHONE_W / 2 + 0.033), y, 0);
      phoneGroup.add(v);
    });

    const mute = new THREE.Mesh(new THREE.BoxGeometry(0.033, 0.12, 0.046), buttonMat);
    mute.position.set(-(PHONE_W / 2 + 0.033), 1.20, 0);
    phoneGroup.add(mute);

    // Corner glints — violet/indigo
    const glintMat = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc, emissive: 0x818cf8, emissiveIntensity: 2.5,
    });
    ([[1,1],[1,-1],[-1,1],[-1,-1]] as [number,number][]).forEach(([sx, sy]) => {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.040, 0.025), glintMat);
      g.position.set(sx * (PHONE_W / 2 + 0.009), sy * (PHONE_H / 2 + 0.009), 0);
      phoneGroup.add(g);
    });

    phoneGroup.position.set(2.6, 0.0, 0);
    scene.add(phoneGroup);

    // ---- Floating crystal accents — indigo/violet -------------------------
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, metalness: 0.7, roughness: 0.1,
      transparent: true, opacity: 0.35,
      emissive: 0x4f52e8, emissiveIntensity: 0.3,
    });
    const crystalMat2 = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc, metalness: 0.6, roughness: 0.15,
      transparent: true, opacity: 0.28,
      emissive: 0x818cf8, emissiveIntensity: 0.25,
    });

    interface ShapeEntry {
      mesh: THREE.Mesh;
      wire: THREE.LineSegments;
      phase: number;
      speed: number;
    }
    const shapeData: ShapeEntry[] = [];

    const addShape = (
      geo: THREE.BufferGeometry,
      mat: THREE.MeshStandardMaterial,
      pos: [number, number, number]
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.3 })
      );
      wire.position.copy(mesh.position);
      scene.add(wire);
      shapeData.push({ mesh, wire, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 });
    };

    addShape(new THREE.OctahedronGeometry(0.46),   crystalMat,  [-3.5,  2.2,  1.0]);
    addShape(new THREE.OctahedronGeometry(0.2875),  crystalMat2, [ 5.5,  1.8, -1.5]);
    addShape(new THREE.TetrahedronGeometry(0.4025), crystalMat,  [-4.2, -1.5,  0.5]);
    addShape(new THREE.IcosahedronGeometry(0.345),  crystalMat2, [ 5.0, -1.2,  1.5]);
    addShape(new THREE.OctahedronGeometry(0.207),   crystalMat,  [ 1.0,  3.0, -1.2]);
    addShape(new THREE.TetrahedronGeometry(0.253),  crystalMat2, [ 3.5,  2.8,  0.5]);

    // ---- Particle field — indigo/periwinkle --------------------------------


    // ---- Mouse + resize ----------------------------------------------------
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const isMobile = w < 768;
      const isTablet = w < 1024 && w >= 768;

      camera.aspect = w / h;

      if (isMobile) {
        camera.fov = 55;
        camera.position.set(2.6, 0.5, 11);
        camera.lookAt(2.6, 0, 0);
      } else if (isTablet) {
        camera.fov = 50;
        camera.position.set(3.5, 1.2, 10);
        camera.lookAt(2.2, 0, 0);
      } else {
        camera.fov = 45;
        camera.position.set(4, 1.5, 9);
        camera.lookAt(1.8, 0, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize();

    // ---- Animation loop ----------------------------------------------------
    const TILT_AMP   = 0.30;
    const TILT_SPEED = 0.35;

    let clock  = 0;
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clock += 0.008;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = 4 + targetX * 0.5;
      camera.position.y = 1.2 - targetY * 0.35;
      camera.lookAt(1.8, 0, 0);

      phoneGroup.rotation.y = Math.sin(clock * TILT_SPEED) * TILT_AMP + targetX * 0.08;
      phoneGroup.position.y = Math.sin(clock * 0.7) * 0.14;
      phoneGroup.rotation.x = Math.sin(clock * 0.55) * 0.025 - targetY * 0.03;

      shapeData.forEach((s, i) => {
        const t = clock * s.speed + s.phase;
        s.mesh.position.y += Math.sin(t) * 0.003;
        s.wire.position.y  = s.mesh.position.y;
        s.mesh.rotation.x += 0.004 + i * 0.0008;
        s.mesh.rotation.y += 0.006 + i * 0.001;
        s.wire.rotation.copy(s.mesh.rotation);
      });

      // Pulse indigo fill
      indigoFill.intensity = 10 + Math.sin(clock * 1.6) * 3;



      screenBounce.intensity = 4.0 + Math.sin(clock * 1.4) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
