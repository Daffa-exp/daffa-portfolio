"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Check } from "lucide-react";
import type { Certificate } from "@/lib/types";

export default function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    description: "",
    credentialUrl: "",
    imageUrl: "",
    featured: true,
    order: 1
  });

  useEffect(() => {
    async function loadCert() {
      try {
        setLoading(true);
        const res = await fetch(`/api/studio/certificates/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Sertifikat tidak ditemukan");
        const data: Certificate = await res.json();
        setFormData({
          title: data.title || "",
          issuer: data.issuer || "",
          issueDate: data.issueDate || "",
          description: data.description || "",
          credentialUrl: data.credentialUrl || "",
          imageUrl: data.imageUrl || "",
          featured: Boolean(data.featured),
          order: data.order || 1
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat sertifikat");
        }
      } finally {
        setLoading(false);
      }
    }
    loadCert();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/studio/certificates/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui sertifikat");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/daffa-studio/certificates");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memperbarui sertifikat");
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
          <Link href="/daffa-studio/certificates" className="studio-back-link">
            <ArrowLeft size={16} /> Kembali ke Daftar Sertifikat
          </Link>
          <h1>Edit Sertifikat: {formData.title}</h1>
          <p>Perbarui informasi sertifikat, tautan verifikasi, atau gambar.</p>
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
          <span>Sertifikat berhasil diperbarui! Mengalihkan...</span>
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
              placeholder="Judul sertifikat..."
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
                placeholder="Penerbit..."
                required
              />
            </div>
            <div className="studio-field">
              <label>Tanggal Terbit *</label>
              <input
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                placeholder="Tanggal terbit..."
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
              placeholder="Deskripsi..."
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
              required
            />
          </div>

          <div className="studio-field">
            <label>Credential Verification URL</label>
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
