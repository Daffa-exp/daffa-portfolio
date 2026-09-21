"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Terminal, Check, Copy, Sparkles, Layers } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/types";

export function HeroVisual({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false);
  const cover = project.coverImage || (project.galleryImages && project.galleryImages[0]) || "/assets/projects/foodmart/1.webp";
  const name = project.title;

  const codeSnippet = `// Huly-style Developer Profile
import { Developer } from "@daffa/core";

export const daffa = new Developer({
  name: "Muhamad Daffa Permana",
  role: "Full-Stack Developer",
  school: "SMKN 1 Cisarua (RPL)",
  stack: ["Next.js", "Express.js", "Node.js", "Prisma"],
  status: "open_for_collaboration"
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="huly-hero-visual" aria-label="Huly-style cosmic workspace developer visual">
      {/* Warm corner glow for depth */}
      <div className="huly-visual-warm-glow" />

      {/* Layer 1: Code / Profile Panel */}
      <motion.div
        className="huly-code-panel"
        initial={{ opacity: 0, y: 20, rotateX: 4, rotateY: -4 }}
        animate={{ opacity: 1, y: 0, rotateX: 2, rotateY: -2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ rotateX: 0, rotateY: 0, y: -4 }}
      >
        <div className="huly-code-header">
          <div className="huly-code-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="huly-code-tab">
            <Terminal size={12} className="text-iris" />
            <span>daffa.profile.ts</span>
          </div>
          <button
            className="huly-copy-btn"
            onClick={copyCode}
            aria-label="Copy code"
            title="Copy snippet"
          >
            {copied ? <Check size={13} className="text-ember" /> : <Copy size={13} />}
          </button>
        </div>

        <div className="huly-code-body">
          <pre className="huly-code-pre">
            <code>
              <span className="code-comment">{"// Huly Cosmic Workspace\n"}</span>
              <span className="code-keyword">{"import "}</span>
              <span className="code-plain">{"{ Developer } "}</span>
              <span className="code-keyword">{"from "}</span>
              <span className="code-string">{'"@daffa/core"'}\n\n</span>
              <span className="code-keyword">{"export const "}</span>
              <span className="code-var">{"daffa "}</span>
              <span className="code-keyword">{"= new "}</span>
              <span className="code-class">{"Developer"}</span>
              <span className="code-plain">{"({\n"}</span>
              <span className="code-indent">{"  name: "}</span>
              <span className="code-string">{'"Muhamad Daffa Permana"'}\n</span>
              <span className="code-indent">{"  role: "}</span>
              <span className="code-string">{'"Full-Stack Developer"'}\n</span>
              <span className="code-indent">{"  stack: "}</span>
              <span className="code-plain">{"[\n"}</span>
              <span className="code-indent-2">
                <span className="code-string">{'"Next.js"'}</span>,{" "}
                <span className="code-string">{'"Express.js"'}</span>,{" "}
                <span className="code-string">{'"Prisma"'}</span>\n
              </span>
              <span className="code-indent">{"  ],\n"}</span>
              <span className="code-indent">{"  school: "}</span>
              <span className="code-string">{'"SMKN 1 Cisarua"'}\n</span>
              <span className="code-plain">{"});"}</span>
            </code>
          </pre>
        </div>
      </motion.div>

      {/* Layer 2: Featured Product Screenshot Frame (12px radius, hairline border, shadow) */}
      <motion.div
        className="huly-screenshot-frame"
        initial={{ opacity: 0, x: 20, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6, scale: 1.015 }}
      >
        <div className="huly-screenshot-topbar">
          <span className="huly-tag huly-tag-iris">SPOTLIGHT</span>
          <span className="huly-screenshot-title">{name}</span>
        </div>
        <div className="huly-screenshot-img-wrap">
          <Image
            src={cover}
            alt={`${name} project screenshot`}
            fill
            sizes="(max-width: 768px) 85vw, 320px"
            priority
          />
        </div>
      </motion.div>

      {/* Layer 3: Floating Developer Token Badge */}
      <motion.div
        className="huly-token-badge"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
      >
        <div className="huly-token-photo">
          <Image
            src="/assets/photo.jpg"
            alt="Muhamad Daffa Permana"
            fill
            sizes="80px"
          />
        </div>
        <div className="huly-token-info">
          <div className="huly-token-status">
            <span className="huly-status-dot" />
            <span className="huly-token-role">Full-Stack Developer</span>
          </div>
          <strong className="huly-token-name">Daffa Permana</strong>
          <span className="huly-token-sub">SMKN 1 Cisarua · RPL</span>
        </div>
        <div className="huly-token-arrow">
          <ArrowUpRight size={14} />
        </div>
      </motion.div>
    </div>
  );
}

