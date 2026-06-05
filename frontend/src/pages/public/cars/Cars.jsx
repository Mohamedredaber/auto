import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCars } from "../../../hooks/useCars";
import FilterBar from "./components/CarFilters/FilterBar";
import CarList from "./components/CarList/CarList";
import Pagination from "./components/Pagination/Pagination";
import "../../../styles/pages/cars.css";
export default function Cars() {
  const location = useLocation();

  // Initialize filters from URL query string so initial render already uses them
  const parseInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    const initial = {
      page: params.has("page") ? parseInt(params.get("page"), 10) || 1 : 1,
      search: params.get("search") || "",
      brand: params.get("brand") || "",
      city: params.get("city") || "",
      status: params.get("status") || "",
      fuel: params.get("fuel") || "",
      sort: params.get("sort") || "price_asc",
      max_price: params.has("max_price")
        ? Number(params.get("max_price"))
        : 3000,
    };
    return initial;
  };

  const [filters, setFilters] = useState(() => parseInitialFilters());

  // Keep URL -> state in sync when search changes (if user navigates with back/forward)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = {};
    if (params.has("page"))
      fromQuery.page = parseInt(params.get("page"), 10) || 1;
    if (params.has("city")) fromQuery.city = params.get("city") || "";
    if (params.has("brand")) fromQuery.brand = params.get("brand") || "";
    if (params.has("search")) fromQuery.search = params.get("search") || "";
    if (Object.keys(fromQuery).length > 0) {
      setFilters((prev) => ({ ...prev, ...fromQuery }));
    }
  }, [location.search]);
  const { cars, loading, error, pagination } = useCars(filters);
  console.log(cars);
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);
  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleReserve = useCallback((car) => {
    console.log("Réserver voiture:", car.id);
  }, []);

  return (
    <div className="cars-page">
      <section className="cars-hero">
        <div className="cars-hero__content">
          <h1 className="cars-hero__title">
            Découvrez nos <span className="cars-hero__accent">véhicules</span>
          </h1>
          <p className="cars-hero__sub">
            Plus de{" "}
            <span className="cars-hero__count">{pagination?.total ?? "—"}</span>{" "}
            voitures disponibles à la location au Maroc.
          </p>
        </div>
      </section>

      <section className="cars-main">
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {!loading && !error && pagination && (
          <div className="cars-results-header">
            <span className="cars-results-count">
              {pagination.total} véhicule{pagination.total > 1 ? "s" : ""}{" "}
              trouvé
              {pagination.total > 1 ? "s" : ""}
            </span>
          </div>
        )}
        <CarList
          cars={cars}
          loading={loading}
          error={error}
          onReserve={handleReserve}
        />
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </section>
    </div>
  );
}
