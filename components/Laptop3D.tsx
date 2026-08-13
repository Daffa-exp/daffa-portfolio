"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ── Screen Texture Generator (Procedural Canvas for Laptop Display) ──
function usePortfolioScreenTexture() {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
    bgGrad.addColorStop(0, "#050914");
    bgGrad.addColorStop(0.5, "#0a0f26");
    bgGrad.addColorStop(1, "#070b1a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 640);

    // Glowing aura background inside screen
    const aura = ctx.createRadialGradient(700, 320, 20, 700, 320, 400);
    aura.addColorStop(0, "rgba(57, 160, 255, 0.25)");
    aura.addColorStop(0.5, "rgba(138, 92, 255, 0.15)");
    aura.addColorStop(1, "rgba(5, 9, 20, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, 1024, 640);

    // Decorative grid lines inside screen
    ctx.strokeStyle = "rgba(75, 120, 255, 0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y < 640; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Top Navbar inside screen
    ctx.fillStyle = "rgba(12, 18, 40, 0.8)";
    ctx.fillRect(40, 30, 944, 48);
    ctx.strokeStyle = "rgba(60, 110, 255, 0.25)";
    ctx.strokeRect(40, 30, 944, 48);

    // Logo text
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px monospace";
    ctx.fillText("< daffa />", 65, 60);

    // Nav items
    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    const navs = ["home", "about", "skills", "projects", "certificates", "contact"];
    navs.forEach((item, i) => {
      ctx.fillStyle = item === "home" ? "#38bdf8" : "#94a3b8";
      ctx.fillText(item, 480 + i * 75, 59);
    });

    // GitHub badge top right
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(890, 40, 80, 28);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px sans-serif";
    ctx.fillText("GitHub", 910, 58);

    // Left Column Hero Text
    ctx.fillStyle = "#38bdf8";
    ctx.font = "600 14px monospace";
    ctx.fillText("HELLO, I'M", 70, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 48px system-ui, sans-serif";
    ctx.fillText("Muhamad", 70, 210);

    const textGrad = ctx.createLinearGradient(70, 0, 300, 0);
    textGrad.addColorStop(0, "#38bdf8");
    textGrad.addColorStop(1, "#818cf8");
    ctx.fillStyle = textGrad;
    ctx.fillText("Daffa", 70, 270);

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Permana", 70, 330);

    // Role badge
    ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
    ctx.fillRect(70, 355, 220, 32);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.strokeRect(70, 355, 220, 32);

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(85, 371, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e0f2fe";
    ctx.font = "500 13px sans-serif";
    ctx.fillText("Junior Software Developer", 97, 375);

    // Bio paragraph
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("Pelajar dengan minat mendalam di Software Development,", 70, 420);
    ctx.fillText("khususnya Back-End Development & Full-Stack Web.", 70, 442);

    // Buttons
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(70, 480, 130, 42);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("View Projects ↘", 86, 506);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(215, 480, 130, 42);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(215, 480, 130, 42);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText("Contact Me ↗", 238, 506);

    // Right Column Preview graphic inside screen
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(560, 130, 390, 410);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.strokeRect(560, 130, 390, 410);

    // Card inside screen preview
    ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
    ctx.fillRect(585, 160, 340, 200);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Featured Project: Foodmart", 605, 195);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.fillText("Full-Stack Web Pemesanan Makanan Online", 605, 220);

    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.fillRect(605, 240, 300, 100);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Next.js • Node.js • Express • Tailwind CSS", 620, 295);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

// ── 3D Gaming Laptop Mesh (Acer Nitro Inspired) ──
function LaptopMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const lidRef = useRef<THREE.Group>(null!);
  const screenTexture = usePortfolioScreenTexture();

  // Mouse tilt lerp
  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    // Smooth lerp for rotation & float
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.28 - 0.25, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.15 + 0.18, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(state.clock.elapsedTime * 1.5) * 0.08, 0.05);
  });

  // Metallic Materials
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f131f",
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  const bezelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#080a10",
        metalness: 0.9,
        roughness: 0.3,
      }),
    []
  );

  const keyboardDeckMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#121726",
        metalness: 0.7,
        roughness: 0.4,
      }),
    []
  );

  const keyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0b0d14",
        emissive: "#1e3a8a",
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.5,
      }),
    []
  );

  const logoMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: "#0284c7",
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1,
      }),
    []
  );

  const screenMaterial = useMemo(() => {
    if (!screenTexture) {
      return new THREE.MeshBasicMaterial({ color: "#060913" });
    }
    return new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
  }, [screenTexture]);

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} rotation={[0.18, -0.25, 0]}>
      {/* ── LAPTOP BASE (KEYBOARD CHASSIS) ── */}
      <group position={[0, -0.1, 0]}>
        {/* Main Base Body */}
        <mesh material={baseMaterial} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.15, 2.5]} />
        </mesh>

        {/* Keyboard Deck Inset */}
        <mesh position={[0, 0.076, -0.2]} material={keyboardDeckMaterial}>
          <boxGeometry args={[3.4, 0.01, 1.4]} />
        </mesh>

        {/* Individual Key Blocks (Procedural Keyboard Grid) */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <mesh
              key={`key-${row}-${col}`}
              position={[-1.5 + col * 0.23, 0.09, -0.75 + row * 0.24]}
              material={keyMaterial}
            >
              <boxGeometry args={[0.2, 0.02, 0.2]} />
            </mesh>
          ))
        )}

        {/* Trackpad */}
        <mesh position={[0, 0.077, 0.65]} material={baseMaterial}>
          <boxGeometry args={[1.1, 0.005, 0.8]} />
        </mesh>

        {/* Power LED Indicator */}
        <mesh position={[1.5, 0.08, -0.85]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Acer Logo on Base Hinge Area */}
        <mesh position={[0, 0.08, -1.1]} material={logoMaterial}>
          <planeGeometry args={[0.4, 0.08]} />
        </mesh>

        {/* Side Ports Accent */}
        <mesh position={[-1.91, 0, 0]}>
          <boxGeometry args={[0.02, 0.06, 1.2]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[1.91, 0, 0]}>
          <boxGeometry args={[0.02, 0.06, 1.2]} />
          <meshBasicMaterial color="#7c3aed" />
        </mesh>
      </group>

      {/* ── LAPTOP SCREEN LID (HINGE TILT) ── */}
      <group ref={lidRef} position={[0, -0.025, -1.25]} rotation={[-1.85, 0, 0]}>
        {/* Lid Outer Shell */}
        <mesh position={[0, 1.25, 0]} material={baseMaterial} castShadow>
          <boxGeometry args={[3.8, 2.5, 0.08]} />
        </mesh>

        {/* Lid Acer Nitro Back Logo */}
        <mesh position={[0, 1.25, -0.042]} rotation={[0, Math.PI, 0]} material={logoMaterial}>
          <planeGeometry args={[0.6, 0.12]} />
        </mesh>

        {/* Screen Bezel Frame */}
        <mesh position={[0, 1.25, 0.042]} material={bezelMaterial}>
          <boxGeometry args={[3.74, 2.44, 0.01]} />
        </mesh>

        {/* DISPLAY SCREEN CANVAS / TEXTURE */}
        <mesh position={[0, 1.25, 0.048]} material={screenMaterial}>
          <planeGeometry args={[3.55, 2.25]} />
        </mesh>

        {/* Screen Glass Glow Overlay */}
        <mesh position={[0, 1.25, 0.05]}>
          <planeGeometry args={[3.55, 2.25]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.08}
            roughness={0.1}
            transmission={0.9}
            color="#38bdf8"
          />
        </mesh>

        {/* Webcam Dot */}
        <mesh position={[0, 2.41, 0.049]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ── GLOWING CYCLIC PEDESTAL / RING PLATFORM (ACER NITRO STYLE) ── */}
      <group position={[0, -0.65, 0]}>
        {/* Outer Ring Pedestal */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.3, 64]} />
          <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
        {/* Inner Neon Purple Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.7, 1.8, 64]} />
          <meshBasicMaterial color="#8b5cf6" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        {/* Solid Base Cylinder */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[2.2, 2.4, 0.1, 64]} />
          <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* ACER NITRO Glowing Badge on Pedestal */}
        <mesh position={[0, 0.01, 2.25]} rotation={[-Math.PI / 6, 0, 0]}>
          <planeGeometry args={[1.2, 0.22]} />
          <meshBasicMaterial color="#0369a1" />
        </mesh>
      </group>
    </group>
  );
}

