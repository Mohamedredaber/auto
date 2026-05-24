import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { createBookingThunk } from "../../../../features/booking/bookingThunks";
import { useNavigate } from "react-router-dom";

/* ---- helpers ---- */
function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function diffDays(a, b) {
  if (!a || !b) return 1;
  const ms = new Date(b) - new Date(a);
  return Math.max(1, Math.round(ms / 86400000));
}
function fmt(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export default function ResBookingForm({
  car,
  initialDepart,
  initialRetour,
  initialSubtotal,
}) {
  const dispatch = useDispatch();
  const pricePerDay = parseFloat(car?.price_per_day) || 0;

  /* ----------------------------------------------------------------
     Dates : priorité location.state, sinon defaults sensibles
  ---------------------------------------------------------------- */
  const defaultDepart = initialDepart || todayStr();
  const defaultRetour = initialRetour || addDays(defaultDepart, 3);

  const [depart, setDepart] = useState(defaultDepart);
  const [retour, setRetour] = useState(defaultRetour);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  /* ----------------------------------------------------------------
     Calcul dynamique — si on a un subtotal initial ET les dates
     n'ont pas changé on s'en sert, sinon on recalcule
  ---------------------------------------------------------------- */
  const days = useMemo(() => diffDays(depart, retour), [depart, retour]);
  const subtotal = useMemo(() => days * pricePerDay, [days, pricePerDay]);
  const navigate = useNavigate();
  const handleDepart = (e) => {
    const val = e.target.value;
    setDepart(val);
    // si retour devient <= depart, on le corrige
    if (val >= retour) setRetour(addDays(val, 1));
  };

  const handleSubmit = async () => {
    if (!car?.id) return;
    setSubmitting(true);
    setError(null);
    try {
      await dispatch(
        createBookingThunk({
          car_id: car.id,
          start_date: depart,
          end_date: retour,
          total_price: subtotal,
        }),
      ).unwrap();
      setSubmitted(true);
      navigate("/dashboard/client/reservations");
    } catch (err) {
      setError(err?.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };
  const isAvailable = car?.status === "available";

  if (submitted) {
    return (
      <div
        className="res-section"
        style={{
          textAlign: "center",
          padding: "var(--space-10) var(--space-6)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: "var(--color-success-bg)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-4)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="2.5"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-xl)",
            marginBottom: "var(--space-2)",
          }}
        >
          Réservation confirmée !
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-sm)",
          }}
        >
          {car.brand} {car.model} · {fmt(depart)} → {fmt(retour)} ·{" "}
          {subtotal.toLocaleString("fr-MA")} MAD
        </p>
      </div>
    );
  }

  return (
    <div className="res-form">
      {/* ── Section dates ── */}
      <div className="res-section">
        <div className="res-section__head">
          <div className="res-section__head-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div>
            <h3>Détails du voyage</h3>
            <p>Indiquez vos dates et le lieu de récupération du véhicule.</p>
          </div>
        </div>
        <div className="res-section__body">
          <div className="res-dates">
            <div className="res-date-field">
              <label htmlFor="depart">Date de départ</label>
              <div className="res-date-input-wrap">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <input
                  id="depart"
                  type="date"
                  className="res-date-input"
                  value={depart}
                  min={todayStr()}
                  onChange={handleDepart}
                />
              </div>
            </div>
            <div className="res-date-field">
              <label htmlFor="retour">Date de retour</label>
              <div className="res-date-input-wrap">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <input
                  id="retour"
                  type="date"
                  className="res-date-input"
                  value={retour}
                  min={addDays(depart, 1)}
                  onChange={(e) => setRetour(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section récapitulatif + CTA ── */}
      <div className="res-section">
        <div className="res-section__head">
          <div className="res-section__head-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <div>
            <h3>Récapitulatif</h3>
            <p>Vérifiez les détails avant de confirmer.</p>
          </div>
        </div>
        <div className="res-section__body">
          {/* Breakdown */}
          <div className="res-breakdown">
            <div className="res-breakdown__row">
              <span className="res-breakdown__label">
                Location ({days} jour{days > 1 ? "s" : ""} ×{" "}
                {pricePerDay.toLocaleString("fr-MA")} MAD)
              </span>
              <span className="res-breakdown__value">
                {subtotal.toLocaleString("fr-MA")} MAD
              </span>
            </div>
            <div className="res-breakdown__row">
              <span className="res-breakdown__label">
                Frais de service AutoConnect
              </span>
              <span className="res-breakdown__value--free">Gratuit</span>
            </div>
            <div className="res-breakdown__row">
              <span className="res-breakdown__label">
                Taxes et frais locaux
              </span>
              <span className="res-breakdown__value--included">Inclus</span>
            </div>
          </div>

          {/* Total */}
          <div className="res-total">
            <span className="res-total__label">Total à régler</span>
            <div className="res-total__col">
              <span className="res-total__amount">
                {subtotal.toLocaleString("fr-MA")} MAD
              </span>
              <span className="res-total__note">TVA de 20% incluse</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "var(--color-error-bg)",
                border: "1px solid var(--color-error)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3) var(--space-4)",
                marginTop: "var(--space-4)",
                fontSize: "var(--text-sm)",
                color: "var(--color-error)",
              }}
            >
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            className="res-cta"
            style={{ marginTop: "var(--space-5)" }}
            onClick={handleSubmit}
            disabled={!isAvailable || submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner"
                  style={{ width: 18, height: 18, borderWidth: 2, margin: 0 }}
                />
                Confirmation en cours…
              </>
            ) : isAvailable ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Confirmer ma réservation
              </>
            ) : (
              "Voiture non disponible"
            )}
          </button>

          <p className="res-legal" style={{ marginTop: "var(--space-3)" }}>
            En cliquant sur " réservation", vous acceptez nos{" "}
            <a href="#">Conditions Générales de Vente</a> et la{" "}
            <a href="#">Politique de Confidentialité</a> de l'agence.
          </p>
        </div>
      </div>
    </div>
  );
}
