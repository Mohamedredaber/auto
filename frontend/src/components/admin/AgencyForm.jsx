import { useEffect, useState } from "react";
import "../../styles/components/AgencyForm.css";

const STATUS_OPTIONS = [
  { value: "verified", label: "Verifiee" },
  { value: "inverified", label: "Bloquee" },
  { value: "wait", label: "En attente" },
];

const getDefaultValues = () => ({
  agency_name: "",
  city: "",
  address: "",
  time_start: "",
  time_end: "",
  is_verified: "wait",
  latitude: "",
  longitude: "",
  logo: null,
});

export default function AgencyForm({
  isOpen,
  mode,
  initialData,
  onSubmit,
  onClose,
  saving,
}) {
  const [values, setValues] = useState(getDefaultValues());

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialData) {
      setValues({
        agency_name: initialData.agency_name || "",
        city: initialData.city || "",
        address: initialData.address || "",
        time_start: initialData.time_start || "",
        time_end: initialData.time_end || "",
        is_verified: initialData.is_verified || "wait",
        latitude:
          initialData.latitude !== null && initialData.latitude !== undefined
            ? String(initialData.latitude)
            : "",
        longitude:
          initialData.longitude !== null && initialData.longitude !== undefined
            ? String(initialData.longitude)
            : "",
        logo: null,
      });
    } else {
      setValues(getDefaultValues());
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setValues((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const title = mode === "edit" ? "Modifier l'agence" : "Creer une agence";

  return (
    <div className="agency-form-overlay" onClick={handleOverlayClick}>
      <div className="agency-form-card" role="dialog" aria-modal="true">
        <div className="agency-form-header">
          <div>
            <h2>{title}</h2>
            <p>Renseignez les informations principales de l'agence.</p>
          </div>
          <button
            type="button"
            className="agency-form-close"
            onClick={onClose}
            disabled={saving}
          >
            &times;
          </button>
        </div>

        <form className="agency-form" onSubmit={handleSubmit}>
          <div className="agency-form-grid">
            <div className="agency-form-field">
              <label>Nom de l'agence</label>
              <input
                type="text"
                name="agency_name"
                value={values.agency_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="agency-form-field">
              <label>Ville</label>
              <input
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="agency-form-field full">
              <label>Adresse</label>
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="agency-form-field">
              <label>Heure d'ouverture</label>
              <input
                type="time"
                name="time_start"
                value={values.time_start}
                onChange={handleChange}
                required
              />
            </div>
            <div className="agency-form-field">
              <label>Heure de fermeture</label>
              <input
                type="time"
                name="time_end"
                value={values.time_end}
                onChange={handleChange}
                required
              />
            </div>
            <div className="agency-form-field">
              <label>Statut</label>
              <select
                name="is_verified"
                value={values.is_verified}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="agency-form-field">
              <label>Logo (optionnel)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="agency-form-field">
              <label>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={values.latitude}
                onChange={handleChange}
                step="0.000001"
              />
            </div>
            <div className="agency-form-field">
              <label>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={values.longitude}
                onChange={handleChange}
                step="0.000001"
              />
            </div>
          </div>

          <div className="agency-form-actions">
            <button
              type="button"
              className="agency-form-btn secondary"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="agency-form-btn primary"
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
