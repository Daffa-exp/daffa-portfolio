"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
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
  CheckCircle2
} from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import type { Project, Certificate, SkillGroup } from "@/lib/types";
import { ProjectModal } from "./ProjectModal";
import { CertificateCarousel } from "./CertificateCarousel";
import { AmbientBackground } from "./AmbientBackground";
import { HeroVisual } from "./HeroVisual";
import { VisitorAIAssistant } from "./VisitorAIAssistant";

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } }
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
      viewport={{ once: true }}
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
            <>Sent <CheckCircle2 size={15} /></>
          ) : (
            <>Send Message <Send size={15} /></>
          )}
        </button>
        <small className={`contact-status ${status}`}>{message}</small>
      </form>
    </motion.div>
  );
}

interface PortfolioPageProps {
  initialProjects?: Project[];
  initialCertificates?: Certificate[];
  initialSkills?: SkillGroup[];
}

export default function PortfolioPage({
  initialProjects,
  initialCertificates,
  initialSkills
}: PortfolioPageProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [certs, setCerts] = useState<Certificate[]>(initialCertificates || []);
  const [skillsList, setSkillsList] = useState<SkillGroup[]>(
    initialSkills || [
      { group: "PROGRAMMING", items: ["HTML", "CSS", "JavaScript", "Python", "PHP", "Dart", "TypeScript"] },
      { group: "FRAMEWORKS / TOOLS", items: ["Next.js", "React", "Express.js", "Node.js", "Laravel", "Flutter", "Flask", "Tailwind CSS"] },
      { group: "DATABASE", items: ["MySQL", "Firebase", "Supabase", "Prisma"] },
      { group: "DEVELOPMENT", items: ["AI-assisted Development", "Docker", "Git"] }
    ]
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function syncData() {
      try {
        const res = await fetch("/api/public/data");
        if (res.ok) {
          const data = await res.json();
          if (data.projects && data.projects.length > 0) setProjects(data.projects);
          if (data.certificates && data.certificates.length > 0) setCerts(data.certificates);
          if (data.skills && data.skills.length > 0) setSkillsList(data.skills);
        }
      } catch (err) {
        console.warn("Using offline portfolio seed data", err);
      }
    }
    syncData();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);
  const moreProjects = projects.filter((p) => !p.featured);
  const activeFeatured = featuredProjects[0] || projects[0];

  return (
    <main>
      <AmbientBackground />
      <header className="navbar">
        <a className="brand" href="#home">
          <span>&lt;</span> daffa <span>/&gt;</span>
        </a>
        <nav>
          {["home", "about", "skills", "projects", "certificates", "contact"].map((item) => (
            <a key={item} href={`#${item}`}>
              {item}
            </a>
          ))}
        </nav>
        <a
          className="github-link"
          href="https://github.com/Daffa-exp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={15} /> GitHub
        </a>
      </header>

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
              Pelajar dengan minat mendalam di Software Development, khususnya Back-End Development, serta pengalaman membangun aplikasi web, desktop, dan mobile menggunakan teknologi modern.
            </p>
            <div className="button-row">
              <a className="button button-primary" href="#projects">
                View Projects <ArrowDown size={16} />
              </a>
              <a className="button button-ghost" href="#contact">
                Contact Me <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero-links">
              <a href="https://github.com/Daffa-exp" target="_blank" rel="noopener noreferrer">
                <Github size={15} /> Daffa-exp
              </a>
              <a href="mailto:permanadaffa89@gmail.com">
                <Mail size={15} /> permanadaffa89@gmail.com
              </a>
            </div>
            <div className="stats">
              <div>
                <strong>{projects.length}+</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>{featuredProjects.length || 3}</strong>
                <span>Featured Projects</span>
              </div>
              <div>
                <strong>{certs.length || 7}</strong>
                <span>Certifications</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {activeFeatured && <HeroVisual project={activeFeatured} />}
          </motion.div>
        </div>
      </section>

      <section id="about" className="section section-about">
        <div className="section-shell two-col">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal}>
            <span className="eyebrow">ABOUT ME</span>
            <h2>Get to know me.</h2>
            <p>
              Saya adalah pelajar yang memiliki minat besar di bidang Software Development, khususnya Back-End Development. Saya berpengalaman dalam membuat aplikasi web, desktop, dan mobile menggunakan berbagai teknologi modern.
            </p>
            <p>
              Saya selalu ingin belajar hal-hal baru, memecahkan masalah, dan membangun solusi yang bermanfaat.
            </p>
          </motion.div>
          <motion.div className="timeline" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={reveal}>
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <span className="eyebrow">SKILLS & TECHNOLOGIES</span>
            <h2>Tools I use.</h2>
          </motion.div>
          <div className="skills-grid">
            {skillsList.map((group) => (
              <motion.div
                className="skill-group"
                key={group.group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <div>
              <span className="eyebrow">FEATURED PROJECTS</span>
              <h2>My best work.</h2>
            </div>
            <p>Project utama yang sudah live dan terverifikasi. Buka detail untuk melihat seluruh screenshot yang tersedia.</p>
          </motion.div>

          <div className="featured-list">
            {featuredProjects.map((project, i) => {
              const gallery = project.galleryImages && project.galleryImages.length > 0
                ? project.galleryImages
                : [project.coverImage || "/assets/projects/foodmart/1.webp"];

              return (
                <motion.article
                  className={`featured-project ${i % 2 ? "reverse" : ""}`}
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.12 }}
                  variants={reveal}
                >
                  <div className="project-copy">
                    <span className="project-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="project-category">{project.category}</span>
                    <h3>{project.title}</h3>
                    <span className="project-tagline">{project.tagline}</span>
                    <p>{project.shortDescription || project.fullDescription}</p>
                    <div className="chip-row">
                      {project.technologies.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="button-row">
                      {project.projectUrl && (
                        <a
                          className="button button-primary small"
                          href={project.projectUrl}
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
                    aria-label={`Open ${project.title} details`}
                  >
                    <div className="visual-frame visual-frame-back" />
                    <div className="visual-frame visual-frame-mid" />
                    <div className="visual-frame visual-frame-main device-laptop">
                      <div className="device-camera" />
                      <div className="device-screen">
                        <Image
                          src={project.coverImage || gallery[0]}
                          alt={`${project.title} screenshot`}
                          fill
                          sizes="(max-width: 900px) 92vw, 55vw"
                        />
                      </div>
                      <div className="device-base" />
                      <span className="visual-glass-label">
                        <Layers3 size={12} /> {gallery.length} screens
                      </span>
                    </div>
                    {gallery.slice(1, 3).map((img, imageIndex) => (
                      <div className={`visual-mini visual-mini-${imageIndex + 1}`} key={img}>
                        <Image src={img} alt="" fill sizes="180px" />
                      </div>
                    ))}
                    <span className="visual-count">{String(gallery.length).padStart(2, "0")} screenshots</span>
                    <span className="visual-overlay">
                      <MousePointer2 size={13} /> Open gallery
                    </span>
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {moreProjects.length > 0 && (
        <section className="section more-section">
          <div className="section-shell">
            <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
              <div>
                <span className="eyebrow">OTHER PROJECTS</span>
                <h2>More projects I&apos;ve built.</h2>
              </div>
              <p>Semua project lain menggunakan screenshot asli dari asset portofolio. Klik kartu untuk membuka gallery lengkap.</p>
            </motion.div>
            <div className="more-grid">
              {moreProjects.map((project) => {
                const gallery = project.galleryImages && project.galleryImages.length > 0
                  ? project.galleryImages
                  : [project.coverImage || "/assets/projects/foodmart/1.webp"];

                return (
                  <motion.button
                    className="more-card"
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={reveal}
                  >
                    <div className="more-image">
                      {gallery.slice(0, 3).map((img, i) => (
                        <div className={`more-image-layer layer-${i}`} key={img}>
                          <Image
                            src={img}
                            alt={i === 0 ? project.title : ""}
                            fill
                            sizes="(max-width: 700px) 90vw, 300px"
                          />
                        </div>
                      ))}
                      <span className="more-count">
                        {gallery.length} {gallery.length === 1 ? "view" : "views"}
                      </span>
                    </div>
                    <div className="more-meta">
                      <div className="more-category">{project.category}</div>
                      <strong>{project.title}</strong>
                      <span>{project.tagline}</span>
                      <div className="more-stack">
                        {project.technologies.slice(0, 3).map((item) => (
                          <i key={item}>{item}</i>
                        ))}
                      </div>
                      <small>
                        Open full gallery <ArrowUpRight size={12} />
                      </small>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section id="certificates" className="section certificates-section">
        <div className="section-shell">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <div>
              <span className="eyebrow">CERTIFICATES</span>
              <h2>My certifications.</h2>
            </div>
            <p>Semua sertifikat dari asset portfolio tersedia dan dapat dibuka untuk melihat detail.</p>
          </motion.div>
          <CertificateCarousel certificates={certs} />
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="section-shell contact-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
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

      {/* Floating Smart Visitor AI */}
      <VisitorAIAssistant />

      {/* Project Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
