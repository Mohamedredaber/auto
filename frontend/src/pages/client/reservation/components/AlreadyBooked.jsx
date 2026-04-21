function  AlreadyBooked({ onBack }) {
  return (
    <div className="res-already-booked">
      <div className="res-already-booked__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-warning)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <h3 className="res-already-booked__title">Réservation existante</h3>
      <p className="res-already-booked__desc">
        Vous avez déjà une réservation active pour ce véhicule.
        Consultez vos réservations pour gérer votre trajet.
      </p>
      <div className="res-already-booked__actions">
        <button
          className="res-already-booked__btn-primary"
          onClick={() => window.location.href = "/dashboard/client/reservations"}
        >
          Voir mes réservations
        </button>
        <button className="res-already-booked__btn-ghost" onClick={onBack}>
          ← Retour au véhicule
        </button>
      </div>
    </div>
  );
}
export default AlreadyBooked;