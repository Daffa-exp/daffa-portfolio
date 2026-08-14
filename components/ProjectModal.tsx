"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "../data/portfolio";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((v) => (v + 1) % project.images.length);
      if (e.key === "ArrowLeft") setIndex((v) => (v - 1 + project.images.length) % project.images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div className="project-modal" initial={{ opacity: 0, y: 35, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 25, scale: .97 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <div className="modal-glow" />
            <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>

            <div className="modal-copy">
              <div className="modal-kicker"><span className="eyebrow">PROJECT DETAIL</span><span>{project.category}</span></div>
              <h2>{project.name}</h2>
              <p className="modal-tagline">{project.tagline}</p>
              <p>{project.desc}</p>
              <div className="chip-row">{project.stack.map((item) => <span className="chip" key={item}>{item}</span>)}</div>
              <div className="modal-stat-row"><div><strong>{project.images.length}</strong><span>screenshots</span></div><div><strong>{project.stack.length}</strong><span>technologies</span></div></div>
              {project.demo && <a className="button button-primary" href={project.demo} target="_blank" rel="noopener noreferrer">Open Live Project <ExternalLink size={16} /></a>}
            </div>

            <div className="modal-gallery">
              <div className="gallery-head"><div><span className="gallery-label">VISUAL ARCHIVE</span><strong>{String(index + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}</strong></div><span>Use ← → to browse</span></div>
              <div className="gallery-stage">
                <AnimatePresence mode="wait">
                  <motion.div key={project.images[index]} className="gallery-image-wrap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .25 }}>
                    <Image src={project.images[index]} alt={`${project.name} screenshot ${index + 1}`} fill sizes="(max-width: 900px) 92vw, 65vw" className="gallery-image" />
                  </motion.div>
                </AnimatePresence>
                {project.images.length > 1 && <><button className="gallery-arrow left" onClick={() => setIndex((v) => (v - 1 + project.images.length) % project.images.length)} aria-label="Previous image"><ChevronLeft size={20} /></button><button className="gallery-arrow right" onClick={() => setIndex((v) => (v + 1) % project.images.length)} aria-label="Next image"><ChevronRight size={20} /></button></>}
                <div className="gallery-progress"><span style={{ width: `${((index + 1) / project.images.length) * 100}%` }} /></div>
              </div>
              <div className="thumbnail-row">{project.images.map((img, i) => <button key={img} className={`thumbnail ${i === index ? "active" : ""}`} onClick={() => setIndex(i)} aria-label={`View screenshot ${i + 1}`}><Image src={img} alt="" fill sizes="110px" /></button>)}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
