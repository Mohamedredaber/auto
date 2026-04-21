import { useEffect, useMemo } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchcarselected } from "../../../features/booking/bookingThunks";
import { selectUser } from "../../../features/auth/authSelectors";
import {
  selectCarSelected,
  selectBookingLoading,
} from "../../../features/booking/bookingSelectors";
import AlreadyBooked from "./components/AlreadyBooked";
import ResCarCard from "./components/ResCarCard";
import ResBookingForm from "./components/ResBookingForm";
import "../../../styles/pages/reservation.css";

export default function ReservationPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectBookingLoading);
  const car = useSelector(selectCarSelected);

  const {
    subtotal: stateSubtotal,
    depart: stateDepart,
    retour: stateRetour,
  } = location.state || {};

  useEffect(() => {
    if (id) dispatch(fetchcarselected(id));
  }, [id, dispatch]);

  // Vérifie si l'utilisateur connecté a déjà une réservation active sur cette voiture
  const alreadyBookedByUser = useMemo(() => {
    if (!user?.id || !car?.bookings?.length) return false;
    return car.bookings.some((b) => b.user_id === user.id);
  }, [car, user]);

  /* ---- Loading ---- */
  if (isLoading) {
    return (
      <div className="reservation reservation--loading">
        <div className="reservation__loader">
          <div className="spinner" />
          <p>Chargement du véhicule…</p>
        </div>
      </div>
    );
  }

  /* ---- Not found ---- */
  if (!car) {
    return (
      <div className="reservation reservation--error">
        <div className="reservation__error-box">
          <h2>Véhicule introuvable</h2>
          <p>Ce véhicule n'existe pas ou a été supprimé.</p>
          <button
            className="res-cta"
            style={{ width: "auto", padding: "var(--space-3) var(--space-8)", margin: "0 auto" }}
            onClick={() => navigate("/cars")}
          >
            ← Retour aux voitures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation">
      <div className="reservation__wrapper">

        {/* Breadcrumb */}
        <nav className="reservation__breadcrumb">
          <Link to="/cars">Voitures</Link>
          <span>›</span>
          <Link to={`/cars/${id}`}>Détails</Link>
          <span>›</span>
          <strong>Réservation</strong>
        </nav>

        {/* Heading */}
        <div className="reservation__heading">
          <h1>Finalisez votre réservation</h1>
          <p>
            Vérifiez vos informations et confirmez votre trajet
            {car?.agency?.city ? ` vers ${car.agency.city}` : ""}.
          </p>
        </div>

        {/* Grid */}
        <div className="reservation__grid">
          <ResCarCard car={car} />

          {alreadyBookedByUser ? (
            <AlreadyBooked onBack={() => navigate(`/cars/${id}`)} />
          ) : (
            <ResBookingForm
              car={car}
              initialDepart={stateDepart}
              initialRetour={stateRetour}
              initialSubtotal={stateSubtotal}
            />
          )}
        </div>

      </div>
    </div>
  );
}


