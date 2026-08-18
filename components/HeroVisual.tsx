"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Layers3, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types";

export function HeroVisual({ project }: { project: Project }) {
  const cover = project.coverImage || (project.galleryImages && project.galleryImages[0]) || "/assets/projects/foodmart/1.webp";
  const name = project.title;
  const screensCount = (project.galleryImages && project.galleryImages.length > 0) ? project.galleryImages.length : 1;

  return (
    <div className="hero-visual" aria-label="Interactive developer workspace preview">
      <div className="hero-visual-noise" />
      <motion.div
        className="hero-orbit hero-orbit-a"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="hero-orbit hero-orbit-b"
        animate={{ rotate: -360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="hero-core"
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="workspace-panel"
        initial={{ opacity: 0, y: 24, rotateX: 8, rotateY: -8 }}
        animate={{ opacity: 1, y: 0, rotateX: 3, rotateY: -5 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ rotateX: 0, rotateY: -2, y: -7 }}
      >
        <div className="workspace-topbar">
          <div className="window-dots"><i /><i /><i /></div>
          <span>DAFFA / WORKSPACE</span>
          <Layers3 size={13} />
        </div>
        <div className="workspace-screen">
          <Image src={cover} alt={`${name} project preview`} fill sizes="560px" priority />
          <div className="screen-vignette" />
          <div className="screen-label"><span>FEATURED PROJECT</span><strong>{name}</strong></div>
        </div>
        <div className="workspace-base">
          <div className="base-line base-line-wide" /><div className="base-line" /><div className="base-line" />
        </div>
      </motion.div>

      <motion.div
        className="identity-glass"
        initial={{ opacity: 0, x: 30, y: 25, rotate: 5 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 3 }}
        transition={{ duration: 1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -9, rotate: 1 }}
      >
        <div className="identity-shine" />
        <div className="identity-header"><span>DEVELOPER ID</span><span className="identity-status" /></div>
        <div className="identity-photo"><Image src="/assets/photo.jpg" alt="Muhamad Daffa Permana" fill sizes="230px" /></div>
        <div className="identity-name">Muhamad Daffa<br />Permana</div>
        <div className="identity-role">Junior Software Developer</div>
        <div className="identity-footer"><Code2 size={13} /><span>DAFFA·EXP</span><ArrowUpRight size={13} /></div>
      </motion.div>

      <motion.div
        className="hero-float-card hero-float-top"
        animate={{ y: [0, -9, 0], rotate: [-3, -2, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={14} />
        <div><strong>Digital craft</strong><span>Clean · functional · refined</span></div>
      </motion.div>

      <motion.div
        className="hero-float-card hero-float-bottom"
        animate={{ y: [0, 8, 0], rotate: [2, 1, 2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="float-number">{screensCount}</span>
        <div><strong>Project screens</strong><span>Open the full archive below</span></div>
      </motion.div>

      <div className="hero-ground-glow" />
    </div>
  );
}
