"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { sentenceCase } from "@/lib/display";
import { ProjectFrame } from "./ProjectFrame";

interface HeroVisualProps {
  projects: Project[];
  onOpen: (project: Project) => void;
}

/** Hero evidence: real project UI floating over the aurora, switchable between featured work. */
export function HeroVisual({ projects, onOpen }: HeroVisualProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  if (!active) return null;

  return (
    <div className="hero-visual">
      <div className="hero-visual__bar">
        <div className="hero-visual__tabs" role="tablist" aria-label="Featured projects">
          {projects.map((p) => (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={p.id === active.id}
              className={`pill-tab ${p.id === active.id ? "is-active" : ""}`}
              onClick={() => setActiveId(p.id)}
            >
              {p.title}
            </button>
          ))}
        </div>
        <span className="hero-visual__meta">{sentenceCase(active.category)}</span>
      </div>

      <button
        type="button"
        className="hero-visual__stage"
        onClick={() => onOpen(active)}
        aria-label={`Open ${active.title} case study`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectFrame project={active} sizes="(max-width: 900px) 92vw, 1100px" priority />
          </motion.div>
        </AnimatePresence>
        <span className="hero-visual__open">
          Open case study <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
