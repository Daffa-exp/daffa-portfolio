"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Portfolio Screen Canvas Texture
───────────────────────────────────────────── */
function buildScreenTexture(): THREE.CanvasTexture | null {
  if (typeof window === "undefined") return null;
  const W = 1200, H = 780;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // Deep dark bg
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#040812");
  bg.addColorStop(1, "#070d1e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Blue glow center-right
  const glow = ctx.createRadialGradient(800, 390, 20, 800, 390, 500);
  glow.addColorStop(0, "rgba(56,189,248,0.22)");
  glow.addColorStop(0.5, "rgba(99,102,241,0.14)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = "rgba(56,130,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // ─── NAVBAR ───
  ctx.fillStyle = "rgba(8,12,24,0.92)";
  ctx.fillRect(0, 0, W, 52);
  ctx.strokeStyle = "rgba(56,130,255,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 52); ctx.lineTo(W, 52); ctx.stroke();

  // Logo
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 18px monospace";
  ctx.fillText("< daffa />", 28, 33);

  // Nav links
  const navItems = ["home", "about", "skills", "projects", "certificates", "contact"];
  navItems.forEach((item, i) => {
    ctx.fillStyle = item === "home" ? "#38bdf8" : "rgba(148,163,184,0.75)";
    ctx.font = "500 12px sans-serif";
    ctx.fillText(item, 430 + i * 90, 32);
  });

  // GitHub badge
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  roundRect(ctx, 1080, 14, 96, 26, 6);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "11px sans-serif";
  ctx.fillText("⌥ GitHub", 1095, 31);

  // ─── LEFT HERO TEXT ───
  ctx.fillStyle = "rgba(56,189,248,0.9)";
  ctx.font = "700 13px monospace";
  ctx.letterSpacing = "3px";
  ctx.fillText("HELLO, I'M", 60, 120);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 76px system-ui, sans-serif";
  ctx.fillText("Muhamad", 55, 205);

  // Gradient "Daffa"
  const dg = ctx.createLinearGradient(55, 0, 350, 0);
  dg.addColorStop(0, "#38bdf8");
  dg.addColorStop(1, "#a78bfa");
  ctx.fillStyle = dg;
  ctx.font = "900 76px system-ui, sans-serif";
  ctx.fillText("Daffa", 55, 295);

  ctx.fillStyle = "#ffffff";
  ctx.fillText("Permana", 55, 385);

  // Role pill
  ctx.fillStyle = "rgba(56,189,248,0.1)";
  roundRect(ctx, 55, 405, 260, 34, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(56,189,248,0.5)";
  ctx.lineWidth = 1;
  roundRect(ctx, 55, 405, 260, 34, 8);
  ctx.stroke();

  ctx.fillStyle = "#67e8f9";
  ctx.beginPath(); ctx.arc(75, 422, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#e0f2fe";
  ctx.font = "600 13px sans-serif";
  ctx.fillText("Junior Software Developer", 89, 427);

  // Bio text
  ctx.fillStyle = "rgba(148,163,184,0.8)";
  ctx.font = "13px sans-serif";
  ctx.fillText("Pelajar dengan minat mendalam di Software", 55, 470);
  ctx.fillText("Development, khususnya Back-End & Full-Stack.", 55, 490);

  // CTA Buttons
  ctx.fillStyle = "rgba(83,108,255,0.9)";
  roundRect(ctx, 55, 520, 150, 44, 10);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("View Projects ↘", 78, 547);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, 220, 520, 140, 44, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  roundRect(ctx, 220, 520, 140, 44, 10);
  ctx.stroke();
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText("Contact Me ↗", 247, 547);

  // ─── RIGHT PANEL: Project preview card ───
  ctx.fillStyle = "rgba(12,18,35,0.7)";
  roundRect(ctx, 620, 80, 540, 650, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(56,189,248,0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, 620, 80, 540, 650, 18);
  ctx.stroke();

  // Card header
  ctx.fillStyle = "rgba(56,189,248,0.08)";
  ctx.fillRect(620, 80, 540, 52);
  ctx.fillStyle = "#7dd3fc";
  ctx.font = "700 10px monospace";
  ctx.letterSpacing = "2px";
  ctx.fillText("FEATURED PROJECTS", 650, 112);
  ctx.letterSpacing = "0px";

  // Project rows
  const projects = [
    { num: "01", name: "Foodmart", cat: "E-Commerce · Full-Stack", color: "#38bdf8" },
    { num: "02", name: "InstanPage", cat: "SaaS · Website Builder", color: "#818cf8" },
    { num: "03", name: "Pariwisata", cat: "Web Experience", color: "#c084fc" },
  ];

  projects.forEach((p, i) => {
    const y = 165 + i * 165;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    roundRect(ctx, 640, y, 500, 145, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    roundRect(ctx, 640, y, 500, 145, 12);
    ctx.stroke();

    // Accent bar
    ctx.fillStyle = p.color;
    ctx.fillRect(640, y, 3, 145);

    // Number
    ctx.fillStyle = p.color;
    ctx.font = "800 28px monospace";
    ctx.fillText(p.num, 665, y + 46);

    // Name
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "700 22px system-ui";
    ctx.fillText(p.name, 720, y + 46);

    // Category
    ctx.fillStyle = "rgba(148,163,184,0.7)";
    ctx.font = "12px sans-serif";
    ctx.fillText(p.cat, 720, y + 72);

    // Tech chips
    ["Next.js", "React", "TypeScript"].forEach((tech, ti) => {
      const tw = ctx.measureText(tech).width + 16;
      const tx = 720 + ti * (tw + 8);
      ctx.fillStyle = "rgba(56,130,255,0.12)";
      roundRect(ctx, tx, y + 92, tw, 22, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(148,163,184,0.8)";
      ctx.font = "10px monospace";
      ctx.fillText(tech, tx + 8, y + 107);
    });
  });

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
   Floating Neon Ring Pedestal
───────────────────────────────────────────── */
function NeonPedestal() {
  const groupRef = useRef<THREE.Group>(null!);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta * 0.6;
    if (groupRef.current) {
      groupRef.current.rotation.y = t.current * 0.35;
    }
  });

  return (
    <group position={[0, -1.28, 0]}>
      {/* Base disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.8, 3.0, 0.06, 64]} />
        <meshStandardMaterial color="#060b18" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Spinning ring group */}
      <group ref={groupRef}>
        {/* Outer cyan ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.55, 0.03, 16, 128]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Middle violet ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.025, 16, 128]} />
          <meshBasicMaterial color="#a78bfa" />
        </mesh>
        {/* Inner thin ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.85, 0.015, 12, 128]} />
          <meshBasicMaterial color="#818cf8" />
        </mesh>
      </group>

      {/* Glow plane under laptop */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[5.2, 5.2]} />
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   MAIN LAPTOP MESH — Correct open-lid geometry
   Base is flat. Lid hinges from back edge at ~105°
───────────────────────────────────────────── */
function LaptopMesh({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const rootRef = useRef<THREE.Group>(null!);

  // Screen texture built once
  const screenTex = useMemo(() => buildScreenTexture(), []);

  // Materials (memoized)
  const matBody = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0d1120", metalness: 0.88, roughness: 0.18,
    envMapIntensity: 1.2,
  }), []);

  const matBezel = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#06080f", metalness: 0.9, roughness: 0.22,
  }), []);

  const matScreen = useMemo(() => screenTex
    ? new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })
    : new THREE.MeshBasicMaterial({ color: "#0a1628" })
  , [screenTex]);

  const matGlassOverlay = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#38bdf8", transparent: true, opacity: 0.025,
    roughness: 0.05, metalness: 0.0,
  }), []);

  const matKeyDeck = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#090d1a", metalness: 0.75, roughness: 0.35,
  }), []);

  const matKey = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#070a13", metalness: 0.6, roughness: 0.4,
    emissive: "#1e3a8a", emissiveIntensity: 0.4,
  }), []);

  const matAccentCyan = useMemo(() => new THREE.MeshBasicMaterial({ color: "#22d3ee" }), []);
  const matAccentViolet = useMemo(() => new THREE.MeshBasicMaterial({ color: "#a78bfa" }), []);
  const matLogoGlow = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#38bdf8", emissive: "#0ea5e9", emissiveIntensity: 1.2,
    metalness: 0.9, roughness: 0.05,
  }), []);

  // Smooth mouse follow
  const targetRotY = useRef(0);
  const targetRotX = useRef(0);

  useFrame((_, delta) => {
    targetRotY.current = THREE.MathUtils.lerp(targetRotY.current, mouseX * 0.22, 0.04);
    targetRotX.current = THREE.MathUtils.lerp(targetRotX.current, mouseY * -0.10 + 0.08, 0.04);
    if (rootRef.current) {
      rootRef.current.rotation.y = targetRotY.current;
      rootRef.current.rotation.x = targetRotX.current;
    }
  });

  // Keyboard keys grid
  const keys = useMemo(() => {
    const arr: [number, number, number][] = [];
    const cols = 15, rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push([-1.52 + c * 0.22, 0.085, -0.58 + r * 0.23]);
      }
    }
    return arr;
  }, []);

  // Laptop dimensions
  const W = 3.8, D = 2.6, H_BASE = 0.14;
  // Screen lid: hinges from z = -(D/2) of base, rotates back
  // An open angle around 105 degrees back = rotation of (Math.PI - 105deg in rad) from flat
  const LID_ANGLE = -Math.PI * 0.58; // ~104° open from vertical

  return (
    <group ref={rootRef}>
      {/* ─── BASE / KEYBOARD CHASSIS ─── */}
      <group position={[0, 0, 0]}>
        {/* Main body */}
        <mesh material={matBody} castShadow receiveShadow>
          <boxGeometry args={[W, H_BASE, D]} />
        </mesh>

        {/* Keyboard deck inset */}
        <mesh position={[0, H_BASE / 2 + 0.002, -0.18]} material={matKeyDeck}>
          <boxGeometry args={[3.4, 0.008, 1.65]} />
        </mesh>

        {/* Keys */}
        {keys.map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} material={matKey} castShadow>
            <boxGeometry args={[0.18, 0.018, 0.18]} />
          </mesh>
        ))}

        {/* Trackpad */}
        <mesh position={[0, H_BASE / 2 + 0.003, 0.75]} material={matBody}>
          <boxGeometry args={[1.2, 0.006, 0.82]} />
        </mesh>
        <mesh position={[0, H_BASE / 2 + 0.006, 0.75]}>
          <boxGeometry args={[1.14, 0.003, 0.76]} />
          <meshStandardMaterial color="#0a0e1c" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Left RGB accent strip (cyan) */}
        <mesh position={[-W / 2 - 0.008, 0, 0]} material={matAccentCyan}>
          <boxGeometry args={[0.016, H_BASE * 0.6, D * 0.9]} />
        </mesh>

        {/* Right RGB accent strip (violet) */}
        <mesh position={[W / 2 + 0.008, 0, 0]} material={matAccentViolet}>
          <boxGeometry args={[0.016, H_BASE * 0.6, D * 0.9]} />
        </mesh>

        {/* Front edge cyan glow strip */}
        <mesh position={[0, 0, D / 2 + 0.008]}>
          <boxGeometry args={[W * 0.9, 0.006, 0.016]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Hinge bar */}
        <mesh position={[0, H_BASE / 2 + 0.01, -D / 2 + 0.06]}>
          <boxGeometry args={[W * 0.6, 0.03, 0.055]} />
          <meshStandardMaterial color="#1e2740" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Power LED */}
        <mesh position={[W / 2 - 0.18, H_BASE / 2 + 0.01, D / 2 - 0.12]} material={matAccentCyan}>
          <cylinderGeometry args={[0.022, 0.022, 0.006, 16]} />
        </mesh>
      </group>

      {/* ─── SCREEN LID ─── Pivot at back edge of base ─── */}
      {/* Pivot point is at y=0, z= -(D/2) */}
      <group position={[0, 0, -D / 2]}>
        <group rotation={[LID_ANGLE, 0, 0]}>
          {/* Lid outer shell */}
          <mesh position={[0, 1.35, 0]} material={matBody} castShadow>
            <boxGeometry args={[W, 2.5, 0.09]} />
          </mesh>

          {/* Back logo glow */}
          <mesh position={[0, 1.35, -0.048]} rotation={[0, Math.PI, 0]} material={matLogoGlow}>
            <planeGeometry args={[0.7, 0.14]} />
          </mesh>

          {/* Bezel frame */}
          <mesh position={[0, 1.35, 0.048]} material={matBezel}>
            <boxGeometry args={[W - 0.06, 2.44, 0.007]} />
          </mesh>

          {/* ── SCREEN ── */}
          <mesh position={[0, 1.35, 0.052]} material={matScreen}>
            <planeGeometry args={[W - 0.25, 2.2]} />
          </mesh>

          {/* Screen glass shimmer */}
          <mesh position={[0, 1.35, 0.055]} material={matGlassOverlay}>
            <planeGeometry args={[W - 0.25, 2.2]} />
          </mesh>

          {/* Screen edge cyan glow line - top */}
          <mesh position={[0, 2.52, 0.046]}>
            <boxGeometry args={[W * 0.95, 0.012, 0.006]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Screen edge violet glow line - sides */}
          <mesh position={[-W / 2 + 0.02, 1.35, 0.046]}>
            <boxGeometry args={[0.008, 2.44, 0.006]} />
            <meshBasicMaterial color="#a78bfa" />
          </mesh>
          <mesh position={[W / 2 - 0.02, 1.35, 0.046]}>
            <boxGeometry args={[0.008, 2.44, 0.006]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>

          {/* Webcam notch */}
          <mesh position={[0, 2.54, 0.048]}>
            <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
            <meshStandardMaterial color="#050810" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Webcam dot */}
          <mesh position={[0, 2.54, 0.055]}>
            <circleGeometry args={[0.008, 16]} />
            <meshBasicMaterial color="#1e3a5f" />
          </mesh>
        </group>
      </group>

      {/* ─── PEDESTAL ─── */}
      <NeonPedestal />

      {/* ─── LIGHTS ─── */}
      {/* Rim light from left = cyan */}
      <pointLight position={[-5, 4, 2]} intensity={18} color="#38bdf8" distance={12} />
      {/* Rim light from right = violet */}
      <pointLight position={[5, 3, 1]} intensity={14} color="#a78bfa" distance={10} />
      {/* Screen glow fill */}
      <pointLight position={[0, 1.5, 1.5]} intensity={6} color="#4f6ef7" distance={6} />
      {/* Underlight neon */}
      <pointLight position={[0, -1.0, 0]} intensity={8} color="#38bdf8" distance={5} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   Scene wrapper — captures pointer for tilt
