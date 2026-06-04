import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, Plus, Building2, ShieldCheck, ShieldX, Clock, Eye, Edit, Trash2, Car } from "lucide-react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AgencyForm from "../../components/admin/AgencyForm";
import Swal from "sweetalert2";
import {
  fetchAdminAgenciesThunk,
  fetchAdminAgenciesCitiesThunk,
  fetchAdminAgenciesStatsThunk,
  deleteAdminAgencyThunk,
  createAdminAgencyThunk,
  updateAdminAgencyThunk,
} from "../../features/adminAgencies/adminAgenciesThunks";
import {
  selectAdminAgencies,
  selectAdminAgenciesPagination,
  selectAdminAgenciesStats,
  selectAdminAgenciesCities,
  selectAdminAgenciesLoading,
  selectAdminAgenciesError,
  selectAdminAgenciesFilters,
  selectAdminAgenciesDeleting,
  selectAdminAgenciesSaving,
  selectAdminAgenciesSaveError,
} from "../../features/adminAgencies/adminAgenciesSelectors";
import { setFilters, resetFilters } from "../../features/adminAgencies/adminAgenciesSlice";
import "../../styles/pages/AdminAgenciesPage.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_LABELS = {
  verified: "Verifiee",
  inverified: "Bloquee",
  wait: "En attente",
};

function formatHour(time) {
  if (!time) return "-";
  return time.length >= 5 ? time.slice(0, 5) : time;
}

