"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Terminal, Sparkles, Check, Copy } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/lib/types";

export function HeroVisual({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false);
  const cover = project.coverImage || (project.galleryImages && project.galleryImages[0]) || "/assets/projects/foodmart/1.webp";
  const name = project.title;

  const codeSnippet = `// AgentQL-inspired Developer Profile
import { Developer } from "@daffa/core";

export const daffa = new Developer({
  name: "Muhamad Daffa Permana",
  role: "Full-Stack Developer",
  focus: ["Backend Architecture", "Modern Web", "API Systems"],
  stack: ["Next.js", "Node.js", "Express", "Prisma", "Docker"],
  education: "SMK Negeri 1 Cisarua (RPL)",
  status: "available_for_collaboration"
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="agentql-hero-visual" aria-label="Interactive AgentQL command-center developer visual">
      {/* Aurora Ambient Glows */}
      <div className="agentql-visual-aurora-purple" />
      <div className="agentql-visual-plasma-pink" />

      {/* Main Layer: Code Snippet Block (Signature AgentQL devtool component) */}
      <motion.div
        className="agentql-code-panel"
        initial={{ opacity: 0, y: 20, rotateX: 6, rotateY: -6 }}
        animate={{ opacity: 1, y: 0, rotateX: 2, rotateY: -3 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ rotateX: 0, rotateY: 0, y: -4 }}
      >
        <div className="agentql-code-header">
          <div className="agentql-code-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="agentql-code-tab">
            <Terminal size={12} className="text-frosted" />
            <span>daffa.profile.ts</span>
          </div>
          <button
            className="agentql-copy-btn"
            onClick={copyCode}
            aria-label="Copy code"
            title="Copy snippet"
          >
            {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
          </button>
        </div>

        <div className="agentql-code-body">
          <pre className="agentql-code-pre">
            <code>
              <span className="code-comment">{"// Full-Stack Developer Profile\n"}</span>
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
                <span className="code-string">{'"Express"'}</span>,{" "}
                <span className="code-string">{'"Node.js"'}</span>\n
              </span>
              <span className="code-indent">{"  ],\n"}</span>
              <span className="code-indent">{"  school: "}</span>
              <span className="code-string">{'"SMKN 1 Cisarua"'}\n</span>
              <span className="code-plain">{"});"}</span>
            </code>
          </pre>
        </div>
      </motion.div>

      {/* Layer 2: Featured Project Window */}
      <motion.div
        className="agentql-preview-card"
        initial={{ opacity: 0, x: 20, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6, scale: 1.02 }}
      >
        <div className="agentql-preview-topbar">
          <span className="agentql-preview-tag">SPOTLIGHT PROJECT</span>
          <span className="agentql-preview-title">{name}</span>
        </div>
        <div className="agentql-preview-img-wrap">
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
        className="agentql-token-badge"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -5 }}
      >
        <div className="agentql-token-photo">
          <Image
            src="/assets/photo.jpg"
            alt="Muhamad Daffa Permana"
            fill
            sizes="80px"
          />
        </div>
        <div className="agentql-token-info">
          <div className="agentql-token-status">
            <span className="status-live-dot" />
            <span className="agentql-token-role">Full-Stack Dev</span>
          </div>
          <strong className="agentql-token-name">Daffa Permana</strong>
          <span className="agentql-token-sub">SMKN 1 Cisarua</span>
        </div>
        <div className="agentql-token-arrow">
          <ArrowUpRight size={14} />
        </div>
      </motion.div>
    </div>
  );
}
