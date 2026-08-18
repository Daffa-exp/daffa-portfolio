"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, AlertCircle, Plus, Trash2 } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    technologies: "Next.js, TypeScript, Tailwind CSS",
    projectUrl: "",
    githubUrl: "",
    coverImage: "/assets/projects/foodmart/1.webp",
    galleryImages: ["/assets/projects/foodmart/1.webp"],
    featured: false,
    order: 1
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/studio/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(",").map((s) => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat proyek");
      }

      router.push("/daffa-studio/projects");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat proyek");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <div>
          <Link href="/daffa-studio/projects" className="studio-back-link">
            <ArrowLeft size={16} /> Kembali ke Daftar Proyek
          </Link>
          <h1>Tambah Proyek Baru</h1>
          <p>Lengkapi informasi proyek dengan akurat dan detail.</p>
        </div>
      </div>

      {error && (
        <div className="studio-alert studio-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
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
              placeholder="Contoh: Foodmart, InstanPage..."
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
                placeholder="foodmart (otomatis dari judul jika kosong)"
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
              placeholder="Contoh: Platform pemesanan makanan online"
              required
            />
          </div>

          <div className="studio-field">
            <label>Deskripsi Singkat (Card view) *</label>
            <textarea
              name="shortDescription"
              rows={2}
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Ringkasan 1-2 kalimat..."
              required
            />
          </div>

          <div className="studio-field">
            <label>Deskripsi Lengkap (Modal view & AI Knowledge) *</label>
            <textarea
              name="fullDescription"
              rows={5}
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="Jelaskan arsitektur, tujuan, fitur, dan implementasi teknis..."
              required
            />
          </div>
        </div>

        {/* Team & Collaboration Details */}
        <div className="studio-card">
          <h3>Kolaborasi & Peran</h3>
          <p className="studio-subtext">
            Sebutkan ukuran tim dan peran spesifik secara jujur (misal: InstanPage tim 3 orang).
          </p>

          <div className="studio-form-row">
            <div className="studio-field">
              <label>Peran Daffa</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Full-Stack Developer, Backend Contributor..."
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
              placeholder="Jelaskan kontribusi nyata, koordinasi tim, atau tools yang digunakan bersama..."
            />
          </div>

          <div className="studio-field">
            <label>Teknologi / Tech Stack (Pisahkan dengan koma) *</label>
            <input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="Next.js, TypeScript, Tailwind CSS, Prisma"
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
              placeholder="/assets/projects/foodmart/1.webp"
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
                  placeholder="Tambahkan URL screenshot (/assets/... atau /uploads/...)"
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
            disabled={loading}
            className="studio-btn studio-btn-primary"
          >
            <Save size={16} /> {loading ? "Menyimpan..." : "Simpan Proyek"}
          </button>
        </div>
      </form>
    </div>
  );
}
