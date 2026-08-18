"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Users,
  X,
  Code2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  Layers3
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { Project } from "@/lib/types";

export function ProjectModal({
  project,
  onClose
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
    setIsFullscreen(false);
    if (!project) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      const imagesCount =
        project.galleryImages && project.galleryImages.length > 0
          ? project.galleryImages.length
          : 1;
      if (e.key === "ArrowRight") setIndex((v) => (v + 1) % imagesCount);
      if (e.key === "ArrowLeft") setIndex((v) => (v - 1 + imagesCount) % imagesCount);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose, isFullscreen]);

  if (!project) return null;

  const images =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project.coverImage || "/assets/projects/foodmart/1.webp"];

  const currentImage = images[index] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next image
        setIndex((v) => (v + 1) % images.length);
      } else {
        // Swipe right -> prev image
        setIndex((v) => (v - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

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
          className="project-modal case-study-modal"
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 130, damping: 20 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Case Study`}
        >
          <div className="modal-glow" />

          {/* Top Bar Navigation */}
          <div className="case-study-topbar">
            <div className="case-study-breadcrumb">
              <span className="case-study-badge">CASE STUDY</span>
              <span className="case-study-cat">{project.category}</span>
            </div>
            <button
              className="icon-button modal-close"
              onClick={onClose}
              aria-label="Close case study modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="case-study-scroll-content">
            {/* SECTION 1: HERO HEADER */}
            <header className="case-study-hero">
              <div className="hero-kicker-row">
                <span className="case-study-num">
                  {project.order ? String(project.order).padStart(2, "0") : "01"}
                </span>
                {project.featured && (
                  <span className="case-study-featured-pill">
                    <Sparkles size={12} /> Featured Case Study
                  </span>
                )}
              </div>

              <h1 className="case-study-title">{project.title}</h1>
              <p className="case-study-tagline">{project.tagline}</p>
              <p className="case-study-intro">{project.shortDescription}</p>

              {/* Action CTAs */}
              <div className="case-study-cta-row">
                {project.projectUrl && (
                  <a
                    className="button button-primary"
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Live Application <ExternalLink size={15} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    className="button button-ghost"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={15} /> View Source Code
                  </a>
                )}
              </div>
            </header>

            {/* SECTION 2: HERO PREVIEW IMAGE SHOWCASE */}
            <div className="case-study-showcase-stage">
              <div
                className="showcase-main-frame"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    className="showcase-image-container"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image
                      src={currentImage}
                      alt={`${project.title} preview screenshot ${index + 1}`}
                      fill
                      sizes="(max-width: 900px) 94vw, 75vw"
                      priority
                      className="showcase-img"
                    />
                  </motion.div>
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      className="gallery-arrow left"
                      onClick={() => setIndex((v) => (v - 1 + images.length) % images.length)}
                      aria-label="Previous screenshot"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="gallery-arrow right"
                      onClick={() => setIndex((v) => (v + 1) % images.length)}
                      aria-label="Next screenshot"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <button
                  className="showcase-expand-btn"
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Expand image view"
                  title="Expand screenshot"
                >
                  <Maximize2 size={15} />
                </button>

                <div className="showcase-counter-badge">
                  <Layers3 size={13} />
                  <span>
                    {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Thumbnails row if multiple images */}
              {images.length > 1 && (
                <div className="case-study-thumbnails">
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
              )}
            </div>

            {/* SECTION 3: PROJECT OVERVIEW & METRICS */}
            <section className="case-study-grid-overview">
              {/* Left Column: Role & Team Contribution */}
              <div className="overview-card">
                <div className="overview-card-header">
                  <Users size={18} className="icon-accent" />
                  <h3>Role & Collaboration</h3>
                </div>

                <div className="role-meta-badge">
                  <strong>{project.role || "Developer"}</strong>
                  <span>
                    {project.teamSize && project.teamSize > 1
                      ? `Collaborative Team (${project.teamSize} Contributors)`
                      : "Solo Project"}
                  </span>
                </div>

                {project.collaborationDescription ? (
                  <p className="overview-body">{project.collaborationDescription}</p>
                ) : (
                  <p className="overview-body">
                    {project.teamSize && project.teamSize > 1
                      ? "Dikembangkan secara kolaboratif bersama tim dengan pembagian peran berfokus pada arsitektur sistem dan kualitas pengkodean."
                      : "Dikerjakan secara mandiri dari tahap perancangan konsep, desain antarmuka, hingga arsitektur aplikasi dan pengujian."}
                  </p>
                )}
              </div>

              {/* Right Column: Key Details & Tech Stack */}
              <div className="overview-card">
                <div className="overview-card-header">
                  <Code2 size={18} className="icon-accent" />
                  <h3>Technologies & Stack</h3>
                </div>

                <div className="case-study-tech-grid">
                  {project.technologies.map((tech) => (
                    <div className="tech-card-pill" key={tech}>
                      <span className="tech-dot" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 4: FULL DESCRIPTION & EXPERIENCE */}
            {project.fullDescription && (
              <section className="case-study-section">
                <div className="section-title-wrap">
                  <span className="section-eyebrow">DEVELOPMENT EXPERIENCE</span>
                  <h2>Project Deep Dive</h2>
                </div>
                <div className="case-study-narrative">
                  <p>{project.fullDescription}</p>
                </div>
              </section>
            )}

            {/* SECTION 5: KEY FEATURES (If available) */}
            {project.features && project.features.length > 0 && (
              <section className="case-study-section">
                <div className="section-title-wrap">
                  <span className="section-eyebrow">KEY CAPABILITIES</span>
                  <h2>Core Features</h2>
                </div>
                <div className="features-grid-cards">
                  {project.features.map((feat, fIdx) => (
                    <div className="feature-item-card" key={fIdx}>
                      <CheckCircle2 size={16} className="text-cyan" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 6: CHALLENGES & SOLUTIONS (If available) */}
            {((project.challenges && project.challenges.length > 0) ||
              (project.solutions && project.solutions.length > 0)) && (
              <section className="case-study-section">
                <div className="section-title-wrap">
                  <span className="section-eyebrow">ENGINEERING INSIGHTS</span>
                  <h2>Challenges & Technical Solutions</h2>
                </div>

                <div className="challenges-solutions-grid">
                  {project.challenges && project.challenges.length > 0 && (
                    <div className="insight-card challenge-card">
                      <div className="insight-head">
                        <HelpCircle size={18} />
                        <h4>Key Challenges</h4>
                      </div>
                      <ul>
                        {project.challenges.map((item, cIdx) => (
                          <li key={cIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.solutions && project.solutions.length > 0 && (
                    <div className="insight-card solution-card">
                      <div className="insight-head">
                        <Lightbulb size={18} />
                        <h4>Solutions Implemented</h4>
                      </div>
                      <ul>
                        {project.solutions.map((item, sIdx) => (
                          <li key={sIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SECTION 7: FINAL BOTTOM CTA */}
            <footer className="case-study-footer">
              <div className="footer-left">
                <strong>Interested in this project?</strong>
                <span>Explore the live demo or get in touch for collaboration.</span>
              </div>
              <div className="footer-right-buttons">
                {project.projectUrl && (
                  <a
                    className="button button-primary"
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Live Demo <ExternalLink size={15} />
                  </a>
                )}
                <button className="button button-ghost" onClick={onClose}>
                  Back to Projects
                </button>
              </div>
            </footer>
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Image Lightbox Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fullscreen-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <button
              className="fullscreen-close-btn"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen image"
            >
              <Minimize2 size={20} />
            </button>
            <div
              className="fullscreen-stage"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={currentImage}
                alt={`${project.title} full resolution screenshot`}
                fill
                sizes="100vw"
                className="fullscreen-img"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-arrow left"
                    onClick={() => setIndex((v) => (v - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="gallery-arrow right"
                    onClick={() => setIndex((v) => (v + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
