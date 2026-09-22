"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Upload,
  Image as ImageIcon
} from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    hidden: false,
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

  function setAsCover(url: string) {
    setFormData((prev) => ({
      ...prev,
      coverImage: url,
      galleryImages: prev.galleryImages.includes(url)
        ? prev.galleryImages
        : [url, ...prev.galleryImages]
    }));
  }

  function addGalleryImage() {
    const trimmed = newGalleryUrl.trim();
    if (!trimmed) return;
    setFormData((prev) => {
      const updated = prev.galleryImages.includes(trimmed)
        ? prev.galleryImages
        : [...prev.galleryImages, trimmed];
      return {
        ...prev,
        coverImage: prev.coverImage || trimmed,
        galleryImages: updated
      };
    });
    setNewGalleryUrl("");
  }

  function removeGalleryImage(idx: number) {
    setFormData((prev) => {
      const removedUrl = prev.galleryImages[idx];
      const updated = prev.galleryImages.filter((_, i) => i !== idx);
      let newCover = prev.coverImage;
      if (prev.coverImage === removedUrl) {
        newCover = updated[0] || "";
      }
      return {
        ...prev,
        coverImage: newCover,
        galleryImages: updated
      };
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setError("");
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);
        data.append("alt", `${formData.title || "Project"} screenshot ${i + 1}`);

        const res = await fetch("/api/studio/media/upload", {
          method: "POST",
          body: data
        });

        if (res.ok) {
          const item = await res.json();
          if (item?.url) {
            setFormData((prev) => {
              const updated = prev.galleryImages.includes(item.url)
                ? prev.galleryImages
                : [...prev.galleryImages, item.url];
              return {
                ...prev,
                coverImage: prev.coverImage || item.url,
                galleryImages: updated
              };
            });
          }
        } else {
          const errData = await res.json();
          throw new Error(errData.error || `Gagal mengunggah gambar ${file.name}`);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal mengunggah gambar");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
          <p>Lengkapi informasi proyek, tentukan foto cover utama, dan atur visibilitas.</p>
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
            <label>Deskripsi Lengkap (Modal view &amp; AI Knowledge) *</label>
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
          <h3>Kolaborasi &amp; Peran</h3>
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
          <h3>Tautan &amp; Gambar Proyek</h3>

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

          {/* Dedicated Visual Cover Photo Manager */}
          <div className="studio-cover-section">
            <div className="studio-cover-header">
              <div>
                <label className="studio-label-highlight">
                  <Star size={15} className="text-amber-400" /> Foto Cover Utama (Aktif) *
                </label>
                <p className="studio-subtext">
                  Foto ini yang akan muncul sebagai thumbnail utama di kartu beranda portofolio.
                </p>
              </div>
            </div>

            <div className="studio-cover-card-preview">
              <div className="studio-cover-img-wrap">
                {formData.coverImage ? (
                  <Image
                    src={formData.coverImage}
                    alt="Cover preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="studio-cover-img"
                  />
                ) : (
                  <div className="studio-cover-empty">
                    <ImageIcon size={32} />
                    <span>Belum ada foto cover yang dipilih</span>
                  </div>
                )}
                {formData.coverImage && (
                  <span className="studio-cover-badge-active">
                    <CheckCircle2 size={13} /> ACTIVE COVER PHOTO
                  </span>
                )}
              </div>

              <div className="studio-cover-info-box">
                <label>URL Foto Cover</label>
                <input
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="/assets/projects/... atau /uploads/..."
                  required
                />
                <small className="text-muted">
                  Tip: Klik tombol <strong>&quot;Jadikan Cover&quot;</strong> pada salah satu screenshot galeri di bawah untuk mengganti cover secara instan.
                </small>
              </div>
            </div>
          </div>

          {/* Visual Gallery Manager */}
          <div className="studio-field" style={{ marginTop: 24 }}>
            <div className="studio-gallery-head">
              <div>
                <label>Galeri Screenshot Proyek</label>
                <p className="studio-subtext">
                  Daftar seluruh screenshot yang akan tampil di slider modal case study.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="studio-btn studio-btn-secondary studio-btn-sm"
                >
                  <Upload size={14} /> {uploading ? "Mengunggah..." : "Upload Foto"}
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="studio-gallery-grid-visual">
              {formData.galleryImages.map((img, i) => {
                const isCover = formData.coverImage === img;
                return (
                  <div key={i} className={`studio-gallery-card ${isCover ? "is-cover" : ""}`}>
                    <div className="studio-gallery-card-thumb">
                      <Image
                        src={img}
                        alt={`Screenshot ${i + 1}`}
                        fill
                        sizes="140px"
                        className="studio-thumb-img"
                      />
                      {isCover && (
                        <span className="studio-cover-pill">
                          <Star size={11} fill="currentColor" /> COVER
                        </span>
                      )}
                    </div>
                    <div className="studio-gallery-card-actions">
                      {!isCover ? (
                        <button
                          type="button"
                          onClick={() => setAsCover(img)}
                          className="studio-btn-cover-set"
                          title="Jadikan sebagai foto cover utama"
                        >
                          <Star size={12} /> Jadikan Cover
                        </button>
                      ) : (
                        <span className="studio-cover-selected-text">
                          <CheckCircle2 size={12} /> Foto Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="studio-btn-icon-danger"
                        title="Hapus screenshot ini"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick append URL */}
            <div className="studio-input-append" style={{ marginTop: 12 }}>
              <input
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Atau tempel URL gambar (/assets/... atau https://...)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="studio-btn studio-btn-secondary"
              >
                <Plus size={15} /> Tambah URL
              </button>
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
            <div className="studio-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="hidden"
                  checked={formData.hidden}
                  onChange={handleChange}
                />
                <span>Sembunyikan dari Portofolio Publik (Draft / Hidden)</span>
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
