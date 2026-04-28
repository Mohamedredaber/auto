import { useParams, useNavigate } from "react-router-dom";
import { useCarDetails } from "../../../hooks/useCarDetails";
import Breadcrumb from "./components/detailscar/Breadcrumb";
import ImageGallery from "./components/detailscar/ImageGallery";
import KeySpecs from "./components/detailscar/KeySpecs";
import AdditionalInfo from "./components/detailscar/AdditionalInfo";
import AboutSection from "./components/detailscar/AboutSection";
import AgencyCard from "./components/detailscar/AgencyCard";
import PricingCard from "./components/detailscar/PricingCard";
import { useSelector } from "react-redux";
import { selectUser ,selectRole } from "../../../features/auth/authSelectors";
import "../../../styles/pages/cardetails.css";
import AlreadyBooked from "../../client/reservation/components/AlreadyBooked";
import { useMemo } from "react";
export default function DetailsCars() {
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const isClient = role === "client";
  const { id } = useParams();
  const navigate = useNavigate();
  const { car, loading, error } = useCarDetails(id);
  console.log(user);
  console.log("Car Details:", car, "Loading:", loading, "Error:", error);
  const alreadyBookedByUser = useMemo(() => {
    if (!user?.id || !car?.bookings?.length) return false;
    return car.bookings.some((b) => b.user_id === user.id);
  });
  console.log("Already Booked By User:", alreadyBookedByUser);
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

        <aside className="car-details__sidebar">
       {alreadyBookedByUser ? (
  <AlreadyBooked onBack={() => navigate(`/cars/${id}`)} />
) : isClient ? (
  <PricingCard car={car} />
) : (
  <div className="car-details__no-booking">
    <h3>Accès restreint</h3>
    <p>
      La réservation est disponible uniquement pour les clients.
    </p>

    {role === "admin_agency" && (
      <button
        className="car-details__action-btn"
        onClick={() => navigate("/dashboard/agency")}
      >
        Aller au dashboard
      </button>
    )}

    {role === "super_admin" && (
      <button
        className="car-details__action-btn"
        onClick={() => navigate("/dashboard/admin")}
      >
        Panneau admin
      </button>
    )}
  </div>
)}
        </aside>
      </div>
    </div>
  );
}