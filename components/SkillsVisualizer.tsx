"use client";

import React, { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  group: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  color: string;
}

export function SkillsVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const skillsData = [
      { name: "Next.js", group: "Frontend", desc: "React framework for production" },
      { name: "React", group: "Frontend", desc: "UI development library" },
      { name: "TypeScript", group: "Languages", desc: "Typed JavaScript" },
      { name: "JavaScript", group: "Languages", desc: "Interactive web logic" },
      { name: "Express.js", group: "Backend", desc: "Node.js API framework" },
      { name: "Node.js", group: "Backend", desc: "Server runtime environment" },
      { name: "Python", group: "Languages", desc: "AI & tooling scripts" },
      { name: "Supabase", group: "Database", desc: "BaaS backend platform" },
      { name: "Firebase", group: "Database", desc: "Realtime database solutions" },
      { name: "MySQL", group: "Database", desc: "Relational storage systems" },
      { name: "Tailwind CSS", group: "Design", desc: "Utility-first CSS styling" },
      { name: "AI-assisted dev", group: "Workflow", desc: "Optimizing development speeds" },
    ];

    // Colors mapping to group
    const groupColors: Record<string, string> = {
      Frontend: "#38bdf8", // Electric Cyan
      Backend: "#818cf8",  // Subtle Indigo
      Languages: "#a78bfa", // Soft Purple
      Database: "#2dd4bf",  // Mint Green
      Design: "#fb7185",    // Rose
      Workflow: "#34d399",  // Emerald
    };

    // Initialize nodes
    const nodes: Node[] = skillsData.map((s, idx) => {
      // Circle layout with random noise
      const angle = (idx / skillsData.length) * Math.PI * 2;
      const radiusDist = Math.min(width, height) * 0.32;
      const x = width / 2 + Math.cos(angle) * radiusDist + (Math.random() - 0.5) * 50;
      const y = height / 2 + Math.sin(angle) * radiusDist + (Math.random() - 0.5) * 50;
      return {
        id: s.name,
        label: s.name,
        group: s.group,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 4,
        targetRadius: 4,
        color: groupColors[s.group] || "#ffffff",
      };
    });

    let mouseX = 0;
    let mouseY = 0;
    let isMouseIn = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseIn = true;
    };

    const handleMouseLeave = () => {
      isMouseIn = false;
      setHoveredSkill(null);
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw central core hub
      const centerX = width / 2;
      const centerY = height / 2;
      
      const hubPulse = 40 + Math.sin(Date.now() * 0.002) * 5;
      
      // Core hub glow
      const hubGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, hubPulse * 2.5);
      hubGlow.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      hubGlow.addColorStop(0.5, "rgba(129, 140, 248, 0.05)");
      hubGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = hubGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubPulse * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Core hub circle
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubPulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CORE ENGINE", centerX, centerY);

      // 2. Update and draw nodes
      let activeSkillName: string | null = null;

      nodes.forEach((node) => {
        // Subtle drift movement
        node.x += node.vx;
        node.y += node.vy;

        // Boundaries repulsion
        if (node.x < 40 || node.x > width - 40) node.vx *= -1;
        if (node.y < 40 || node.y > height - 40) node.vy *= -1;

        // Pull towards target/center bounds
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(width, height) * 0.45;
        if (distToCenter > maxDist) {
          node.vx -= (dx / distToCenter) * 0.005;
          node.vy -= (dy / distToCenter) * 0.005;
        }

        // Mouse hover interaction
        const mdx = node.x - mouseX;
        const mdy = node.y - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (isMouseIn && mDist < 60) {
          node.targetRadius = 10;
          activeSkillName = node.label;
          // Pull node slightly towards cursor
          node.x = lerp(node.x, mouseX, 0.08);
          node.y = lerp(node.y, mouseY, 0.08);
        } else {
          node.targetRadius = 4.5;
        }

        node.radius = lerp(node.radius, node.targetRadius, 0.1);

        // Draw connections back to core hub
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();

        // Connect nearby nodes
        nodes.forEach((other) => {
          if (other.id === node.id) return;
          const odx = node.x - other.x;
          const ody = node.y - other.y;
          const oDist = Math.sqrt(odx * odx + ody * ody);
          if (oDist < 120) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - oDist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Draw node center point
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw node glow when hovered
        if (node.radius > 6) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw node text label
        ctx.fillStyle = node.radius > 6 ? "#ffffff" : "rgba(255, 255, 255, 0.8)";
        ctx.font = node.radius > 6 ? "bold 13px Manrope" : "500 11px Manrope";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.label, node.x, node.y + node.radius + 6);
      });

      if (activeSkillName !== hoveredSkill) {
        setHoveredSkill(activeSkillName);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [hoveredSkill]);

  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  return (
    <div ref={containerRef} className="skills-visual-box">
      <canvas ref={canvasRef} className="skills-canvas-surface" />
      <div className="skills-overlay-details">
        <h4>Interactive Skill Matrix</h4>
        <p className="skills-guide-text">
          {hoveredSkill ? (
            <span className="skills-highlight">
              Active: <strong>{hoveredSkill}</strong>
            </span>
          ) : (
            "Hover nodes to inspect architecture components"
          )}
        </p>
      </div>
    </div>
  );
}

export default SkillsVisualizer;
