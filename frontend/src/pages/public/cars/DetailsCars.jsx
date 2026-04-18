import { useParams, useNavigate } from "react-router-dom";
import { useCarDetails } from "../../../hooks/useCarDetails";
// import Breadcrumb from "./components/CarDetails/Breadcrumb";
// import ImageGallery from "./components/CarDetails/ImageGallery";
// import KeySpecs from "./components/CarDetails/KeySpecs";
// import PricingCard from "./components/CarDetails/PricingCard";
// import AboutSection from "./components/CarDetails/AboutSection";
// import AgencyCard from "./components/CarDetails/AgencyCard";
// import "../../../styles/pages/car-details.css";

export default function DetailsCars() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { car, loading, error } = useCarDetails(id);
  console.log("🚗 Car Details:", car);
  if (loading) {
    return (
      <div className="car-details car-details--loading">
        <div className="car-details__loader">
          <div className="spinner" />
          <p>Chargement des détails du véhicule...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="car-details car-details--error">
        <div className="car-details__error">
          <h2>Voiture non trouvée</h2>
          <p>
            {error?.message || "Cette voiture n'existe pas ou a été supprimée."}
          </p>
          <button
            className="car-details__btn-back"
            onClick={() => navigate("/cars")}
          >
            ← Retour aux voitures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="car-details">

      {/* Contenu principal */}
      <div className="car-details__container">
        {/* Colonne gauche : Galerie + Infos */}
        <div className="car-details__main">
          {/* Hero Header */}
          <div className="car-details__header">
            <div className="car-details__title-section">
              <h1 className="car-details__title">
                {car.brand}{" "}
                <span className="car-details__model">{car.model}</span>
              </h1>
              <p className="car-details__description">
                {car.description ||
                  "Luxe et performance exceptionnelle au service de votre confort."}
              </p>
            </div>
            <div className="car-details__badge">
              <span
                className={`car-details__status car-details__status--${car.status?.toLowerCase()}`}
              >
                {car.status === "available" ? "Disponible" : car.status}
              </span>
            </div>
          </div>




        </div>

        <aside className="car-details__sidebar">
        </aside>
      </div>
    </div>
  );
}
