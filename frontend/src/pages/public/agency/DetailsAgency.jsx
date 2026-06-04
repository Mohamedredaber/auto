import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAgencyProfile } from "../../../features/public/agencyPublicThunk";
import {
  selectAgencyProfile,
  selectIsProfileLoading,
  selectAgencyFleet,
} from "../../../features/public/agencyPublicSelectors";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Users,
  FileText,
} from "lucide-react";
import StatusBadge from "./components/StatusBadge";
import "./AgencyProfile.css";

const AgencyProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const agency = useSelector(selectAgencyProfile);
  const loading = useSelector(selectIsProfileLoading);
  const fleet = useSelector(selectAgencyFleet);

  useEffect(() => {
    if (id) dispatch(getAgencyProfile(id));
  }, [dispatch, id]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="ap-container" data-layout-fixed="true">
        <div className="ap-skeleton-hero" />
        <div className="ap-skeleton-content" />
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (!agency) {
    return (
      <div className="ap-container" data-layout-fixed="true">
        <div className="ap-error-state">
          <FileText size={48} className="ap-error-icon" />
          <h2>Agence introuvable</h2>
          <p>Désolé, nous n'avons pas trouvé cette agence.</p>
        </div>
      </div>
    );
  }

  const rating = agency.stats?.rating ?? 4.5;
  const reviewCount = agency.stats?.reviews ?? 128;

  /* ---------- RENDER ---------- */
  return (
    <div className="ap-container" data-layout-fixed="true">
      {/* ====== HERO ====== */}
      <div className="ap-hero">
        <div className="ap-hero-overlay" />

        <div className="ap-inner">
          <div className="ap-hero-content">
            {/* Logo */}
            <div className="ap-logo-wrapper">
              <img src={agency.logo || "/default-logo.png"} alt={agency.name} />
              {agency.is_verified && (
                <span className="ap-verified-badge">✓</span>
              )}
            </div>

            {/* Agency meta */}
            <div className="ap-header-info">
              <h1 className="ap-agency-name">{agency.name}</h1>

              <div className="ap-location-info">
                <MapPin size={16} />
                <span>
                  {agency.city} • {agency.address}
                </span>
              </div>

              <div className="ap-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(rating)
                        ? "ap-star-filled"
                        : "ap-star-empty"
                    }
                  />
                ))}
                <span className="ap-rating-text">({reviewCount} avis)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== STATS ====== */}
      <div className="ap-stats-section">
        <div className="ap-inner">
          <div className="ap-stat-card">
            <div className="ap-stat-icon ap-icon-vehicles">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-value">
                {agency.stats?.total_available_cars ?? 0}
              </span>
              <span className="ap-stat-label">Véhicules</span>
            </div>
          </div>

          <div className="ap-stat-card">
            <div className="ap-stat-icon ap-icon-clients">
              <Users size={24} />
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-value">
                {agency.stats?.happy_clients ?? 0}+
              </span>
              <span className="ap-stat-label">Clients</span>
            </div>
          </div>

          <div className="ap-stat-card">
            <div className="ap-stat-icon ap-icon-experience">
              <Clock size={24} />
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-value">
                {agency.experience_years ?? 5}+
              </span>
              <span className="ap-stat-label">Ans d'expérience</span>
            </div>
          </div>

          <div className="ap-stat-card">
            <div className="ap-stat-icon ap-icon-rating">
              <Star size={24} />
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-value">{rating.toFixed(1)}/5</span>
              <span className="ap-stat-label">Évaluation</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== INFO CARDS ====== */}
      <div className="ap-info-section">
        <div className="ap-inner">
          <div className="ap-info-grid">
            {/* À propos */}
            <div className="ap-info-card">
              <h3 className="ap-info-title">À propos</h3>
              <p className="ap-info-text">
                {agency.description ||
                  "Bienvenue chez notre agence de location de véhicules. Nous offrons une large gamme de véhicules de haute qualité à des prix compétitifs."}
              </p>
            </div>

            {/* Contact */}
            <div className="ap-info-card">
              <h3 className="ap-info-title">Contact</h3>

              <div className="ap-contact-item">
                <Phone size={16} />
                <a href={`tel:${agency.phone}`}>{agency.phone}</a>
              </div>
              <div className="ap-contact-item">
                <Mail size={16} />
                <a href={`mailto:${agency.email}`}>{agency.email}</a>
              </div>
              <div className="ap-contact-item">
                <MapPin size={16} />
                <span>{agency.full_address}</span>
              </div>
            </div>

            {/* Horaires */}
            {agency.working_hours && (
              <div className="ap-info-card">
                <h3 className="ap-info-title">Horaires</h3>
                <div className="ap-hours-grid">
                  <div className="ap-hours-item">
                    <span>Lun–Ven</span>
                    <span className="ap-hours-value">
                      {agency.working_hours.start?.slice(0, 5)} –{" "}
                      {agency.working_hours.end?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="ap-hours-item">
                    <span>Samedi</span>
                    <span className="ap-hours-value">
                      {agency.working_hours.saturday || "09:00 – 18:00"}
                    </span>
                  </div>
                  <div className="ap-hours-item">
                    <span>Dimanche</span>
                    <span className="ap-hours-value">
                      {agency.working_hours.sunday || "Fermé"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== FLEET ====== */}
      <div className="ap-fleet-section">
        <div className="ap-inner">
          <div className="ap-fleet-header">
            <h2 className="ap-section-title">Notre Flotte</h2>
            <p className="ap-section-subtitle">
              {fleet?.length ?? 0} véhicules disponibles
            </p>
          </div>

          {fleet && fleet.length > 0 ? (
            <div className="ap-fleet-grid">
              {fleet.map((car) => {
                const featureList = car.features
                  ? car.features.split(",").map((f) => f.trim())
                  : [];

                return (
                  <div key={car.id} className="ap-car-card">
                    {/* Image */}
                    <div className="ap-car-image-wrapper">
                      <img
                        src={car.image || "/default-car.png"}
                        alt={`${car.brand} ${car.model}`}
                        className="ap-car-image"
                      />
                      <div className="ap-car-overlay">
                        <button className="ap-btn-primary">
                          Voir les détails
                        </button>
                      </div>
                      <StatusBadge status={car.status || "available"} />
                    </div>

                    {/* Body */}
                    <div className="ap-car-body">
                      <div className="ap-car-header">
                        <h3 className="ap-car-title">
                          {car.brand}{" "}
                          <span className="ap-car-model">{car.model}</span>
                        </h3>
                      </div>

                      {/* Specs */}
                      <div className="ap-car-specs">
                        <span className="ap-spec-item">
                          <span className="ap-spec-label">Trans :</span>
                          {car.transmission}
                        </span>
                        <span className="ap-spec-separator">•</span>
                        <span className="ap-spec-item">
                          <span className="ap-spec-label">Catég :</span>
                          {car.category}
                        </span>
                        {car.seats && (
                          <>
                            <span className="ap-spec-separator">•</span>
                            <span className="ap-spec-item">
                              <span className="ap-spec-label">Places :</span>
                              {car.seats}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Features */}
                      {featureList.length > 0 && (
                        <div className="ap-car-features">
                          {featureList.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="ap-feature-tag">
                              {feature}
                            </span>
                          ))}
                          {featureList.length > 3 && (
                            <span className="ap-feature-more">
                              +{featureList.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="ap-car-footer">
                        <div className="ap-car-price">
                          <span className="ap-price-value">
                            {car.price_per_day}
                          </span>
                          <span className="ap-price-unit">MAD/jour</span>
                        </div>
                        <a href={`/car/${car.id}`} className="ap-btn-secondary">
                          Réserver
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ap-empty-state">
              <p>Aucun véhicule disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyProfile;
