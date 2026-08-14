"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Atmospheric Particles (WebGL Point Field)
   Organic 3D dust drifting around the scene
───────────────────────────────────────────── */
function AtmosphericParticles({ count = 150 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical/box boundary around the laptop
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      sp[i] = 0.05 + Math.random() * 0.15;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, sp, ph];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      // Drifts upwards
      y -= speeds[i] * delta * 5;
      if (y < -4) {
        y = 4; // Reset to top
      }
      posAttr.setY(i, y);

      // Add slight organic horizontal sway
      let x = posAttr.getX(i);
      x += Math.sin(time * 0.5 + phases[i]) * 0.001;
      posAttr.setX(i, x);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={0.038}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────
   Portfolio Screen Canvas Texture
   Pre-renders a futuristic high-fidelity portfolio screen
───────────────────────────────────────────── */
function buildScreenTexture(): THREE.CanvasTexture | null {
  if (typeof window === "undefined") return null;
  const W = 1200, H = 780;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // Deep solid background
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, W, H);

  // Volumetric blue glow center
  const glow = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 600);
  glow.addColorStop(0, "rgba(56, 189, 248, 0.25)");
  glow.addColorStop(0.5, "rgba(99, 102, 241, 0.12)");
  glow.addColorStop(1, "rgba(3, 7, 18, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Futuristic tech grid overlay
  ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
  ctx.lineWidth = 1.2;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Header Nav Bar
  ctx.fillStyle = "rgba(10, 15, 30, 0.9)";
  ctx.fillRect(0, 0, W, 60);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(W, 60); ctx.stroke();

  // Branding
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 20px monospace";
  ctx.fillText("< DAFFA PERMANA />", 40, 38);

  // Nav Items
  const navItems = ["Home", "Case Studies", "Stack", "Milestones", "Certificates", "Connect"];
  navItems.forEach((nav, i) => {
    ctx.fillStyle = i === 0 ? "#38bdf8" : "rgba(148, 163, 184, 0.8)";
    ctx.font = "600 13px sans-serif";
    ctx.fillText(nav, 500 + i * 100, 36);
  });

  // ─── HERO SECTION COPY (Left) ───
  ctx.fillStyle = "#38bdf8";
  ctx.font = "700 13px monospace";
  ctx.fillText("CREATIVE SOFTWARE ENGINEER", 80, 160);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 80px sans-serif";
  ctx.fillText("Designing", 80, 250);

  const gradient = ctx.createLinearGradient(80, 0, 400, 0);
  gradient.addColorStop(0, "#38bdf8");
  gradient.addColorStop(1, "#818cf8");
  ctx.fillStyle = gradient;
  ctx.fillText("Interactive", 80, 340);

  ctx.fillStyle = "#ffffff";
  ctx.fillText("Experiences.", 80, 430);

  // Status Indicator
  ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
  roundRect(ctx, 80, 470, 240, 36, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.stroke();
  ctx.fillStyle = "#10b981";
  ctx.beginPath(); ctx.arc(100, 488, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Available for collaborations", 116, 492);

  // Brief description
  ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
  ctx.font = "14px sans-serif";
  ctx.fillText("Specialized in building fullstack digital products,", 80, 550);
  ctx.fillText("desktop interfaces, and immersive WebGL solutions.", 80, 575);

  // CTA
  ctx.fillStyle = "#3b82f6";
  roundRect(ctx, 80, 620, 160, 44, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Explore Projects ↗", 102, 647);

  // ─── PREVIEW INTERACTION (Right) ───
  ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
  roundRect(ctx, 640, 120, 480, 560, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
  ctx.stroke();

  // Glass card structure
  ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
  roundRect(ctx, 670, 150, 420, 280, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.stroke();

  // Foodmart Card preview
  ctx.fillStyle = "#38bdf8";
  ctx.font = "800 24px sans-serif";
  ctx.fillText("01 / FOODMART", 700, 200);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px sans-serif";
  ctx.fillText("Interactive E-Commerce Platform", 700, 230);
  ctx.fillText("Clean layouts, dashboard panels, stripe gateways.", 700, 255);

  // Code snippet graphic
  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  roundRect(ctx, 700, 290, 360, 110, 8);
  ctx.fill();
  ctx.fillStyle = "#60a5fa";
  ctx.font = "12px monospace";
  ctx.fillText("const Foodmart = () => {", 720, 320);
  ctx.fillStyle = "#34d399";
  ctx.fillText("  return <InteractiveCart online={true} />", 720, 345);
  ctx.fillStyle = "#60a5fa";
  ctx.fillText("};", 720, 370);

  // Other stack pills list
  const techStack = ["Next.js", "Express", "Supabase", "Three.js", "Prisma"];
  techStack.forEach((stack, idx) => {
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    roundRect(ctx, 670 + idx * 82, 460, 76, 26, 6);
    ctx.fill();
    ctx.fillStyle = "#e0f2fe";
    ctx.font = "600 11px monospace";
    ctx.fillText(stack, 680 + idx * 82, 477);
  });

  // Graphics waveform
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let step = 0; step < 420; step += 10) {
    const py = 590 + Math.sin(step * 0.05) * 20 + Math.cos(step * 0.1) * 10;
    if (step === 0) ctx.moveTo(670 + step, py);
    else ctx.lineTo(670 + step, py);
  }
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─────────────────────────────────────────────
   Spinning Pedestal Ring
───────────────────────────────────────────── */
function NeonPedestal() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.18;
    }
  });

  return (
    <group position={[0, -1.25, 0]}>
      {/* Dark physical solid cylinder base */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[2.7, 2.9, 0.08, 64]} />
        <meshStandardMaterial color="#050811" metalness={0.92} roughness={0.16} />
      </mesh>

      {/* Rotating concentric glowing rings */}
      <group ref={groupRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.45, 0.024, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <torusGeometry args={[2.1, 0.016, 12, 80]} />
          <meshBasicMaterial color="#818cf8" />
        </mesh>
      </group>

      {/* Atmospheric underglow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[4.8, 4.8]} />
        <meshBasicMaterial color="#060c24" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   3D Laptop Mesh
───────────────────────────────────────────── */
function LaptopMesh({
  mouseX,
  mouseY,
  scrollProgress,
}: {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}) {
  const rootRef = useRef<THREE.Group>(null!);

  const screenTex = useMemo(() => buildScreenTexture(), []);

  // Sleek metallic bodies & parts
  const matBody = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0c0f1d",
    metalness: 0.9,
    roughness: 0.22,
    envMapIntensity: 1.5,
  }), []);

  const matBezel = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#05070e",
    metalness: 0.8,
    roughness: 0.3,
  }), []);

  const matScreen = useMemo(() => screenTex
    ? new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })
    : new THREE.MeshBasicMaterial({ color: "#020617" })
  , [screenTex]);

  const matGlass = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#38bdf8",
    transparent: true,
    opacity: 0.04,
    roughness: 0.08,
    metalness: 0.1,
  }), []);

  const matKeyDeck = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#090d16",
    metalness: 0.8,
    roughness: 0.38,
  }), []);

  const matKey = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#04060b",
    metalness: 0.5,
    roughness: 0.45,
    emissive: "#3b82f6",
    emissiveIntensity: 0.32,
  }), []);

  const matGlowCyan = useMemo(() => new THREE.MeshBasicMaterial({ color: "#00f0ff" }), []);
  const matGlowViolet = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8b5cf6" }), []);

  // Animate angles using mouse position & scroll depth
  useFrame((_, delta) => {
    if (!rootRef.current) return;
    
    // Custom rotation target combining mouse position & scroll progress
    // At scrollProgress = 0, slant-front perspective view
    // As user scrolls, pivot laptop slightly to showcase side design
    const targetY = mouseX * 0.25 - 0.2 - scrollProgress * 0.6;
    const targetX = mouseY * -0.12 + 0.12 + scrollProgress * 0.2;
    const targetZ = scrollProgress * -0.15;

    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetY, 0.05);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetX, 0.05);
    rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, targetZ, 0.05);

    // Subtle drift float
    rootRef.current.position.y = THREE.MathUtils.lerp(
      rootRef.current.position.y,
      Math.sin(performance.now() * 0.0012) * 0.06 - scrollProgress * 0.5,
      0.05
    );
  });

  const W = 3.8, D = 2.6, H = 0.14;
  const LID_OPEN_ANGLE = -Math.PI * 0.575; // ~103° open angle

  const keysGrid = useMemo(() => {
    const keys: [number, number, number][] = [];
    const cols = 15, rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        keys.push([-1.5 + c * 0.215, H / 2 + 0.015, -0.6 + r * 0.23]);
      }
    }
    return keys;
  }, []);

  return (
    <group ref={rootRef}>
      {/* ─── BASE CHASSIS ─── */}
      <group position={[0, 0, 0]}>
        <mesh material={matBody} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
        </mesh>
        
        {/* Trackpad */}
        <mesh position={[0, H / 2 + 0.002, 0.72]} material={matBody}>
          <boxGeometry args={[1.2, 0.004, 0.8]} />
        </mesh>
        <mesh position={[0, H / 2 + 0.005, 0.72]}>
          <boxGeometry args={[1.15, 0.002, 0.75]} />
          <meshStandardMaterial color="#05070e" metalness={0.8} roughness={0.1} />
        </mesh>

        {/* Keyboard deck inset area */}
        <mesh position={[0, H / 2 + 0.002, -0.2]} material={matKeyDeck}>
          <boxGeometry args={[3.36, 0.006, 1.62]} />
        </mesh>

        {/* Keys grid */}
        {keysGrid.map(([kx, ky, kz], idx) => (
          <mesh key={idx} position={[kx, ky, kz]} material={matKey} castShadow>
            <boxGeometry args={[0.18, 0.014, 0.18]} />
          </mesh>
        ))}

        {/* Side RGB Glow Ports */}
        <mesh position={[-W / 2 - 0.006, 0, 0.1]} material={matGlowCyan}>
          <boxGeometry args={[0.012, 0.05, 1.1]} />
        </mesh>
        <mesh position={[W / 2 + 0.006, 0, 0.1]} material={matGlowViolet}>
          <boxGeometry args={[0.012, 0.05, 1.1]} />
        </mesh>

        {/* Power switch */}
        <mesh position={[W / 2 - 0.2, H / 2 + 0.008, -D / 2 + 0.2]} material={matGlowCyan}>
          <cylinderGeometry args={[0.024, 0.024, 0.006, 16]} />
        </mesh>
      </group>

      {/* ─── HINGED LID (SCREEN) ─── */}
      <group position={[0, 0, -D / 2]}>
        <group rotation={[LID_OPEN_ANGLE, 0, 0]}>
          {/* Outer case lid */}
          <mesh position={[0, 1.25, 0]} material={matBody} castShadow>
            <boxGeometry args={[W, 2.5, 0.09]} />
          </mesh>

          {/* Hologram style glowing logo back */}
          <mesh position={[0, 1.25, -0.048]} rotation={[0, Math.PI, 0]} material={matGlowCyan}>
            <planeGeometry args={[0.6, 0.12]} />
          </mesh>

          {/* Internal Bezel Frame */}
          <mesh position={[0, 1.25, 0.048]} material={matBezel}>
            <boxGeometry args={[W - 0.08, 2.42, 0.008]} />
          </mesh>

          {/* Interactive Screen Display */}
          <mesh position={[0, 1.25, 0.052]} material={matScreen}>
            <planeGeometry args={[W - 0.24, 2.18]} />
          </mesh>

          {/* Semi-reflective screen glass */}
          <mesh position={[0, 1.25, 0.055]} material={matGlass}>
            <planeGeometry args={[W - 0.24, 2.18]} />
          </mesh>

          {/* Glow lights bordering the lid bezel */}
          <mesh position={[0, 2.48, 0.046]}>
            <boxGeometry args={[W - 0.24, 0.01, 0.006]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[-W / 2 + 0.03, 1.25, 0.046]}>
            <boxGeometry args={[0.008, 2.3, 0.006]} />
            <meshBasicMaterial color="#818cf8" />
          </mesh>
          <mesh position={[W / 2 - 0.03, 1.25, 0.046]}>
            <boxGeometry args={[0.008, 2.3, 0.006]} />
            <meshBasicMaterial color="#818cf8" />
          </mesh>

          {/* Camera lens notch */}
          <mesh position={[0, 2.48, 0.054]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#0b1329" />
          </mesh>
        </group>
      </group>

      {/* ─── NEON PEDESTAL BASE ─── */}
      <NeonPedestal />
    </group>
  );
}