───────────────────────────────────────────── */
function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0.3, 1.2, 5.8]} fov={40} />
      <ambientLight intensity={0.35} color="#0a1628" />
      <directionalLight
        position={[3, 8, 6]}
        intensity={2.2}
        color="#c4d4ff"
        castShadow
      />
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.35}>
        <LaptopMesh mouseX={mouseX} mouseY={mouseY} />
      </Float>
    </>
  );
}

/* ─────────────────────────────────────────────
   CSS Fallback
───────────────────────────────────────────── */
function CSSLaptopFallback() {
  return (
    <div className="laptop-css-fallback">
      <div className="css-laptop-lid">
        <div className="css-screen-inner">
          <div className="css-screen-nav">
            <span className="css-logo">&lt; daffa /&gt;</span>
          </div>
          <div className="css-screen-hero">
            <small>HELLO, I&apos;M</small>
            <h2>Muhamad <span>Daffa</span> Permana</h2>
            <p>Junior Software Developer</p>
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

/* ─────────────────────────────────────────────
   PUBLIC EXPORT
───────────────────────────────────────────── */
export function Laptop3D() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const cv = document.createElement("canvas");
      const gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch { setHasWebGL(false); }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setMouseX((e.clientX - cx) / (rect.width / 2));
    setMouseY((e.clientY - cy) / (rect.height / 2));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (!mounted) return <div style={{ height: 560 }} />;
  if (!hasWebGL) return <CSSLaptopFallback />;

  return (
    <div ref={wrapperRef} className="laptop-3d-canvas-wrapper">
      <Canvas
        dpr={[1, Math.min(window.devicePixelRatio, 1.8)]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
        style={{ background: "transparent" }}
      >
        <Scene mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}

export default Laptop3D;
