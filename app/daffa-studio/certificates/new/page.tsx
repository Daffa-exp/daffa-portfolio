"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    description: "",
    credentialUrl: "",
    imageUrl: "/assets/certs/cert1.jpg",
    featured: true,
    order: 1
  });

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/studio/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan sertifikat");
      }

      router.push("/daffa-studio/certificates");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat sertifikat");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <div>
          <Link href="/daffa-studio/certificates" className="studio-back-link">
            <ArrowLeft size={16} /> Kembali ke Daftar Sertifikat
          </Link>
          <h1>Tambah Sertifikat Baru</h1>
          <p>Tambahkan kredensial pelatihan, kursus, atau lisensi resmi.</p>
        </div>
      </div>

      {error && (
        <div className="studio-alert studio-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="studio-form-grid">
        <div className="studio-card">
          <h3>Detail Sertifikasi</h3>

          <div className="studio-field">
            <label>Judul Sertifikat *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Dasar dan Penggunaan Generatif AI"
              required
            />
          </div>

          <div className="studio-form-row">
            <div className="studio-field">
              <label>Penerbit / Penyelenggara *</label>
              <input
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="Contoh: Codepolitan, Dicoding, Komdigi..."
                required
              />
            </div>
            <div className="studio-field">
              <label>Tanggal Terbit *</label>
              <input
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                placeholder="Contoh: 22 April 2026"
                required
              />
            </div>
          </div>

          <div className="studio-field">
            <label>Deskripsi Pembelajaran</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan topik yang dipelajari atau kompetensi yang diraih..."
            />
          </div>
        </div>

        <div className="studio-card">
          <h3>Gambar & Kredensial</h3>

          <div className="studio-field">
            <label>Image URL *</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="/assets/certs/cert1.jpg atau /uploads/..."
              required
            />
          </div>

          <div className="studio-field">
            <label>Credential Verification URL (Opsional)</label>
            <input
              type="url"
              name="credentialUrl"
              value={formData.credentialUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="studio-form-row">
            <div className="studio-field">
              <label>Urutan Carousel</label>
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
                <span>Tampilkan di Carousel Beranda</span>
              </label>
            </div>
          </div>
        </div>

        <div className="studio-form-actions">
          <Link href="/daffa-studio/certificates" className="studio-btn studio-btn-ghost">
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="studio-btn studio-btn-primary"
          >
            <Save size={16} /> {loading ? "Menyimpan..." : "Simpan Sertifikat"}
          </button>
        </div>
      </form>
    </div>
  );
}
