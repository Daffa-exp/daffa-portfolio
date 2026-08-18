"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Star,
  Trash2,
  Edit,
  ExternalLink,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import type { Project } from "@/lib/types";

export default function StudioProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      const res = await fetch("/api/studio/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error("Failed to load projects", e);
      setError("Gagal memuat daftar proyek");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function toggleFeatured(project: Project) {
    try {
      const res = await fetch(`/api/studio/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured })
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: !p.featured } : p))
        );
      }
    } catch (e) {
      console.error("Failed to toggle featured", e);
    }
  }

  async function handleDelete(project: Project) {
    const ok = window.confirm(`Apakah kamu yakin ingin menghapus proyek "${project.title}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/studio/projects/${project.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus proyek");
      }
    } catch (e) {
      console.error("Failed to delete project", e);
    }
  }

  const categories = ["ALL", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="studio-page">
      <div className="studio-header">
        <div>
          <div className="studio-kicker">CONTENT MANAGEMENT</div>
          <h1>Projects CMS</h1>
          <p>Kelola semua proyek portofolio, atur urutan tampilan, status featured, dan detail teknis.</p>
        </div>
        <div className="studio-actions">
          <Link href="/daffa-studio/projects/new" className="studio-btn studio-btn-primary">
            <Plus size={16} /> Tambah Proyek Baru
          </Link>
        </div>
      </div>

      {error && (
        <div className="studio-alert studio-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="studio-filter-bar">
        <div className="studio-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Cari judul proyek, tagline, atau teknologi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="studio-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`studio-pill-btn ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List / Table */}
      {loading ? (
        <div className="studio-spinner-wrap">
          <div className="studio-spinner" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="studio-empty-state">
          <p>Tidak ada proyek yang sesuai dengan kriteria pencarian.</p>
        </div>
      ) : (
        <div className="studio-table-wrap">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Cover</th>
                <th>Project Title & Tagline</th>
                <th>Category</th>
                <th>Tech Stack</th>
                <th>Team</th>
                <th>Featured</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, idx) => (
                <tr key={project.id}>
                  <td className="studio-order-cell">
                    <span className="studio-order-badge">#{project.order || idx + 1}</span>
                  </td>
                  <td className="studio-img-cell">
                    <div className="studio-thumb-preview">
                      <Image
                        src={project.coverImage || "/assets/projects/foodmart/1.webp"}
                        alt={project.title}
                        fill
                        sizes="60px"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="studio-project-title-cell">
                      <strong>{project.title}</strong>
                      <small>{project.tagline}</small>
                    </div>
                  </td>
                  <td>
                    <span className="studio-badge-category">{project.category}</span>
                  </td>
                  <td>
                    <div className="studio-chips-cell">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="studio-chip-sm">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && (
                        <small className="text-muted">+{project.technologies.length - 3}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="studio-badge-team">
                      {project.teamSize && project.teamSize > 1 ? `${project.teamSize} Orang` : "Solo"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`studio-star-btn ${project.featured ? "active" : ""}`}
                      onClick={() => toggleFeatured(project)}
                      title={project.featured ? "Featured on homepage" : "Mark as featured"}
                    >
                      <Star size={16} fill={project.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="studio-action-row">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="studio-icon-btn"
                          title="Open Live URL"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <Link
                        href={`/daffa-studio/projects/${project.id}/edit`}
                        className="studio-icon-btn"
                        title="Edit Project"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project)}
                        className="studio-icon-btn studio-btn-danger"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
