"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCars,
  selectCarLoading,
  selectIsFormOpen,
  selectFormMode,
  selectSingleCar,
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
  const singleCar = useSelector(selectSingleCar);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAgencyCarsThunk());
  }, [dispatch]);

  // Filtrer les voitures
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !cityFilter || car.city === cityFilter;
    const matchesStatus = !statusFilter || car.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Trier les voitures
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOrder === "asc") return a.price_per_day - b.price_per_day;
    if (sortOrder === "desc") return b.price_per_day - a.price_per_day;
    return 0;
  });

  // Pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  // Statistiques
  const totalCars = cars.length;
  const availableCars = cars.filter(
    (car) => car.status === "disponible",
  ).length;
  const estimatedRevenue = cars.reduce(
    (acc, car) => acc + (car.price_per_day || 0),
    0,
  );

  // Handlers
  const handleAddClick = () => {
    dispatch(openAddForm());
  };

  const handleEditClick = (car) => {
    dispatch(openEditForm(car));
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      dispatch(deleteCarThunk(id));
    }
  };

  const handleCloseForm = () => {
    dispatch(closeModals());
  };

  // Obtenir les villes uniques pour le filtre
  const uniqueCities = [
    ...new Set(cars.map((car) => car.city).filter(Boolean)),
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "disponible":
        return "status-disponible";
      case "loué":
      case "loue":
        return "status-loue";
      case "indisponible":
        return "status-indisponible";
      default:
        return "";
    }
  };

  return (
    <div className="mycars-container">
      {/* Header */}
      <div className="mycars-header">
        <div className="header-content">
          <div className="header-icon">🚗</div>
          <div className="header-text">
            <h1>Gestion de la Flotte</h1>
            <p>
              Gérez vos véhicules, suivez leur disponibilité et mettez à jour
              les tarifs.
            </p>
          </div>
        </div>
        <button className="btn-add" onClick={handleAddClick}>
          + Ajouter un nouveau véhicule
        </button>
      </div>

      {/* Filtres */}
      <div className="mycars-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par marque ou modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <span className="filter-icon">⚙️</span>
          <span>Filtrer par:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Toutes les villes</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="loué">Loué</option>
            <option value="indisponible">Indisponible</option>
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

      {/* Table */}
      <div className="mycars-table-container">
        {isLoading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <table className="mycars-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Véhicule</th>
                <th>Ville</th>
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
                        {car.images?.[0] ? (
                          <img src={car.images[0]} alt={car.brand} />
                        ) : (
                          <div className="no-image">🚗</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="car-info">
                        <span className="car-brand">{car.brand}</span>
                        <span className="car-model">{car.model}</span>
                      </div>
                    </td>
                    <td>
                      <span className="city-badge">
                        <span className="city-dot"></span>
                        {car.city}
                      </span>
                    </td>
                    <td>
                      <span className="price">
                        {car.price_per_day} <small>MAD</small>
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(car.status)}`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-action btn-view" title="Voir">
                          👁️
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditClick(car)}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteClick(car.id)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination-container">
          <span className="pagination-info">
            Affichage de {indexOfFirstCar + 1} sur {sortedCars.length} véhicules
          </span>
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mycars-stats">
        <div className="stat-card">
          <div className="stat-icon red">🚗</div>
          <div className="stat-content">
            <span className="stat-label">FLOTTE TOTALE</span>
            <span className="stat-value">{totalCars}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div className="stat-content">
            <span className="stat-label">DISPONIBLES</span>
            <span className="stat-value">{availableCars}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">💰</div>
          <div className="stat-content">
            <span className="stat-label">REVENU ESTIMÉ</span>
            <span className="stat-value">
              {estimatedRevenue.toLocaleString()} MAD
            </span>
          </div>
        </div>
      </div>

      {/* Modal Form (Add/Edit) - Affichage conditionnel basé sur Redux */}
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
            <CarFormModal
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;
