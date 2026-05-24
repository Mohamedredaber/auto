"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Car,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  selectAllCars,
  selectCarLoading,
  selectIsFormOpen,
  selectFormMode,
} from "../../../features/agency/carSelectors";
import {
  fetchAgencyCarsThunk,
  deleteCarThunk,
} from "../../../features/agency/carThunks";
import {
  openAddForm,
  openEditForm,
  closeModals,
} from "../../../features/agency/carSlice";
import CarFormModal from "./CarFormModal/CarFormModal";
import "./MyCars.css";

const MyCars = () => {
  const dispatch = useDispatch();

  const cars = useSelector(selectAllCars);
  const isLoading = useSelector(selectCarLoading);
  const isFormOpen = useSelector(selectIsFormOpen);
  const formMode = useSelector(selectFormMode);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAgencyCarsThunk());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOrder]);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || car.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOrder === "asc") return a.price_per_day - b.price_per_day;
    if (sortOrder === "desc") return b.price_per_day - a.price_per_day;
    return 0;
  });

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  const totalCars = cars.length;
  const availableCars = cars.filter((car) => car.status === "available").length;
  const estimatedRevenue = cars.reduce(
    (acc, car) => acc + (Number(car.price_per_day) || 0),
    0,
  );

  const handleAddClick = () => {
    dispatch(openAddForm());
  };

  const handleEditClick = (car) => {
    dispatch(openEditForm(car));
  };

  const handleCloseForm = () => dispatch(closeModals());
  const handleDeleteClick = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      dispatch(deleteCarThunk(id));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "status-disponible";
      case "reserved":
        return "status-loue";
      case "maintenance":
        return "status-indisponible";
      default:
        return "status-indisponible";
    }
  };

  return (
    <div className="mycars-container animate-fade-in">
      <div className="mycars-header ac-card">
        <div className="header-content">
          <div className="header-icon">
            <Car size={24} />
          </div>
          <div className="header-text">
            <h1>Gestion de la Flotte</h1>
            <p>Gérez vos véhicules et suivez leur disponibilité.</p>
          </div>
        </div>
        <button className="btn-add" onClick={handleAddClick}>
          <Plus size={16} />
          Ajouter un véhicule
        </button>
      </div>

      <div className="mycars-filters ac-card">
        <div className="search-box ac-input-dark">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par marque ou modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={16} className="filter-icon text-gray-400" />
          <span>Filtrer par:</span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="reserved">Réservé</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Prix (défaut)</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      <div className="mycars-table-container ac-card">
        {isLoading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <table className="mycars-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Véhicule</th>
                <th>Prix / Jour</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCars.length > 0 ? (
                currentCars.map((car) => (
                  <tr key={car.id}>
                    <td>
                      <div className="car-image">
                        <img src={car.cover_image_url} alt={car.brand} />
                      </div>
                    </td>
                    <td>
                      <div className="car-info">
                        <span className="car-brand">{car.brand}</span>
                        <span className="car-model">{car.model}</span>
                      </div>
                    </td>
                    <td>
                      <span className="price">
                        {car.price_per_day} <small>MAD</small>
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(car.status)}`}>
                        {car.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-action btn-view" title="Voir">
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditClick(car)}
                          title="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteClick(car.id)}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container ac-card">
          <div className="pagination-info">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`pagination-btn ${currentPage === pageNumber ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      <div className="mycars-stats">
        <div className="stat-card">
          <div className="stat-icon red">
            <Car size={20} className="text-red-500" />
          </div>
          <div className="stat-content">
            <span className="stat-label">FLOTTE TOTALE</span>
            <span className="stat-value">{totalCars}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Eye size={20} className="text-green-500" />
          </div>
          <div className="stat-content">
            <span className="stat-label">DISPONIBLES</span>
            <span className="stat-value">{availableCars}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <TrendingUp size={20} className="text-yellow-500" />
          </div>
          <div className="stat-content">
            <span className="stat-label">REVENU ESTIMÉ</span>
            <span className="stat-value">
              {estimatedRevenue.toLocaleString()} MAD
            </span>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {formMode === "add"
                  ? "Ajouter un véhicule"
                  : "Modifier le véhicule"}
              </h2>
              <button className="modal-close" onClick={handleCloseForm}>
                ×
              </button>
            </div>
            <CarFormModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;