// ── WebGL Fallback CSS Mockup Component ──
function LaptopFallback() {
  return (
    <div className="laptop-fallback-container">
      <div className="laptop-fallback-body">
        <div className="laptop-fallback-screen">
          <div className="fallback-screen-header">
            <span className="fallback-logo">&lt; daffa /&gt;</span>
            <div className="fallback-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
          </div>
          <div className="fallback-screen-content">
            <span className="eyebrow">HELLO, I'M</span>
            <h2>Muhamad Daffa Permana</h2>
            <span className="role-tag">• Junior Software Developer</span>
            <p>Full-Stack Web &amp; Back-End Developer</p>
          </div>
        </div>
        <div className="laptop-fallback-keyboard" />
        <div className="laptop-fallback-glow" />
      </div>
    </div>
  );
}

// ── Main Exported 3D Laptop Component ──
export function Laptop3D() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!isMounted) return null;

  if (!hasWebGL) {
    return <LaptopFallback />;
  }

  return (
    <div className="laptop-3d-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0.6, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#e0f2fe" castShadow />
        <pointLight position={[-4, 3, -2]} intensity={2.5} color="#0284c7" />
        <pointLight position={[4, 2, 2]} intensity={2.8} color="#8b5cf6" />
        <spotLight
          position={[0, 6, 3]}
          intensity={3}
          color="#38bdf8"
          angle={0.6}
          penumbra={0.8}
        />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <LaptopMesh />
        </Float>
      </Canvas>
    </div>
  );
}

export default Laptop3D;
