"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Sparkles,
  Layers3,
  MousePointer2,
  Send,
  CheckCircle2,
  Menu,
  X,
  Code2,
  Rocket,
  Award
} from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import { allProjects, certificates, featuredProjects, moreProjects, skills, type Project } from "../data/portfolio";
import { ProjectModal } from "./ProjectModal";
import { CertificateCarousel } from "./CertificateCarousel";
import { AmbientBackground } from "./AmbientBackground";

// Snappy entry animation config
const reveal = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.25, 0.1, 0.25, 1.0] as const
    }
  }
};

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Failed");
      setStatus("success");
      setMessage("Pesan berhasil dikirim. Terima kasih sudah menghubungi saya.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Pengiriman gagal. Silakan gunakan email langsung di sebelah kiri.");
    }
  }

  return (
    <motion.div
      className="contact-card contact-form-card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={reveal}
    >
      <div className="contact-card-orbit" aria-hidden="true" />
      <Sparkles size={18} />
      <h3>Have a project in mind?</h3>
      <p>Kirim pesan langsung dari portfolio. Pesan akan diteruskan ke email saya.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <label>
            <span>Your name</span>
            <input name="name" required autoComplete="name" placeholder="Nama kamu" />
          </label>
          <label>
            <span>Your email</span>
            <input name="email" type="email" required autoComplete="email" placeholder="nama@email.com" />
          </label>
        </div>
        <label>
          <span>Message</span>
          <textarea name="message" required rows={5} placeholder="Ceritakan project atau kebutuhanmu..." />
        </label>
        <button className="button button-primary contact-submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? (
            "Sending..."
          ) : status === "success" ? (
            <>
              Sent <CheckCircle2 size={15} />
            </>
          ) : (
            <>
              Send Message <Send size={15} />
            </>
          )}
        </button>
        <small className={`contact-status ${status}`}>{message}</small>
      </form>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ── Observer 1: Active navbar section tracking ──────────────────────
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "certificates", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });
    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  // ── Observer 2: CSS scroll-reveal — adds `in-view` class to trigger
  //    GPU-composited CSS animations (section divider glow, card stagger).
  //    Uses a single shared observer instance for all .section elements.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".section"));
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Toggle so the border re-animates each time the section enters
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Programmatic smooth scroll handler (so manual scroll wheel isn't hijacked)
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <main>
      <AmbientBackground />
      
      <header className="navbar">
        {/* Monogram Logo */}
        <a className="brand-logo" href="#home" onClick={(e) => handleScrollTo(e, "home")}>
          <svg className="logo-svg" viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#59d8ff" />
                <stop offset="0.5" stopColor="#6b82ff" />
                <stop offset="1" stopColor="#9a70ff" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="17" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeDasharray="80 30" opacity="0.8" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="url(#logoGrad)" fontSize="15" fontWeight="900" fontStyle="italic" fontFamily="system-ui, sans-serif">
              DP
            </text>
          </svg>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop">
          {["home", "about", "skills", "projects", "certificates", "contact"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={activeSection === item ? "active" : ""}
              onClick={(e) => handleScrollTo(e, item)}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Navbar Actions (GitHub Link & Hamburger Toggle) */}
        <div className="navbar-actions">
          <a className="github-link" href="https://github.com/Daffa-exp" target="_blank" rel="noopener noreferrer">
            <Github size={15} /> GitHub
          </a>
          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Hamburger Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <nav className="mobile-nav-links">
              {["home", "about", "skills", "projects", "certificates", "contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={activeSection === item ? "active" : ""}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleScrollTo(e, item);
                  }}
                >
                  {item}
                </a>
              ))}
              <a
                className="github-link-mobile"
                href="https://github.com/Daffa-exp"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Github size={15} /> GitHub
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="home" className="hero section-shell">
        <div className="hero-grid">
          <motion.div className="hero-copy" initial="hidden" animate="visible" variants={reveal}>
            <span className="eyebrow">HELLO, I'M</span>
            <h1 className="hero-name">
              <span>Muhamad</span>
              <span className="name-accent">Daffa</span>
              <span>Permana</span>
            </h1>
            
            <div className="role-line">
              <span className="status-dot" /> Junior Software Developer
            </div>
            
            <p>
              Pelajar dengan minat mendalam di Software Development, khususnya Back-End Development, serta pengalaman membangun aplikasi Web, Desktop, dan Mobile menggunakan teknologi modern.
            </p>
            
            <div className="button-row">
              <a className="button button-primary" href="#projects" onClick={(e) => handleScrollTo(e, "projects")}>
                View Projects <span style={{ marginLeft: "4px", fontSize: "11px" }}>↘</span>
              </a>
              <a className="button button-ghost" href="#contact" onClick={(e) => handleScrollTo(e, "contact")}>
                Contact Me <span style={{ marginLeft: "4px", fontSize: "11px" }}>↗</span>
              </a>
            </div>

            {/* Email & Location details directly under buttons */}
            <div className="hero-contact-info">
              <a href="mailto:permanadaffa89@gmail.com" className="hero-contact-item">
                <Mail size={14} /> permanadaffa89@gmail.com
              </a>
              <span className="hero-contact-item">
                <MapPin size={14} /> Parongpong, Jawa Barat, Indonesia
              </span>
            </div>

            {/* Stats Cards - Recomposed inside Hero left column */}
            <div className="stats-cards-grid">
              <div className="stats-card">
                <div className="stats-card-icon proj-icon">
                  <Code2 size={18} />
                </div>
                <div className="stats-card-data">
                  <strong className="stats-num">{allProjects.length}+</strong>
                  <span className="stats-label">PROJECTS</span>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon live-icon">
                  <Rocket size={18} />
                </div>
                <div className="stats-card-data">
                  <strong className="stats-num">3</strong>
                  <span className="stats-label">LIVE PROJECTS</span>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon cert-icon">
                  <Award size={18} />
                </div>
                <div className="stats-card-data">
                  <strong className="stats-num">7</strong>
                  <span className="stats-label">CERTIFICATIONS</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="hero-rail" aria-label="Social links">
            <a href="https://github.com/Daffa-exp" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={17} />
            </a>
            <a href="mailto:permanadaffa89@gmail.com" aria-label="Email">
              <Mail size={17} />
            </a>
            <span className="hero-rail-line" />
          </div>

          <motion.div
            className="lanyard-scene"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          >
            <div className="lanyard-rig">
              {/* Cohesive Lanyard SVG representing physical fabrics, steel loops, and lobster clasp hook */}
              <svg className="lanyard-rope" viewBox="0 -30 420 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient id="strapGradientLeft" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#0b0e1a" />
                    <stop offset=".25" stopColor="#2c3a70" />
                    <stop offset=".5" stopColor="#5d72cc" />
                    <stop offset=".75" stopColor="#243160" />
                    <stop offset="1" stopColor="#070a14" />
                  </linearGradient>
                  <linearGradient id="strapGradientRight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#070a13" />
                    <stop offset=".25" stopColor="#202c5c" />
                    <stop offset=".5" stopColor="#5366c0" />
                    <stop offset=".75" stopColor="#243160" />
                    <stop offset="1" stopColor="#0b0e1a" />
                  </linearGradient>
                  
                  <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#dce3f4" />
                    <stop offset="0.3" stopColor="#8795ad" />
                    <stop offset="0.6" stopColor="#303b4d" />
                    <stop offset="1" stopColor="#a6b5cc" />
                  </linearGradient>
                  
                  <filter id="strapShadow" x="-30%" y="-10%" width="160%" height="130%">
                    <feDropShadow dx="6" dy="10" stdDeviation="6" floodColor="#000" floodOpacity=".5" />
                  </filter>
                  
                  {/* Left and Right fabric strap geometry starting inside viewBox */}
                  <path id="leftStrap" d="M142 -20 C146 54 153 104 171 151 C184 185 198 212 209 238" />
                  <path id="rightStrap" d="M276 -20 C272 54 265 104 247 151 C234 185 220 212 209 238" />
                </defs>

                {/* Strap shadows */}
                <use href="#leftStrap" className="strap-shadow" />
                <use href="#rightStrap" className="strap-shadow" />

                {/* Main fabric ribbons */}
                <use href="#leftStrap" className="strap-ribbon" stroke="url(#strapGradientLeft)" />
                <use href="#rightStrap" className="strap-ribbon" stroke="url(#strapGradientRight)" />

                {/* Ribbon high-fidelity texture lines */}
                <use href="#leftStrap" className="strap-ribbon-highlight" />
                <use href="#rightStrap" className="strap-ribbon-highlight" />

                {/* Curved Printed Name DAFFA-EXP along Left & Right paths */}
                <text fill="rgba(225,233,255,0.48)" fontSize="7" fontWeight="700" letterSpacing="1.2" className="strap-text-path" dominantBaseline="middle">
                  <textPath href="#leftStrap" startOffset="10%">
                    {"DAFFA-EXP\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0DAFFA-EXP\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0DAFFA-EXP"}
                  </textPath>
                </text>
                <text fill="rgba(225,233,255,0.48)" fontSize="7" fontWeight="700" letterSpacing="1.2" className="strap-text-path" dominantBaseline="middle">
                  <textPath href="#rightStrap" startOffset="10%">
                    {"DAFFA-EXP\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0DAFFA-EXP\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0DAFFA-EXP"}
                  </textPath>
                </text>

                {/* Realistic Steel Swivel Clip Elements directly inside the SVG */}
                <g className="metal-hardware" filter="url(#strapShadow)">
                  {/* Outer Steel ring holding the straps */}
                  <ellipse cx="209" cy="242" rx="14" ry="7" fill="none" stroke="url(#metalGrad)" strokeWidth="3" />
                  
                  {/* Small Swivel Cylinder */}
                  <rect x="206" y="247" width="6" height="9" rx="1.5" fill="url(#metalGrad)" />
                  
                  {/* Carabiner lobster clasp loop entering card slot */}
                  <path 
                    d="M209 256 C201 256, 196 264, 198 274 C200 282, 205 284, 209 284 C213 284, 218 281, 219 274 L219 261 Z" 
                    fill="none" 
                    stroke="url(#metalGrad)" 
                    strokeWidth="3.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Swivel trigger bar */}
                  <line x1="202" y1="262" x2="215" y2="278" stroke="url(#metalGrad)" strokeWidth="1.6" />
                </g>
              </svg>

              {/* Developer ID Card hanging from the hook */}
              <div className="id-card">
                <span className="card-slot" aria-hidden="true" />
                <div className="card-top">
                  <span>DEVELOPER ID</span>
                  <span className="live-led" />
                </div>
                <div className="photo-frame">
                  <Image src="/assets/daffa.jpg" alt="Muhamad Daffa Permana" fill priority sizes="240px" />
                </div>
                <div className="card-name">
                  Muhamad Daffa
                  <br />
                  Permana
                </div>
                <div className="card-role">Junior Software Developer</div>
                <div className="barcode">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="card-code">DAFFA-EXP</div>
              </div>
            </div>
            
            <div className="orb orb-a" />
            <div className="orb orb-b" />
            <div className="scroll-cue">
              <span className="scroll-mouse" />
              <span>
                SCROLL
                <br />
                TO EXPLORE
              </span>
              <ArrowDown size={14} />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="section section-about">
        <div className="section-shell two-col">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={reveal}>
            <span className="eyebrow">ABOUT ME</span>
            <h2>Get to know me.</h2>
            <p>
              Saya adalah pelajar yang memiliki minat besar di bidang Software Development, khususnya Back-End
              Development. Saya berpengalaman dalam membuat aplikasi web, desktop, dan mobile menggunakan berbagai
              teknologi modern.
            </p>
            <p>Saya selalu ingin belajar hal-hal baru, memecahkan masalah, dan membangun solusi yang bermanfaat.</p>
          </motion.div>
          <motion.div
            className="timeline"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={reveal}
          >
            {[
              ["2024 — Sekarang", "SMK Negeri 1 Cisarua", "Rekayasa Perangkat Lunak"],
              ["2021 — 2024", "MTs As Shofa Cisarua", "Pendidikan Menengah"],
              ["2015 — 2021", "SD Negeri Kancah", "Pendidikan Dasar"]
            ].map(([year, title, detail]) => (
              <div className="timeline-item" key={title}>
                <span className="timeline-dot" />
                <div>
                  <small>{year}</small>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="section-shell">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={reveal}>
            <span className="eyebrow">SKILLS & TECHNOLOGIES</span>
            <h2>Tools I use.</h2>
          </motion.div>
          <div className="skills-grid">
            {skills.map((group) => (
              <motion.div
                className="skill-group"
                key={group.group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={reveal}
              >
                <span className="skill-title">{group.group}</span>
                <div className="skill-list">
                  {group.items.map((item) => (
                    <div className="skill-pill" key={item}>
                      <span className="skill-icon">{item.slice(0, 2).toUpperCase()}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="section-shell">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={reveal}
          >
            <div>
              <span className="eyebrow">FEATURED PROJECTS</span>
              <h2>My best work.</h2>
            </div>
            <p>3 project utama yang sudah live. Buka detail untuk melihat seluruh screenshot yang tersedia.</p>
          </motion.div>

          <div className="featured-list">
            {featuredProjects.map((project, i) => (
              <motion.article
                className={`featured-project ${i % 2 ? "reverse" : ""}`}
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={reveal}
              >
                <div className="project-copy">
                  <span className="project-index">{project.index}</span>
                  <span className="project-category">{project.category}</span>
                  <h3>{project.name}</h3>
                  <span className="project-tagline">{project.tagline}</span>
                  <p>{project.desc}</p>
                  <div className="chip-row">
                    {project.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="button-row">
                    {project.demo && (
                      <a
                        className="button button-primary small"
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                    <button className="button button-ghost small" onClick={() => setSelectedProject(project)}>
                      View Details <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
                <button
                  className="project-visual"
                  onClick={() => setSelectedProject(project)}
                  aria-label={`Open ${project.name} details`}
                >
                  <div className="visual-frame visual-frame-back" />
                  <div className="visual-frame visual-frame-mid" />
                  <div className="visual-frame visual-frame-main device-laptop">
                    <div className="device-camera" />
                    <div className="device-screen">
                      <Image
                        src={project.images[0]}
                        alt={`${project.name} screenshot`}
                        fill
                        sizes="(max-width: 900px) 92vw, 55vw"
                      />
                    </div>
                    <div className="device-base" />
                    <span className="visual-glass-label">
                      <Layers3 size={12} /> {project.images.length} screens
                    </span>
                  </div>
                  {project.images.slice(1, 3).map((img, imageIndex) => (
                    <div className={`visual-mini visual-mini-${imageIndex + 1}`} key={img}>
                      <Image src={img} alt="" fill sizes="180px" />
                    </div>
                  ))}
                  <span className="visual-count">{String(project.images.length).padStart(2, "0")} screenshots</span>
                  <span className="visual-overlay">
                    <MousePointer2 size={13} /> Open gallery
                  </span>
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section more-section">
        <div className="section-shell">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={reveal}
          >
            <div>
              <span className="eyebrow">OTHER PROJECTS</span>
              <h2>More projects I&apos;ve built.</h2>
            </div>
            <p>
              Semua project lain menggunakan screenshot asli dari asset yang kamu kirim. Klik kartu untuk membuka
              gallery lengkap.
            </p>
          </motion.div>
          <div className="more-grid">
            {moreProjects.map((project) => (
              <motion.button
                className="more-card"
                key={project.id}
                onClick={() => setSelectedProject(project)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={reveal}
              >
                <div className="more-image">
                  {project.images.slice(0, 3).map((img, i) => (
                    <div className={`more-image-layer layer-${i}`} key={img}>
                      <Image src={img} alt={i === 0 ? project.name : ""} fill sizes="(max-width: 700px) 90vw, 300px" />
                    </div>
                  ))}
                  <span className="more-count">
                    {project.images.length} {project.images.length === 1 ? "view" : "views"}
                  </span>
                </div>
                <div className="more-meta">
                  <div className="more-category">{project.category}</div>
                  <strong>{project.name}</strong>
                  <span>{project.tagline}</span>
                  <div className="more-stack">
                    {project.stack.slice(0, 3).map((item) => (
                      <i key={item}>{item}</i>
                    ))}
                  </div>
                  <small>
                    Open full gallery <ArrowUpRight size={12} />
                  </small>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="section certificates-section">
        <div className="section-shell">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={reveal}
          >
            <div>
              <span className="eyebrow">CERTIFICATES</span>
              <h2>My certifications.</h2>
            </div>
            <p>Semua sertifikat dari asset portfolio tersedia dan dapat dibuka untuk melihat detail.</p>
          </motion.div>
          <CertificateCarousel certificates={certificates} />
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="section-shell contact-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={reveal}>
            <span className="eyebrow">GET IN TOUCH</span>
            <h2>Let&apos;s work together.</h2>
            <p>Saya terbuka untuk peluang, kolaborasi, atau sekadar diskusi menarik tentang teknologi dan project.</p>
            <div className="contact-list">
              <a href="mailto:permanadaffa89@gmail.com">
                <Mail size={17} /> permanadaffa89@gmail.com
              </a>
              <span>
                <MapPin size={17} /> Parongpong, Jawa Barat, Indonesia
              </span>
              <a href="https://github.com/Daffa-exp" target="_blank" rel="noopener noreferrer">
                <Github size={17} /> github.com/Daffa-exp
              </a>
            </div>
          </motion.div>
          <ContactForm />
        </div>
      </section>

      <footer className="footer section-shell">
        <span>Muhamad Daffa Permana</span>
        <span>Junior Software Developer</span>
        <span>© 2026</span>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
