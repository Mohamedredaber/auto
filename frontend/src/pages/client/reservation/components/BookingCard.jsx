import React from "react";
import { Calendar, MapPin, CreditCard } from "lucide-react";
import { Button } from "../../../../components/ui";

const BookingCard = ({ booking, onCancel }) => {
  const {
    car_details,
    agency_details,
    start_date,
    end_date,
    total_price,
    status,
  } = booking;

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return { bg: "var(--color-success-bg)", text: "var(--color-success)" };
      case "pending":
        return { bg: "var(--color-warning-bg)", text: "var(--color-warning)" };
      case "cancelled":
        return { bg: "var(--color-error-bg)", text: "var(--color-error)" };
      default:
        return { bg: "var(--color-bg-input)", text: "var(--color-text-muted)" };
    }
  };

  const statusStyle = getStatusStyle(status);

  return (
    <div className="booking-card">
      <div className="booking-card-image">
        <img
          src={car_details?.cover_image}
          alt={`${car_details?.brand} ${car_details?.model}`}
        />
        <span
          className="status-badge"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className="booking-card-content">
        <h3>
          {car_details?.brand}{" "}
          <span className="model-text">{car_details?.model}</span>
        </h3>

        <div className="booking-info-grid">
          <div className="info-item">
            <Calendar size={16} />
            <span>
              {start_date} — {end_date}
            </span>
          </div>
          <div className="info-item">
            <MapPin size={16} />
            <span>
              {agency_details?.city}, {agency_details?.name}
            </span>
          </div>
          <div className="info-item price-tag">
            <CreditCard size={16} />
            <span>{total_price} MAD</span>
          </div>
        </div>

        <div className="booking-actions">
          {/* <Button variant="secondary" size="sm">Details</Button> */}
          {status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              className="btn-outline-danger"
              onClick={() => onCancel(booking.id)}
            >
              Annuler
            </Button>
          )}
          {status === "canceled" && (
            <span className="canceled-text">Réservation annulée</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