/* ─────────────────────────────────────────────
   Main 3D Canvas
───────────────────────────────────────────── */
export function Laptop3D() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const cv = document.createElement("canvas");
      const gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    // Scale coords between [-1, 1]
    setMouseX((e.clientX - cx) / (rect.width / 2));
    setMouseY((e.clientY - cy) / (rect.height / 2));
  }, []);

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    setScrollProgress(window.scrollY / totalHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  if (!mounted) return <div style={{ height: 600 }} />;
  
  // Custom Fallback CSS rendering
  if (!hasWebGL) {
    return (
      <div className="laptop-css-fallback">
        <div className="css-laptop-lid">
          <div className="css-screen-inner">
            <div className="css-screen-nav">
              <span className="css-logo">&lt; daffa /&gt;</span>
            </div>
            <div className="css-screen-hero">
              <small>CREATIVE DEVELOPER</small>
              <h2>Designing <span>Interactive</span> Experiences.</h2>
              <p>Specialized in building fullstack digital applications.</p>
            </div>
          </div>
        </div>
        <div className="css-laptop-base">
          <div className="css-keyboard" />
          <div className="css-trackpad" />
        </div>
        <div className="css-pedestal-ring ring-outer" />
        <div className="css-pedestal-ring ring-inner" />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="laptop-3d-canvas-wrapper">
      <Canvas
        dpr={[1, Math.min(window.devicePixelRatio, 1.8)]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0.4, 1.1, 5.8]} fov={38} />
        
        {/* Cinematic environmental lights */}
        <ambientLight intensity={0.42} color="#0d1b3e" />
        <directionalLight
          position={[4, 10, 5]}
          intensity={2.0}
          color="#c1d5ff"
          castShadow
        />
        
        {/* WebGL Drifting space dust particles */}
        <AtmosphericParticles count={140} />

        <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.3}>
          <LaptopMesh mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />
        </Float>
      </Canvas>
    </div>
  );
}

export default Laptop3D;
