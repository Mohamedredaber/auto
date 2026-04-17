import { useState, useCallback } from "react";
import { SearchIcon } from "../../../../../components/layout/icons/index";
import "../../../../../styles/components/filterbar.css";

/* ─── Constantes ────────────────────────────────────── */
const BRANDS = [
  "Toutes les marques",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Porsche",
  "Land Rover",
  "Toyota",
  "Volkswagen",
  "Dacia",
  "Hyundai",
  "Peugeot",
  "Renault",
  "Ford",
  "Kia",
  "Nissan",
];

const VILLES = [
  "Toutes les villes",
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Tétouan",
];

const STATUTS = [
  { value: "", label: "Tous les statuts" },
  { value: "available", label: "Disponible" },
  { value: "rented", label: "Loué" },
  { value: "maintenance", label: "Maintenance" },
];

const FUEL_TYPES = [
  { value: "", label: "Carburant" },
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "electrique", label: "Électrique" },
  { value: "hybride", label: "Hybride" },
];

const SORT_OPTIONS = [
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "newest", label: "Plus récent" },
];

const PRICE_MAX_DEFAULT = 3000;

/* ─── Component ─────────────────────────────────────── */
export default function FilterBar({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search ?? "");

  /* Debounce manuel sur le search */
  const handleSearchChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSearch(val);
      clearTimeout(window.__searchTimer);
      window.__searchTimer = setTimeout(() => {
        onChange({ ...filters, search: val, page: 1 });
      }, 400);
    },
    [filters, onChange],
  );

  const handleField = (key) => (e) => {
    onChange({ ...filters, [key]: e.target.value, page: 1 });
  };

  const handlePriceMax = (e) => {
    onChange({ ...filters, max_price: Number(e.target.value), page: 1 });
  };

  const handleReset = () => {
    setSearch("");
    // Réinitialiser tous les filtres aux valeurs par défaut
    onChange({
      page: 1,
      search: "",
      brand: "",
      city: "",
      status: "",
      fuel: "",
      sort: "price_asc",
      max_price: PRICE_MAX_DEFAULT,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.brand ||
    filters.city ||
    filters.status ||
    filters.fuel ||
    filters.max_price;
  return (
    <div className="filterbar">
      {/* ── Ligne 1 : search + selects ── */}
      <div className="filterbar__row">
        {/* Search */}
        <div className="filterbar__search">
          <SearchIcon className="filterbar__search-icon" />
          <input
            type="text"
            className="filterbar__input"
            placeholder="Rechercher par marque ou modèle..."
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button
              type="button"
              className="filterbar__clear-input"
              onClick={() => {
                setSearch("");
                onChange({ ...filters, search: "", page: 1 });
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Ville */}
        <div className="filterbar__select-wrap">
          <select
            className="filterbar__select"
            value={filters.city ?? ""}
            onChange={handleField("city")}
          >
            {VILLES.map((v) => (
              <option key={v} value={v === "Toutes les villes" ? "" : v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Marque */}
        <div className="filterbar__select-wrap">
          <select
            className="filterbar__select"
            value={filters.brand ?? ""}
            onChange={handleField("brand")}
          >
            {BRANDS.map((b) => (
              <option key={b} value={b === "Toutes les marques" ? "" : b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Statut */}
        <div className="filterbar__select-wrap">
          <select
            className="filterbar__select"
            value={filters.status ?? ""}
            onChange={handleField("status")}
          >
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Carburant */}
        <div className="filterbar__select-wrap">
          <select
            className="filterbar__select"
            value={filters.fuel ?? ""}
            onChange={handleField("fuel")}
          >
            {FUEL_TYPES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div className="filterbar__select-wrap">
          <select
            className="filterbar__select"
            value={filters.sort ?? "price_asc"}
            onChange={handleField("sort")}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Ligne 2 : Prix slider + reset ── */}
      <div className="filterbar__row filterbar__row--secondary">
        <div className="filterbar__price-wrap">
          <label className="filterbar__price-label">
            Prix max :{" "}
            <span className="filterbar__price-value">
              {(filters.max_price ?? PRICE_MAX_DEFAULT).toLocaleString("fr-MA")}{" "}
              MAD / jour
            </span>
          </label>
          <input
            type="range"
            className="filterbar__slider"
            min={100}
            max={5000}
            step={50}
            value={filters.max_price ?? PRICE_MAX_DEFAULT}
            onChange={handlePriceMax}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="filterbar__reset"
            onClick={handleReset}
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}
