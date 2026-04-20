import { useParams, useNavigate } from "react-router-dom";
import { useCarDetails } from "../../../hooks/useCarDetails";

import Breadcrumb from "./components/detailscar/Breadcrumb";
import ImageGallery from "./components/detailscar/ImageGallery";
import KeySpecs from "./components/detailscar/KeySpecs";
import AdditionalInfo from "./components/detailscar/AdditionalInfo";
import AboutSection from "./components/detailscar/AboutSection";
import AgencyCard from "./components/detailscar/AgencyCard";
import PricingCard from "./components/detailscar/PricingCard";

import "../../../styles/pages/cardetails.css";

export default function DetailsCars() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { car, loading, error } = useCarDetails(id);

  /* ---- Loading ---- */
  if (loading) {
    return (
      <div className="car-details car-details--loading">
        <div className="car-details__loader">
          <div className="spinner" />
          <p>Chargement des détails du véhicule…</p>
        </div>
      </div>
    );
  }

  /* ---- Error ---- */
  if (error || !car) {
    return (
      <div className="car-details car-details--error">
        <div className="car-details__error">
          <h2>Voiture non trouvée</h2>
          <p>{error?.message || "Cette voiture n'existe pas ou a été supprimée."}</p>
          <button className="car-details__btn-back" onClick={() => navigate("/cars")}>
            ← Retour aux voitures
          </button>
        </div>
      </div>
    );
  }

  const statusLabel =
    car.status === "available"
      ? "Disponible"
      : car.status === "reserved"
      ? "Réservé"
      : "Indisponible";

  return (
    <div className="car-details">
      {/* Breadcrumb */}
      <Breadcrumb
        city={car.agency?.city}
        brand={car.brand}
        model={car.model}
      />

      <div className="car-details__container">
        {/* ═══ COLONNE GAUCHE ═══ */}
        <div className="car-details__main">

          {/* Header : titre + status */}
          <div className="car-details__header">
            <div className="car-details__title-section">
              <div className="car-details__tags">
                {car.agency?.city && (
                  <span className="car-details__tag">{car.agency.city}</span>
                )}
                {car.fuel && (
                  <span className="car-details__tag">{car.fuel}</span>
                )}
              </div>
              <h1 className="car-details__title">
                {car.brand}{" "}
                <span className="car-details__model">{car.model}</span>
                {car.version && (
                  <span className="car-details__model"> {car.version}</span>
                )}
              </h1>
              <p className="car-details__description">
                {car.description ||
                  "Le summum du confort et de l'élégance pour vos trajets au cœur du Maroc."}
              </p>
            </div>
            <span
              className={`car-details__status car-details__status--${car.status?.toLowerCase()}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Gallery */}
          <ImageGallery
            coverImage={car.cover_image}
            gallery={car.gallery}
            year={car.year}
          />


          <KeySpecs car={car} />

          {/* Équipements */}
          <AdditionalInfo additional_information={car.additional_information} />

          {/* Description */}
          <AboutSection description={car.description} />

          {/* Agence */}
          <AgencyCard agency={car.agency} />
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <aside className="car-details__sidebar">
          <PricingCard car={car} />
        </aside>
      </div>
    </div>
  );
}