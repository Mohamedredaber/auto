import { useEffect , useState } from "react";
import Select from "react-select";
import "./AdminUserForm.css";
import {fetchAdminAgenciesNames} from "../../api/adminAgenciesApi";

export default function AdminUserForm({
  isOpen,
  mode = "create",
  initialData = null,
  onSubmit,
  onClose,
  saving = false,
}) {
  const [agencyOptions, setAgencyOptions] = useState([]);
  const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  role: "client",
  agency_id: "",
};

 
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const response = await fetchAdminAgenciesNames();
        const options = response.data.data.map((agency) => ({
          value: agency.id,
            label: agency.agency_name,
        }));
        setAgencyOptions(options);
      } catch (err) {
        console.error("Erreur lors du chargement des agences:", err);
      }
    };

    loadAgencies();
  }, []);


useEffect(() => {
  if (!isOpen) {
    setForm(emptyForm);
    return;
  }

  if (mode === "edit" && initialData) {
    setForm({
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      email: initialData.email || "",
      password: "",
      phone: initialData.phone || "",
      role: initialData.role || "client",
      agency_id: initialData.agency_id || "",
    });
  }

  if (mode === "create") {
    setForm(emptyForm);
  }
}, [isOpen, mode, initialData]);

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
      ...form,
    };

    if (payload.role !== "admin_agency") {
      payload.agency_id = null;
    }

    if (mode === "edit" && !payload.password) {
      delete payload.password;
    }

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="user-form-modal">
        <div className="modal-header">
          <h2>
            {mode === "create"
              ? "Créer un utilisateur"
              : "Modifier utilisateur"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Prénom</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Nom</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Téléphone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Rôle</label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="client">Client</option>
                <option value="admin_agency">
                  Admin agence
                </option>
                <option value="super_admin">
                  Super admin
                </option>
              </select>
            </div>

            {(mode === "create" || form.role !== "client") && (
              <div>
                <label>
                  {mode === "create"
                    ? "Mot de passe"
                    : "Nouveau mot de passe"}
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={mode === "create"}
                />
              </div>
            )}
          </div>

          {form.role === "admin_agency" && (
            <div className="agency-select-container">
              <label>Agence</label>

              <Select
              classNamePrefix="react-select"
                options={agencyOptions}
                value={
                  agencyOptions.find(
                    (a) => a.value === form.agency_id
                  ) || null
                }
                onChange={handleAgencyChange}
                placeholder="Choisir une agence..."
                isClearable
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="btn-save"
              disabled={saving}
            >
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