export default function AdminAgencies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stats = useSelector(selectAdminAgenciesStats);
  const agencies = useSelector(selectAdminAgencies);
  const pagination = useSelector(selectAdminAgenciesPagination);
  const cities = useSelector(selectAdminAgenciesCities);
  const loading = useSelector(selectAdminAgenciesLoading);
  const error = useSelector(selectAdminAgenciesError);
  const filters = useSelector(selectAdminAgenciesFilters);
  const deleting = useSelector(selectAdminAgenciesDeleting);
  const saving = useSelector(selectAdminAgenciesSaving);
  const saveError = useSelector(selectAdminAgenciesSaveError);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [brokenLogos, setBrokenLogos] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formAgency, setFormAgency] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminAgenciesStatsThunk());
    dispatch(fetchAdminAgenciesCitiesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminAgenciesThunk(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilters({
      [name]: value,
      page: "",
    }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handlePage = (url) => {
    if (!url) return;
    const [, query] = url.split("?");
    const params = new URLSearchParams(query || "");
    dispatch(setFilters({
      page: params.get("page") || "",
    }));
  };

  const handleDeleteAgency = async (agency) => {
  const result = await Swal.fire({
    title: "Supprimer l'agence ?",
    text: `Voulez-vous vraiment supprimer l'agence "${agency.agency_name}" ? Cette action est irréversible.`,
    icon: "warning",

    showCancelButton: true,

    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",

    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#334155",

    reverseButtons: true,

    background: "#111827",
    color: "#f9fafb",

    customClass: {
      popup: "dashboard-alert",
    },
  });

  if (!result.isConfirmed) return;

  const response = await dispatch(deleteAdminAgencyThunk(agency.id));

  if (!response.error) {
    await Swal.fire({
      icon: "success",
      title: "Agence supprimée",
      text: "L'agence a été supprimée avec succès.",
      timer: 1800,
      showConfirmButton: false,

      background: "#111827",
      color: "#f9fafb",
    });
  }
};
  const handleDetailsClick = (agency) => {
    if (agency?.id) {
      navigate(`/dashboard/admin/agencies/${agency.id}`);
    }
  };

  const handleCreateClick = () => {
    setFormMode("create");
    setFormAgency(null);
    setFormOpen(true);
  };

  const handleEditClick = (agency) => {
    setFormMode("edit");
    setFormAgency(agency || null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    if (saving) return;
    setFormOpen(false);
    setFormAgency(null);
  };

  const handleFormSubmit = async (values) => {
    const payload = new FormData();
    payload.append("agency_name", values.agency_name);
    payload.append("city", values.city);
    payload.append("address", values.address);
    payload.append("time_start", values.time_start);
    payload.append("time_end", values.time_end);
    payload.append("is_verified", values.is_verified || "wait");
    if (values.latitude !== "") payload.append("latitude", values.latitude);
    if (values.longitude !== "") payload.append("longitude", values.longitude);
    if (values.logo) payload.append("logo", values.logo);

    try {
      if (formMode === "edit" && formAgency?.id) {
        await dispatch(
          updateAdminAgencyThunk({
            id: formAgency.id,
            payload,
          }),
        ).unwrap();
      } else {
        await dispatch(createAdminAgencyThunk(payload)).unwrap();
      }
      setFormOpen(false);
      setFormAgency(null);
      dispatch(fetchAdminAgenciesThunk(filters));
      dispatch(fetchAdminAgenciesStatsThunk());
    } catch (err) {
      window.alert(err?.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDeleteCancel = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setSelectedAgency(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAgency?.id) return;
    try {
      await dispatch(deleteAdminAgencyThunk(selectedAgency.id)).unwrap();
      setConfirmOpen(false);
      setSelectedAgency(null);
      dispatch(fetchAdminAgenciesThunk(filters));
      dispatch(fetchAdminAgenciesStatsThunk());
    } catch (err) {
      window.alert(err?.message || "Erreur lors de la suppression");
    }
  };

  const resolveLogoUrl = (logo, logoUrl) => {
    const candidate = logoUrl || logo;
    if (!candidate) return null;
    if (/^https?:\/\//i.test(candidate)) {
      if (candidate.startsWith("http://localhost/") || candidate.startsWith("https://localhost/")) {
        return `${API_BASE}${candidate.replace(/^https?:\/\/localhost/i, "")}`;
      }
      return candidate;
    }
    if (candidate.startsWith("/storage/")) return `${API_BASE}${candidate}`;
    if (candidate.startsWith("storage/")) return `${API_BASE}/${candidate}`;
    return `${API_BASE}/storage/${candidate.replace(/^\/+/, "")}`;
  };

  const handleLogoError = (agencyId) => {
    setBrokenLogos((prev) => ({
      ...prev,
      [agencyId]: true,
    }));
  };

  return (
    <div className="admin-agencies-container animate-fade-in">
      <div className="admin-agencies-header">
        <div className="header-content">
          <div className="header-icon">
            <Building2 size={24} />
          </div>
          <div className="header-text">
            <h1>Gestion des agences</h1>
            <p>Suivi des agences, validation et monitoring global.</p>
          </div>
        </div>
        <button
          className="btn-add"
          onClick={handleCreateClick}
        >
          <Plus size={16} />
          Creer une agence
        </button>
      </div>

      <div className="admin-agencies-stats">
        <div className="stat-card">
          <div className="stat-icon red">
            <Building2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total agences</span>
            <span className="stat-value">{stats.total_agencies}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Agences verifiees</span>
            <span className="stat-value">{stats.total_agencies_verified}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <ShieldX size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Agences bloquees</span>
            <span className="stat-value">{stats.total_agencies_inverified}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Agences en attente</span>
            <span className="stat-value">{stats.total_agencies_wait}</span>
          </div>
        </div>
      </div>

      <div className="admin-agencies-filters">
        <div className="search-box">
         
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Rechercher par nom"
          />
           <Search size={16} className="search-icon" />
        </div>
        <div className="filter-group">
          <Filter size={16} className="filter-icon text-gray-400" />
          <span>Filtrer par:</span>

          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          >
            <option value="">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            name="is_verified"
            value={filters.is_verified}
            onChange={handleFilterChange}
          >
            <option value="">Tous les statuts</option>
            <option value="verified">Verifiee</option>
            <option value="inverified">Bloquee</option>
            <option value="wait">En attente</option>
          </select>
          <select
            name="per_page"
            value={filters.per_page}
            onChange={handleFilterChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <button className="btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="admin-agencies-table">
        <div className="table-header">
          <h2>Liste des agences</h2>
          {loading && <span className="table-status">Chargement...</span>}
          {error && <span className="table-status error">{error}</span>}
          {saveError && <span className="table-status error">{saveError}</span>}
        </div>

        <div className="table-wrapper">
          <table className="admin-table agencies-table">
            <thead>
              <tr>
                <th>Agence &amp; Ville</th>
                <th>Coordonnees</th>
                <th>Horaires</th>
                <th>Flotte</th>
                <th>Statut</th>
                <th>Date d'adhesion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agencies.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    Aucune agence trouvee.
                  </td>
                </tr>
              ) : (
                agencies.map((agency) => {
                  const fleetCount = agency.cars_count ?? agency.fleet_count ?? null;
                  const logoUrl = brokenLogos[agency.id]
                    ? null
                    : resolveLogoUrl(agency.logo, agency.logo_url);
                  return (
                    <tr key={agency.id}>
                      <td>
                        <div className="agency-main">
                          <span className="agency-avatar">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={agency.agency_name}
                                onError={() => handleLogoError(agency.id)}
                              />
                            ) : (
                              <span className="agency-avatar-fallback">
                                {(agency.agency_name || "A").charAt(0)}
                              </span>
                            )}
                          </span>
                          <div className="agency-info">
                            <span className="agency-name">{agency.agency_name}</span>
                            <span className="agency-meta">{agency.city || "-"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{agency.address || "-"}</td>
                      <td>
                        {formatHour(agency.time_start)} - {formatHour(agency.time_end)}
                      </td>
                      <td>
                        <span className="fleet-pill">
                          <Car size={14} />
                          {fleetCount ?? "-"} vehicules
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${agency.is_verified || "wait"}`}>
                          {STATUS_LABELS[agency.is_verified] || agency.is_verified}
                        </span>
                      </td>
                      <td>
                        {agency.created_at
                          ? new Date(agency.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                             className="action-btn view"
                            aria-label="Voir détails"
                            title="Voir détails"
                            onClick={() => handleDetailsClick(agency)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn edit"
                            title="Modifier"
                            onClick={() => handleEditClick(agency)}
                          >
                            <Edit size={16} />
                          </button>
                        
                          <button
                                className="action-btn delete"
                                title="Supprimer"
                                onClick={() => handleDeleteAgency(agency)}
                                >
                                <Trash2 size={16} />
                                </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="pagination-container">
            <div className="pagination-info">
              Page {pagination.current_page} / {pagination.last_page}
            </div>
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePage(pagination.prev_page_url)}
                disabled={!pagination.prev_page_url}
              >
                Precedent
              </button>
              <button
                className="pagination-btn"
                onClick={() => handlePage(pagination.next_page_url)}
                disabled={!pagination.next_page_url}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
      
      <AgencyForm
        isOpen={formOpen}
        mode={formMode}
        initialData={formAgency}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
        saving={saving}
      />
    </div>
  );
}
