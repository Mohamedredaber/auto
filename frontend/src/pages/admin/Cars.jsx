import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  Car,
  ShieldCheck,
  ShieldX,
  Wrench,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import {
  fetchAdminCarsThunk,
  fetchAdminCarsStatsThunk,
  deleteAdminCarThunk,
} from "../../features/adminCars/adminCarsThunks";

import {
  selectAdminCars,
  selectAdminCarsPagination,
  selectAdminCarsStats,
  selectAdminCarsLoading,
  selectAdminCarsError,
  selectAdminCarsFilters,
} from "../../features/adminCars/adminCarsSelectors";
import {
  setFilters,
  resetFilters,
  openAdminCarCreateModal,
  openAdminCarEditModal,
} from "../../features/adminCars/adminCarsSlice";


import "../../styles/pages/AdminCarsPage.css";

import AdminCarFormModal from "../../components/admin/AdminCarFormModal";


const STATUS_LABELS = {
  available: "Disponible",
  reserved: "Reservee",
  maintenance: "Maintenance",
};

export default function AdminCars() {
  const dispatch = useDispatch();
  const stats = useSelector(selectAdminCarsStats);
  const cars = useSelector(selectAdminCars);
  const pagination = useSelector(selectAdminCarsPagination);
  const loading = useSelector(selectAdminCarsLoading);
  const error = useSelector(selectAdminCarsError);
  const filters = useSelector(selectAdminCarsFilters);

  useEffect(() => {
    dispatch(fetchAdminCarsStatsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminCarsThunk(filters));
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

  const handleCreate = () => {
  dispatch(openAdminCarCreateModal());
};

const handleEdit = (car) => {
  dispatch(openAdminCarEditModal(car));
};

const handleDelete = async (carId) => {
  const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette voiture ?");

  if (!confirmDelete) return;

  const result = await dispatch(deleteAdminCarThunk(carId));

  if (!result.error) {
    dispatch(fetchAdminCarsStatsThunk());
  }
};

const handleView = (car) => {
  console.log("Car details:", car);
};

const getCoverImageUrl = (car) => {
  return car.images?.find((img) => img.is_cover == 1)?.url || null;
};
  return (
    <div className="admin-cars-container animate-fade-in">
      <div className="admin-cars-header">
        <div className="header-content">
          <div className="header-icon">
            <Car size={24} />
          </div>
          <div className="header-text">
            <h1>Gestion des voitures</h1>
            <p>Suivi des vehicules enregistres et disponibilites.</p>
          </div>
        </div>
       <button className="btn-add" type="button" onClick={handleCreate}>
          <Plus size={16} />
          Creer une voiture
        </button>
      </div>

      <div className="admin-cars-stats">
        <div className="stat-card">
          <div className="stat-icon red">
            <Car size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total voitures</span>
            <span className="stat-value">{stats.total_cars}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Disponibles</span>
            <span className="stat-value">{stats.total_available}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <ShieldX size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Reservees</span>
            <span className="stat-value">{stats.total_reserved}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Wrench size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Maintenance</span>
            <span className="stat-value">{stats.total_maintenance}</span>
          </div>
        </div>
      </div>

      <div className="admin-cars-filters">
        <div className="search-box">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Rechercher (marque, modele, agence)"
          />
          <Search size={16} className="search-icon" />
        </div>
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <span>Filtrer par:</span>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="reserved">Reservee</option>
            <option value="maintenance">Maintenance</option>
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

      <div className="admin-cars-table">
        <div className="table-header">
          <h2>Liste des voitures</h2>
          {loading && <span className="table-status">Chargement...</span>}
          {error && <span className="table-status error">{error}</span>}
        </div>

        <div className="table-wrapper">
          <table className="admin-table cars-table">
            <thead>
              <tr>
                <th>Voiture</th>
                <th>Agence</th>
                <th>Transmission</th>
                <th>Prix / jour</th>
                <th>Statut</th>
                <th>Disponibilite</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    Aucune voiture trouvee.
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id}>
                    <td>
                      <div className="car-main">
                        <span className="car-avatar">
                          {car.cover_image_url ? (
                            <img src={car.cover_image_url} alt={car.brand} />
                          ) : (
                            <span className="car-avatar-fallback">
                              {(car.brand || "C").charAt(0)}
                            </span>
                          )}
                        </span>
                        <div className="car-info">
                          <span className="car-name">
                            {car.brand} {car.model}
                          </span>
                          <span className="car-meta">{car.category || "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="agency-cell">
                        <span className="agency-name">{car.agency_name || "-"}</span>
                        <span className="agency-city">{car.agency_city || "-"}</span>
                      </div>
                    </td>
                    <td>{car.transmission || "-"}</td>
                    <td>
                      {car.price_per_day ? `${car.price_per_day} MAD` : "-"}
                    </td>
                    <td>
                      <span className={`status-pill status-${car.status || "reserved"}`}>
                        {STATUS_LABELS[car.status] || car.status}
                      </span>
                    </td>
                    <td>
                      {car.available_from || "-"} {car.available_to ? `- ${car.available_to}` : ""}
                    </td>
                    {/* actions */}
                    <td>
  <div className="table-actions">
    <button
      className="action-btn view"
      title="Voir détails"
      onClick={() => handleView(car)}
    >
      <Eye size={14} />
    </button>

    <button
      className="action-btn edit"
      title="Modifier voiture"
      onClick={() => handleEdit(car)}
    >
      <Edit size={14} />
    </button>

    <button
      className="action-btn delete"
      title="Supprimer voiture"
      onClick={() => handleDelete(car.id)}
    >
      <Trash2 size={14} />
    </button>
  </div>
</td>

                  </tr>
                ))
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
      <AdminCarFormModal />
    </div>
  );
}
