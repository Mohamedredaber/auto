import CarCard from "../CarCard/CarCard";
import "../../../../../styles/components/carlist.css";

/* ── Skeleton Card ──────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="car-skeleton">
      <div className="car-skeleton__image" />
      <div className="car-skeleton__body">
        <div className="car-skeleton__line car-skeleton__line--title" />
        <div className="car-skeleton__line car-skeleton__line--sub" />
        <div className="car-skeleton__specs">
          <div className="car-skeleton__spec" />
          <div className="car-skeleton__spec" />
          <div className="car-skeleton__spec" />
        </div>
        <div className="car-skeleton__actions">
          <div className="car-skeleton__btn" />
          <div className="car-skeleton__btn" />
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="carlist__empty">
      <div className="carlist__empty-icon">🚗</div>
      <h3 className="carlist__empty-title">Aucun véhicule trouvé</h3>
      <p className="carlist__empty-desc">
        Essayez de modifier vos filtres pour trouver plus de résultats.
      </p>
    </div>
  );
}

/* ── Error State ────────────────────────────────────── */
function ErrorState({ message }) {
  return (
    <div className="carlist__error">
      <div className="carlist__error-icon">⚠️</div>
      <h3 className="carlist__error-title">Une erreur est survenue</h3>
      <p className="carlist__error-desc">{message}</p>
    </div>
  );
}

/* ── CarList ────────────────────────────────────────── */
export default function CarList({ cars, loading, error, onReserve }) {
  if (loading) {
    return (
      <div className="carlist__grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error?.message ?? "Impossible de charger les véhicules."} />;
  }

  if (!cars || cars.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="carlist__grid">
      {cars.map((car, index) => (
        <div
          key={car.id}
          className="carlist__item"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <CarCard car={car} onReserve={onReserve} />
        </div>
      ))}
    </div>
  );
}