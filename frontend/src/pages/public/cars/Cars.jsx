import { useState, useCallback } from "react";
import { useCars } from "../../../hooks/useCars";
import FilterBar from "./components/CarFilters/FilterBar";
import CarList from "./components/CarList/CarList";
import Pagination from "./components/Pagination/Pagination";
import "../../../styles/pages/cars.css";


export default function Cars() {
  const [filters, setFilters] = useState({
    page:      1,
    search:    "",
    brand:     "",
    city:      "",
    status:    "",
    fuel:      "",
    sort:      "price_asc",
    max_price: 3000,
  });
  const { cars, loading, error, pagination } = useCars(filters);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  /* Changement de page */
  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* Action "Réserver" depuis CarCard */
  const handleReserve = useCallback((car) => {
    console.log("Réserver voiture:", car.id);
  }, []);

  return (
    <div className="cars-page">
      {/* ── Hero Header ── */}
      <section className="cars-hero">
        <div className="cars-hero__content">
          <h1 className="cars-hero__title">
            Découvrez nos <span className="cars-hero__accent">véhicules</span>
          </h1>
          <p className="cars-hero__sub">
            Plus de{" "}
            <span className="cars-hero__count">
              {pagination?.total ?? "—"}
            </span>{" "}
            voitures disponibles à la location au Maroc.
          </p>
        </div>
      </section>

      {/* ── Contenu principal ── */}
      <section className="cars-main">
        {/* Filtres */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Résultats header */}
        {!loading && !error && pagination && (
          <div className="cars-results-header">
            <span className="cars-results-count">
              {pagination.total} véhicule{pagination.total > 1 ? "s" : ""} trouvé
              {pagination.total > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Liste */}
        <CarList
          cars={cars}
          loading={loading}
          error={error}
          onReserve={handleReserve}
        />

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
}
