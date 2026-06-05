import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminAgenciesNamesThunk } from "../../features/adminCars/adminCarsThunks";
import { selectAdminAgenciesNames } from "../../features/adminCars/adminCarsSelectors";

import "./BookingForm.css";

const emptyForm = {
  car_id: "",
  user_id: "",
  agency_id: "",
  start_date: "",
  end_date: "",
  total_price: "",
  status: "pending",
};

export default function BookingForm({
  isOpen,
  mode = "create",
  initialData = null,
  onSubmit,
  onClose,
  saving = false,
}) {
  const dispatch = useDispatch();
  const agencies = useSelector(selectAdminAgenciesNames) || [];

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAdminAgenciesNamesThunk());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm);
      return;
    }

    if (mode === "edit" && initialData) {
      setForm({
        car_id: initialData.car_id || "",
        user_id: initialData.user_id || "",
        agency_id: initialData.agency_id || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        total_price: initialData.total_price || "",
        status: initialData.status || "pending",
      });
    }

    if (mode === "create") {
      setForm(emptyForm);
    }
  }, [isOpen, mode, initialData]);

  const agencyOptions = useMemo(() => {
    return agencies.map((agency) => ({
      value: agency.id,
      label: agency.agency_name,
    }));
  }, [agencies]);

  const selectedAgency =
    agencyOptions.find(
      (agency) => Number(agency.value) === Number(form.agency_id)
    ) || null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgencyChange = (selected) => {
    setForm((prev) => ({
      ...prev,
      agency_id: selected ? selected.value : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      car_id: Number(form.car_id),
      user_id: Number(form.user_id),
      agency_id: Number(form.agency_id),
      start_date: form.start_date,
      end_date: form.end_date,
      total_price: Number(form.total_price),
      status: form.status,
    };

    onSubmit(payload);
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-form-modal">
        <div className="booking-modal-header">
          <h2>
            {mode === "create"
              ? "Créer une réservation"
              : "Modifier la réservation"}
          </h2>

          <button type="button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="booking-form-grid">
            <div className="form-field">
              <label>ID voiture</label>
              <input
                type="number"
                name="car_id"
                value={form.car_id}
                onChange={handleChange}
                placeholder="Ex: 11"
                required
              />
            </div>

            <div className="form-field">
              <label>ID client</label>
              <input
                type="number"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                placeholder="Ex: 3"
                required
              />
            </div>

            <div className="form-field">
              <label>Date début</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Date fin</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Prix total</label>
              <input
                type="number"
                name="total_price"
                value={form.total_price}
                onChange={handleChange}
                placeholder="Ex: 2000"
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label>Statut</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="canceled">Annulée</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
          </div>

          <div className="form-field agency-select-container">
            <label>Agence</label>

            <Select
              classNamePrefix="react-select"
              options={agencyOptions}
              value={selectedAgency}
              onChange={handleAgencyChange}
              placeholder="Rechercher une agence..."
              isClearable
              isSearchable
            />
          </div>

          <div className="booking-form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
            >
              Annuler
            </button>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving
                ? "Enregistrement..."
                : mode === "create"
                ? "Créer"
                : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}