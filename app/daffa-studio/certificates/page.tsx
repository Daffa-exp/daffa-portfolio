"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Award,
  AlertCircle
} from "lucide-react";
import type { Certificate } from "@/lib/types";

export default function StudioCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCerts() {
    try {
      setLoading(true);
      const res = await fetch("/api/studio/certificates");
      if (res.ok) {
        const data = await res.json();
        setCerts(data);
      }
    } catch (e) {
      console.error("Failed to load certificates", e);
      setError("Gagal memuat sertifikat");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCerts();
  }, []);

  async function handleDelete(cert: Certificate) {
    const ok = window.confirm(`Hapus sertifikat "${cert.title}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/studio/certificates/${cert.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCerts((prev) => prev.filter((c) => c.id !== cert.id));
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus sertifikat");
      }
    } catch (e) {
      console.error("Failed to delete certificate", e);
    }
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <div>
          <div className="studio-kicker">CREDENTIALS CMS</div>
          <h1>Certificates CMS</h1>
          <p>Kelola sertifikasi dan lisensi profesional yang tampil di carousel beranda.</p>
        </div>
        <div className="studio-actions">
          <Link href="/daffa-studio/certificates/new" className="studio-btn studio-btn-primary">
            <Plus size={16} /> Tambah Sertifikat
          </Link>
        </div>
      </div>

      {error && (
        <div className="studio-alert studio-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="studio-spinner-wrap">
          <div className="studio-spinner" />
        </div>
      ) : certs.length === 0 ? (
        <div className="studio-empty-state">
          <Award size={36} />
          <p>Belum ada sertifikat yang terdaftar.</p>
        </div>
      ) : (
        <div className="studio-table-wrap">
          <table className="studio-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Preview</th>
                <th>Certificate Title</th>
                <th>Issuer & Date</th>
                <th>Credential Link</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((cert, idx) => (
                <tr key={cert.id}>
                  <td className="studio-order-cell">
                    <span className="studio-order-badge">#{cert.order || idx + 1}</span>
                  </td>
                  <td className="studio-img-cell">
                    <div className="studio-thumb-cert">
                      <Image
                        src={cert.imageUrl || "/assets/certs/cert1.jpg"}
                        alt={cert.title}
                        fill
                        sizes="80px"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="studio-project-title-cell">
                      <strong>{cert.title}</strong>
                      <small>{cert.description || "Tidak ada deskripsi tambahan"}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{cert.issuer}</strong>
                      <div className="text-muted"><small>{cert.issueDate}</small></div>
                    </div>
                  </td>
                  <td>
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="studio-link-tag"
                      >
                        Verify Credential <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="studio-action-row">
                      <Link
                        href={`/daffa-studio/certificates/${cert.id}/edit`}
                        className="studio-icon-btn"
                        title="Edit Certificate"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(cert)}
                        className="studio-icon-btn studio-btn-danger"
                        title="Delete Certificate"
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
