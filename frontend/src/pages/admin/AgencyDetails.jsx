import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, X } from "lucide-react";
import { fetchAdminAgency } from "../../api/adminAgenciesApi";
import "../../styles/pages/AdminAgencyDetails.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_LABELS = {
  verified: "Verifiee",
  inverified: "Bloquee",
  wait: "En attente",
};

const resolveLogoUrl = (logo, logoUrl) => {
  const candidate = logoUrl || logo;
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) {
    if (candidate.startsWith("http://localhost/") || candidate.startsWith("https://localhost/")) {
      return `${API_BASE}${candidate.replace(/^https?:\/\/localhost/i, "")}`;
    }
    return candidate;
  }
  if (candidate.startsWith("/storage/")) return `${API_BASE}${candidate}`;
  if (candidate.startsWith("storage/")) return `${API_BASE}/${candidate}`;
  return `${API_BASE}/storage/${candidate.replace(/^\/+/, "")}`;
};

export default function AdminAgencyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAgency = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchAdminAgency(id);
        if (isMounted) {
          setAgency(data?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || "Erreur lors du chargement");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadAgency();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const logoUrl = resolveLogoUrl(agency?.logo, agency?.logo_url);

  return (
    <div className="admin-agency-details">
      <div className="admin-agency-details-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Retour
        </button>
        <div className="title">
          <div className="icon">
            <Building2 size={20} />
          </div>
          <div>
            <h1>Details agence</h1>
            <p>Informations principales et statut.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="details-card">Chargement...</div>
      ) : error ? (
        <div className="details-card error">{error}</div>
      ) : agency ? (
        <div className="details-card">
          <div className="agency-hero">
            {/* Clickable logo */}
            <div
              className="agency-logo"
              onClick={() => setLightboxOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
              aria-label="Voir le logo en grand"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={agency.agency_name} />
              ) : (
                <span>{(agency.agency_name || "A").charAt(0)}</span>
              )}
            </div>

            <div className="agency-headline">
              <h2>{agency.agency_name}</h2>
              <p>{agency.city || "-"}</p>
            </div>
            <span className={`status ${agency.is_verified || "wait"}`}>
              {STATUS_LABELS[agency.is_verified] || agency.is_verified || "-"}
            </span>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Adresse</span>
              <span className="value">{agency.address || "-"}</span>
            </div>
            <div className="detail-item">
              <span className="label">Horaires</span>
              <span className="value">
                {(agency.time_start || "--:--").slice(0, 5)} -
                {(agency.time_end || "--:--").slice(0, 5)}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Flotte</span>
              <span className="value">
                {agency.cars_count ?? agency.fleet_count ?? "-"} vehicules
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Latitude</span>
              <span className="value">
                {agency.latitude !== null && agency.latitude !== undefined
                  ? agency.latitude
                  : "-"}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Longitude</span>
              <span className="value">
                {agency.longitude !== null && agency.longitude !== undefined
                  ? agency.longitude
                  : "-"}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Creation</span>
              <span className="value">
                {agency.created_at
                  ? new Date(agency.created_at).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="details-card">Agence introuvable.</div>
      )}

      {/* ── Logo Lightbox ── */}
      {lightboxOpen && (
        <div className="logo-lightbox" role="dialog" aria-modal="true" aria-label="Logo agence">
          <div
            className="logo-lightbox-backdrop"
            onClick={() => setLightboxOpen(false)}
          />
          <button
            className="logo-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
          <div className="logo-lightbox-content">
            {logoUrl ? (
              <img
                className="logo-lightbox-img"
                src={logoUrl}
                alt={agency?.agency_name}
              />
            ) : (
              <div className="logo-lightbox-placeholder">
                {(agency?.agency_name || "A").charAt(0)}
              </div>
            )}
            {agency?.agency_name && (
              <span className="logo-lightbox-label">{agency.agency_name}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}