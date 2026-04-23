"use client";
/**
 * HeroScene3D — VisionTech 3D hero.
 *
 * Phone      : /phone.glb loaded via GLTFLoader (no Draco needed — pure PBR)
 * Interaction: click-drag left/right to spin; release → auto-rotate resumes smoothly
 *              mouse hover applies subtle parallax to camera (background depth)
 * Background : pure deep-space gradient + 1 800-point white star field
 * Accents    : 9 floating geometric shapes (octahedron / icosahedron / tetrahedron)
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
//import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function HeroScene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = false;

    // ── Scene & camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03061a);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      300,
    );
    camera.position.set(0, 0, 11);

    // ── Background gradient plane ─────────────────────────────────────────
    const bgGeo = new THREE.PlaneGeometry(80, 50);
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(0x060d2e) },  // deep navy top
        uMid: { value: new THREE.Color(0x080f22) },  // dark blue-indigo mid
        uBot: { value: new THREE.Color(0x03061a) },  // very dark indigo base
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform vec3 uTop, uMid, uBot;
        varying vec2 vUv;
        void main(){
          float t = vUv.y;
          vec3 col = mix(uBot, uMid, smoothstep(0.0, 0.5, t));
          col = mix(col, uTop, smoothstep(0.5, 1.0, t));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.z = -14;
    bgMesh.renderOrder = -2;
    scene.add(bgMesh);

    // ── Star field ────────────────────────────────────────────────────────
    const STAR_COUNT = 1800;
    const starPos    = new Float32Array(STAR_COUNT * 3);
    const starSizes  = new Float32Array(STAR_COUNT);
    const starBright = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 12;
      starSizes[i]  = Math.random() < 0.92 ? 0.3 + Math.random() * 0.7 : 1.0 + Math.random() * 1.2;
      starBright[i] = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position",   new THREE.BufferAttribute(starPos,    3));
    starGeo.setAttribute("size",       new THREE.BufferAttribute(starSizes,  1));
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
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (280.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vBright;
        uniform float uTime;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          float twinkle = 0.85 + 0.15 * sin(uTime * 1.4 + vBright * 31.4);
          float alpha   = (1.0 - d * 2.0) * twinkle;
          gl_FragColor  = vec4(1.0, 1.0, 1.0, alpha * 0.92);
        }
      `,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x8899cc, 1.8));

    const keyLight = new THREE.DirectionalLight(0xdde8ff, 5.0);
    keyLight.position.set(-4, 6, 9);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9060ff, 3.0);
    rimLight.position.set(6, 2, -6);
    scene.add(rimLight);

    const screenLight = new THREE.PointLight(0xaaccff, 10, 14);
    screenLight.position.set(0, 0, 7);
    scene.add(screenLight);

    const fillLight = new THREE.PointLight(0x4444cc, 4, 16);
    fillLight.position.set(0, -6, 2);
    scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 10, 4);
    scene.add(topLight);

    // ── Geometric accent shapes ───────────────────────────────────────────
    const matIndigo = new THREE.MeshStandardMaterial({
      color: 0x2233cc, metalness: 0.9, roughness: 0.08,
      emissive: 0x3344ff, emissiveIntensity: 0.55,
      transparent: true, opacity: 0.82,
    });
    const matViolet = new THREE.MeshStandardMaterial({
      color: 0x7711cc, metalness: 0.85, roughness: 0.10,
      emissive: 0x9922ee, emissiveIntensity: 0.50,
      transparent: true, opacity: 0.78,
    });
    const matCyan = new THREE.MeshStandardMaterial({
      color: 0x0088bb, metalness: 0.88, roughness: 0.09,
      emissive: 0x00aadd, emissiveIntensity: 0.48,
      transparent: true, opacity: 0.75,
    });
    const wireMat = (col: number) =>
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55 });

    interface Crystal {
      mesh: THREE.Mesh;
      wire: THREE.LineSegments;
      phase: number;
      speed: number;
      rotAxis: THREE.Vector3;
    }
    const crystals: Crystal[] = [];

    const addShape = (
      geo: THREE.BufferGeometry,
      mat: THREE.MeshStandardMaterial,
      wireCol: number,
      pos: [number, number, number],
      initRot: [number, number, number] = [0, 0, 0],
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...initRot);
      scene.add(mesh);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), wireMat(wireCol));
      wire.position.copy(mesh.position);
      wire.rotation.copy(mesh.rotation);
      scene.add(wire);
      const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      crystals.push({ mesh, wire, phase: Math.random() * Math.PI * 2, speed: 0.18 + Math.random() * 0.32, rotAxis: axis });
    };

    // Large anchors
    addShape(new THREE.OctahedronGeometry(0.82),  matIndigo, 0x5566ff, [-5.2,  2.4,  0.5], [0.3, 0.5, 0.1]);
    addShape(new THREE.IcosahedronGeometry(0.68),  matViolet, 0xaa44ff, [ 6.0,  1.8, -1.0], [0.2, 0.8, 0.4]);
    addShape(new THREE.OctahedronGeometry(0.70),  matCyan,   0x22ccff, [-5.5, -2.2,  0.4], [0.6, 0.2, 0.7]);
    // Mid-size
    addShape(new THREE.TetrahedronGeometry(0.52), matViolet, 0xbb55ff, [ 5.5, -2.0,  1.0], [0.4, 1.1, 0.2]);
    addShape(new THREE.IcosahedronGeometry(0.46), matIndigo, 0x4455ff, [ 0.2,  3.6, -0.6], [0.9, 0.3, 0.5]);
    addShape(new THREE.OctahedronGeometry(0.42),  matCyan,   0x33ddff, [ 4.0,  3.2,  0.3], [0.1, 0.7, 0.9]);
    // Small details
    addShape(new THREE.TetrahedronGeometry(0.30), matIndigo, 0x6677ff, [-3.2, -3.2,  0.1], [0.5, 0.4, 0.2]);
    addShape(new THREE.IcosahedronGeometry(0.26), matViolet, 0xcc66ff, [ 6.8, -0.8,  0.8], [0.2, 0.6, 0.8]);
    addShape(new THREE.OctahedronGeometry(0.24),  matCyan,   0x11bbff, [-1.8,  3.0,  1.2], [0.7, 0.1, 0.5]);

    // ── Phone group — populated by GLTFLoader ─────────────────────────────
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(1.8, 0, 0);
    scene.add(phoneGroup);

    let phoneLoaded = false;

    const loader = new GLTFLoader();
    loader.load(
      "/phone.glb",
      (gltf) => {
        const model = gltf.scene;

        // Measure raw bounding box
        const box  = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Scale to ~4.2 units tall
        const scale = 4.2 / size.y;
        model.scale.setScalar(scale);

        // Re-measure and centre at group origin
        box.setFromObject(model);
        const centre = new THREE.Vector3();
        box.getCenter(centre);
        model.position.sub(centre);

        // Enhance materials for the dark space environment
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];

          mats.forEach((mat) => {
            if (!(mat instanceof THREE.MeshStandardMaterial)) return;
            const name = (mat.name || "").toLowerCase();

            mat.envMapIntensity = 2.5;
            mat.needsUpdate = true;

            if (name.includes("display")) {
              mat.emissive = new THREE.Color(0x1a3a7a);
              mat.emissiveIntensity = 0.9;
            }
            if (name.includes("frame") || name.includes("aluminum")) {
              mat.metalness = Math.min(mat.metalness + 0.1, 1.0);
              mat.roughness = Math.max(mat.roughness - 0.1, 0.02);
            }
            if (name.includes("glass") || name.includes("tint")) {
              mat.color = new THREE.Color(0x8899cc);
            }
            if (name.includes("lens") || name.includes("camera")) {
              mat.roughness = 0.02;
              mat.metalness = 0.1;
            }
          });
        });

        phoneGroup.add(model);
        phoneLoaded = true;
      },
      undefined,
      (err) => console.error("GLB load error:", err),
    );

    // ── Drag interaction state ────────────────────────────────────────────
    let isDragging   = false;
    let dragStartX   = 0;
    let dragStartRot = 0;
    let dragDelta    = 0;
    let releaseVel   = 0;
    let autoRotY     = 0;

    let mouseX = 0, mouseY = 0;
    let camTargetX = 0, camTargetY = 0;

    const getEventX = (e: MouseEvent | TouchEvent): number =>
      "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging   = true;
      dragStartX   = getEventX(e);
      dragStartRot = phoneGroup.rotation.y;
      releaseVel   = 0;
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) {
        if ("clientX" in e) {
          mouseX = ((e as MouseEvent).clientX / window.innerWidth  - 0.5) * 2;
          mouseY = ((e as MouseEvent).clientY / window.innerHeight - 0.5) * 2;
        }
        return;
      }
      const dx = getEventX(e) - dragStartX;
      dragDelta = dx * 0.008;
      phoneGroup.rotation.y = dragStartRot + dragDelta;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      autoRotY   = phoneGroup.rotation.y;
      releaseVel = dragDelta * 0.06;
      canvas.style.cursor = "grab";
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown",  onPointerDown as EventListener);
    canvas.addEventListener("touchstart", onPointerDown as EventListener, { passive: true });
    window.addEventListener("mousemove",  onPointerMove as EventListener);
    window.addEventListener("touchmove",  onPointerMove as EventListener, { passive: true });
    window.addEventListener("mouseup",    onPointerUp);
    window.addEventListener("touchend",   onPointerUp);

    // ── Resize ────────────────────────────────────────────────────────────
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

      starMat.uniforms.uTime.value = clock;

      // Camera parallax from mouse (subtle — moves background, not phone)
      camTargetX += (mouseX - camTargetX) * 0.025;
      camTargetY += (mouseY - camTargetY) * 0.025;
      camera.position.x = camTargetX * 0.8;
      camera.position.y = -camTargetY * 0.5;
      camera.lookAt(phoneGroup.position);

      // Phone rotation
      if (!isDragging) {
        if (Math.abs(releaseVel) > 0.0001) {
          autoRotY  += releaseVel;
          releaseVel *= 0.92;       // friction decay
        } else {
          autoRotY += 0.006;        // steady auto-rotate
        }
        phoneGroup.rotation.y = autoRotY;
      }
      // Vertical float + subtle tilt (always active)
      phoneGroup.position.y = Math.sin(clock * 0.55) * 0.15;
      phoneGroup.rotation.x = Math.sin(clock * 0.40) * 0.035;

      // Screen glow pulse
      screenLight.intensity = 9 + Math.sin(clock * 1.4) * 1.5;

      // Stars slow drift
      stars.rotation.y = clock * 0.005;

      // Geometric accents
      crystals.forEach((c) => {
        const t = clock * c.speed + c.phase;
        c.mesh.position.y += Math.sin(t) * 0.0016;
        c.wire.position.y  = c.mesh.position.y;
        c.mesh.rotateOnAxis(c.rotAxis, 0.004);
        c.wire.rotation.copy(c.mesh.rotation);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousedown",  onPointerDown as EventListener);
      canvas.removeEventListener("touchstart", onPointerDown as EventListener);
      window.removeEventListener("mousemove",  onPointerMove as EventListener);
      window.removeEventListener("touchmove",  onPointerMove as EventListener);
      window.removeEventListener("mouseup",    onPointerUp);
      window.removeEventListener("touchend",   onPointerUp);
      window.removeEventListener("resize",     onResize);
      renderer.dispose();
      starGeo.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}