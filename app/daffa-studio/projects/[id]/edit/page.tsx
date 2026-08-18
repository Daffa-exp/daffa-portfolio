"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Plus, Trash2, Bot, Check } from "lucide-react";
import type { Project, AICopilotSuggestion } from "@/lib/types";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotSuggestion, setCopilotSuggestion] = useState<AICopilotSuggestion | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "FULL-STACK WEB",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    role: "Full-Stack Developer",
    teamSize: 1,
    collaborationDescription: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
    coverImage: "",
    galleryImages: [] as string[],
    featured: false,
    order: 1
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        const res = await fetch(`/api/studio/projects/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Proyek tidak ditemukan");
        const data: Project = await res.json();
        setFormData({
          title: data.title || "",
          slug: data.slug || data.id,
          category: data.category || "FULL-STACK WEB",
          tagline: data.tagline || "",
          shortDescription: data.shortDescription || "",
          fullDescription: data.fullDescription || "",
          role: data.role || "Developer",
          teamSize: data.teamSize || 1,
          collaborationDescription: data.collaborationDescription || "",
          technologies: Array.isArray(data.technologies) ? data.technologies.join(", ") : "",
          projectUrl: data.projectUrl || "",
          githubUrl: data.githubUrl || "",
          coverImage: data.coverImage || "",
          galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
          featured: Boolean(data.featured),
          order: data.order || 1
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat proyek");
        }
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [resolvedParams.id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function addGalleryImage() {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl("");
  }

  function removeGalleryImage(idx: number) {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx)
    }));
  }

  async function handleCopilotHelp() {
    try {
      setCopilotLoading(true);
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Tingkatkan deskripsi proyek ${formData.title} agar lebih profesional, ringkas, dan menonjolkan kemampuan teknis.`,
          contextId: resolvedParams.id,
          type: "project"
        })
      });
      const data = await res.json();
      if (data.suggestion) {
        setCopilotSuggestion(data.suggestion);
      }
    } catch (e) {
      console.error("Copilot error", e);
    } finally {
      setCopilotLoading(false);
    }
  }

  function applyCopilotSuggestion() {
    if (!copilotSuggestion) return;
    if (copilotSuggestion.targetField === "fullDescription") {
      setFormData((prev) => ({ ...prev, fullDescription: copilotSuggestion.suggestedValue }));
    } else if (copilotSuggestion.targetField === "shortDescription") {
      setFormData((prev) => ({ ...prev, shortDescription: copilotSuggestion.suggestedValue }));
    } else if (copilotSuggestion.targetField === "tagline") {
      setFormData((prev) => ({ ...prev, tagline: copilotSuggestion.suggestedValue }));
    } else if (copilotSuggestion.targetField === "collaborationDescription") {
      setFormData((prev) => ({ ...prev, collaborationDescription: copilotSuggestion.suggestedValue }));
    }
    setCopilotSuggestion(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/studio/projects/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(",").map((s) => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui proyek");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/daffa-studio/projects");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memperbarui proyek");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="studio-page">
        <div className="studio-spinner" />
      </div>
    );
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <div>
          <Link href="/daffa-studio/projects" className="studio-back-link">
            <ArrowLeft size={16} /> Kembali ke Daftar Proyek
          </Link>
          <h1>Edit Proyek: {formData.title}</h1>
          <p>Perbarui rincian teknis, deskripsi, gambar, dan status tampilan.</p>
        </div>
        <div className="studio-actions">
          <button
            type="button"
            onClick={handleCopilotHelp}
            disabled={copilotLoading}
            className="studio-btn studio-btn-secondary"
          >
            <Bot size={16} /> {copilotLoading ? "AI Menganalisis..." : "Tingkatkan dengan Copilot"}
          </button>
        </div>
      </div>

      {error && (
        <div className="studio-alert studio-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="studio-alert studio-alert-success">
          <Check size={16} />
          <span>Proyek berhasil diperbarui! Mengalihkan...</span>
        </div>
      )}

      {/* AI Suggestion Box with [Apply Change] */}
      {copilotSuggestion && (
        <div className="studio-copilot-suggestion-card">
          <div className="studio-copilot-head">
            <Bot size={18} className="text-cyan-400" />
            <div>
              <strong>Rekomendasi AI Copilot untuk {copilotSuggestion.targetField}</strong>
              <small>{copilotSuggestion.rationale}</small>
            </div>
          </div>
          <div className="studio-diff-view">
            <div className="studio-diff-old">
              <span className="studio-diff-label">Saat Ini:</span>
              <p>{copilotSuggestion.originalValue}</p>
            </div>
            <div className="studio-diff-new">
              <span className="studio-diff-label">Saran Perbaikan:</span>
              <p>{copilotSuggestion.suggestedValue}</p>
            </div>
          </div>
          <div className="studio-copilot-actions">
            <button
              type="button"
              onClick={() => setCopilotSuggestion(null)}
              className="studio-btn studio-btn-ghost studio-btn-sm"
            >
              Abaikan
            </button>
            <button
              type="button"
              onClick={applyCopilotSuggestion}
              className="studio-btn studio-btn-primary studio-btn-sm"
            >
              <Check size={14} /> Terapkan Perubahan (Apply Change)
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="studio-form-grid">
        {/* Main Details */}
        <div className="studio-card">
          <h3>Informasi Utama</h3>

          <div className="studio-field">
            <label>Judul Proyek *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Foodmart..."
              required
            />
          </div>

          <div className="studio-form-row">
            <div className="studio-field">
              <label>Slug (URL Identifier)</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="foodmart"
                required
              />
            </div>
            <div className="studio-field">
              <label>Kategori *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="FULL-STACK WEB">FULL-STACK WEB</option>
                <option value="WEB APP">WEB APP</option>
                <option value="WEB EXPERIENCE">WEB EXPERIENCE</option>
                <option value="DESKTOP APP">DESKTOP APP</option>
                <option value="MOBILE APP">MOBILE APP</option>
                <option value="AI / COMPUTER VISION">AI / COMPUTER VISION</option>
                <option value="E-COMMERCE">E-COMMERCE</option>
                <option value="UTILITY WEB">UTILITY WEB</option>
                <option value="INTERACTIVE WEB">INTERACTIVE WEB</option>
              </select>
            </div>
          </div>

          <div className="studio-field">
            <label>Tagline *</label>
            <input
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Tagline..."
              required
            />
          </div>

          <div className="studio-field">
            <label>Deskripsi Singkat (Card View) *</label>
            <textarea
              name="shortDescription"
              rows={2}
              value={formData.shortDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="studio-field">
            <label>Deskripsi Lengkap (Modal View & AI Knowledge) *</label>
            <textarea
              name="fullDescription"
              rows={5}
              value={formData.fullDescription}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Team & Collaboration */}
        <div className="studio-card">
          <h3>Kolaborasi & Peran</h3>
          <div className="studio-form-row">
            <div className="studio-field">
              <label>Peran Daffa</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Role..."
              />
            </div>
            <div className="studio-field">
              <label>Ukuran Tim (Orang)</label>
              <input
                type="number"
                min={1}
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="studio-field">
            <label>Catatan Pembagian Tugas / Kolaborasi</label>
            <textarea
              name="collaborationDescription"
              rows={3}
              value={formData.collaborationDescription}
              onChange={handleChange}
              placeholder="Jelaskan pembagian peran secara jujur..."
            />
          </div>

          <div className="studio-field">
            <label>Teknologi (Pisahkan dengan koma) *</label>
            <input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="Next.js, TypeScript, Express, MySQL"
              required
            />
          </div>
        </div>

        {/* URLs & Media */}
        <div className="studio-card">
          <h3>Tautan & Gambar Proyek</h3>

          <div className="studio-form-row">
            <div className="studio-field">
              <label>Live Demo URL</label>
              <input
                type="url"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="studio-field">
              <label>GitHub Repository URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="studio-field">
            <label>Cover Image URL *</label>
            <input
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="studio-field">
            <label>Galeri Screenshot (Tambahan)</label>
            <div className="studio-gallery-builder">
              {formData.galleryImages.map((img, i) => (
                <div key={i} className="studio-gallery-item-row">
                  <span>{img}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="studio-btn-icon-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div className="studio-input-append">
                <input
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="URL screenshot..."
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="studio-btn studio-btn-secondary"
                >
                  <Plus size={15} /> Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="studio-card">
          <h3>Pengaturan Tampilan</h3>

          <div className="studio-form-row">
            <div className="studio-field">
              <label>Urutan Tampilan (Order Number)</label>
              <input
                type="number"
                min={1}
                name="order"
                value={formData.order}
                onChange={handleChange}
              />
            </div>
            <div className="studio-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <span>Tampilkan sebagai Featured Project di Beranda</span>
              </label>
            </div>
          </div>
        </div>

        <div className="studio-form-actions">
          <Link href="/daffa-studio/projects" className="studio-btn studio-btn-ghost">
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="studio-btn studio-btn-primary"
          >
            <Save size={16} /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
