import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Building2, ShieldCheck, ShieldX, Clock, Eye, Edit2, Trash2, Car } from "lucide-react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import "../../styles/pages/AdminAgenciesPage.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_LABELS = {
  verified: "Verifiee",
  inverified: "Bloquee",
  wait: "En attente",
};

const DEFAULT_STATS = {
  total_agencies: 0,
  total_agencies_verified: 0,
  total_agencies_inverified: 0,
  total_agencies_wait: 0,
};

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    query.set(key, value);
  });
  return query.toString();
}

function formatHour(time) {
  if (!time) return "-";
  return time.length >= 5 ? time.slice(0, 5) : time;
}

export default function AdminAgencies() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [agencies, setAgencies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [brokenLogos, setBrokenLogos] = useState({});

  const [filters, setFilters] = useState({
    name: "",
    city: "",
    is_verified: "",
    per_page: 10,
  });

  const queryString = useMemo(() => buildQuery(filters), [filters]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/super-admin/agencies/stats`, {
        credentials: "include",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Erreur stats");
      setStats(payload?.data || DEFAULT_STATS);
    } catch (err) {
      setStats(DEFAULT_STATS);
    }
  };

  const fetchAgencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/super-admin/agencies?${queryString}`, {
        credentials: "include",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Erreur liste agences");
      setAgencies(payload?.data?.data || []);
      setPagination(payload?.data || null);
    } catch (err) {
      setError(err?.message || "Erreur lors du chargement");
      setAgencies([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/super-admin/agencies/cities`, {
        credentials: "include",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Erreur villes");
      setCities(payload?.data || []);
    } catch (err) {
      setCities([]);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCities();
  }, []);

  useEffect(() => {
    fetchAgencies();
  }, [queryString]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      name: "",
      city: "",
      is_verified: "",
      per_page: 10,
    });
  };

  const handlePage = (url) => {
    if (!url) return;
    const [, query] = url.split("?");
    const params = new URLSearchParams(query || "");
    setFilters((prev) => ({
      ...prev,
      per_page: prev.per_page,
      page: params.get("page") || "",
    }));
  };

  const handleDeleteClick = (agency) => {
    setSelectedAgency(agency || null);
    setConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setSelectedAgency(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAgency?.id) return;
    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/super-admin/agencies/${selectedAgency.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Erreur suppression");
      setConfirmOpen(false);
      setSelectedAgency(null);
      await fetchAgencies();
      await fetchStats();
    } catch (err) {
      window.alert(err?.message || "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
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
          onClick={() => navigate("/dashboard/admin/agencies/new")}
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
                        <div className="actions-cell">
                          <button className="icon-btn" title="Voir">
                            <Eye size={16} />
                          </button>
                          <button className="icon-btn" title="Modifier">
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Supprimer"
                            onClick={() => handleDeleteClick(agency)}
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
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Supprimer l'agence"
        message={`Voulez-vous vraiment supprimer l'agence "${
          selectedAgency?.agency_name || ""
        }" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
    </div>
  );
}
