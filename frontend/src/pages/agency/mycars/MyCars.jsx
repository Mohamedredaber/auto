"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  
  // Sélecteurs Redux
  const cars = useSelector(selectAllCars);
  const isLoading = useSelector(selectCarLoading);
  const isFormOpen = useSelector(selectIsFormOpen);
  const formMode = useSelector(selectFormMode);

  // États locaux pour les filtres et pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAgencyCarsThunk());
  }, [dispatch]);

  // --- LOGIQUE DE FILTRAGE ET TRI ---
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !cityFilter || car.city === cityFilter;
    const matchesStatus = !statusFilter || car.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOrder === "asc") return a.price_per_day - b.price_per_day;
    if (sortOrder === "desc") return b.price_per_day - a.price_per_day;
    return 0;
  });

  // --- PAGINATION ---
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  // --- STATISTIQUES ---
  const totalCars = cars.length;
  const availableCars = cars.filter(c => c.status === "disponible").length;
  const estimatedRevenue = cars.reduce((acc, c) => acc + (Number(c.price_per_day) || 0), 0);

  const handleCloseForm = () => dispatch(closeModals());

  return (
    <div className="mycars-container">
      {/* Header */}
      <div className="mycars-header">
        <div className="header-content">
          <div className="header-icon">🚗</div>
          <div className="header-text">
            <h1>Gestion de la Flotte</h1>
            <p>Gérez vos véhicules et suivez leur disponibilité.</p>
          </div>
        </div>
        <button className="btn-add" onClick={() => dispatch(openAddForm())}>
          + Ajouter un véhicule
        </button>
      </div>

      {/* Filtres UI... (Garder le code de dashagency ici) */}
      
      {/* Table Section */}
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
              {currentCars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <img src={car.cover_image_url || car.images?.[0]} alt={car.brand} className="car-image-thumb" />
                  </td>
                  <td>{car.brand} {car.model}</td>
                  <td>{car.city || 'Tanger'}</td>
                  <td>{car.price_per_day} MAD</td>
                  <td>
                    <span className={`status-badge ${car.status}`}>
                      {car.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => dispatch(openEditForm(car))}>✏️</button>
                      <button onClick={() => {
                        if(window.confirm("Supprimer ?")) dispatch(deleteCarThunk(car.id))
                      }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formMode === "add" ? "Ajouter" : "Modifier"}</h2>
              <button onClick={handleCloseForm}>×</button>
            </div>
            <CarFormModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;