"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export function ProjectModal({
  project,
  onClose
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const imagesCount = (project.galleryImages && project.galleryImages.length > 0) ? project.galleryImages.length : 1;
      if (e.key === "ArrowRight") setIndex((v) => (v + 1) % imagesCount);
      if (e.key === "ArrowLeft") setIndex((v) => (v - 1 + imagesCount) % imagesCount);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const images = (project.galleryImages && project.galleryImages.length > 0)
    ? project.galleryImages
    : [project.coverImage || "/assets/projects/foodmart/1.webp"];

  const currentImage = images[index] || images[0];

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="project-modal"
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="modal-glow" />
          <button className="icon-button modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>

          <div className="modal-copy">
            <div className="modal-kicker">
              <span className="eyebrow">PROJECT DETAIL</span>
              <span>{project.category}</span>
            </div>
            <h2>{project.title}</h2>
            <p className="modal-tagline">{project.tagline}</p>
            <p className="modal-desc-full">{project.fullDescription || project.shortDescription}</p>

            {project.collaborationDescription && (
              <div className="modal-collab-box">
                <div className="modal-collab-head">
                  <Users size={14} className="text-cyan-400" />
                  <strong>
                    {project.teamSize && project.teamSize > 1
                      ? `Team Project (${project.teamSize} Contributors)`
                      : "Solo Project"}
                  </strong>
                </div>
                <p>{project.collaborationDescription}</p>
              </div>
            )}

            <div className="chip-row">
              {project.technologies.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="modal-stat-row">
              <div>
                <strong>{images.length}</strong>
                <span>screenshots</span>
              </div>
              <div>
                <strong>{project.technologies.length}</strong>
                <span>technologies</span>
              </div>
              {project.role && (
                <div>
                  <strong>{project.role}</strong>
                  <span>role</span>
                </div>
              )}
            </div>

            <div className="button-row">
              {project.projectUrl && (
                <a
                  className="button button-primary"
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Live Project <ExternalLink size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  className="button button-ghost"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} /> View Code
                </a>
              )}
            </div>
          </div>

          <div className="modal-gallery">
            <div className="gallery-head">
              <div>
                <span className="gallery-label">VISUAL ARCHIVE</span>
                <strong>
                  {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </strong>
              </div>
              <span>Use ← → to browse</span>
            </div>
            <div className="gallery-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  className="gallery-image-wrap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <Image
                    src={currentImage}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    sizes="(max-width: 900px) 92vw, 65vw"
                    className="gallery-image"
                  />
                </motion.div>
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-arrow left"
                    onClick={() => setIndex((v) => (v - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="gallery-arrow right"
                    onClick={() => setIndex((v) => (v + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <div className="gallery-progress">
                <span style={{ width: `${((index + 1) / images.length) * 100}%` }} />
              </div>
            </div>
            <div className="thumbnail-row">
              {images.map((img, i) => (
                <button
                  key={img}
                  className={`thumbnail ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`View screenshot ${i + 1}`}
                >
                  <Image src={img} alt="" fill sizes="110px" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
