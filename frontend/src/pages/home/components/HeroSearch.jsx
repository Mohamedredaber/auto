import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, MapPinIcon } from "./icon";
import "./herosearch.css";

const VILLES_PRESET = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];

export default function HeroSearch() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    params.append("page", "1");
    if (city) params.append("city", city);
    if (brand) params.append("brand", brand);

    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="hero-search">
      <div className="hero-search__overlay">
        <div className="hero-search__content">
          
          <p className="hero-search__badge">#1 Location de voitures au Maroc</p>

          <h1 className="hero-search__title">
            Trouver la voiture <span>parfaite</span><br />
            pour votre voyage
          </h1>

          <p className="hero-search__subtitle">
            Comparez les offres des meilleures agences de location et réservez 
            votre véhicule premium en quelques minutes seulement.          </p>

          <form className="hero-search__form" onSubmit={handleSearch}>
            <div className="hero-search__input-group">
              <label>
                <MapPinIcon width={16} stroke="var(--color-red-500)" />
                Ville
              </label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Où allez-vous ?</option>
                {VILLES_PRESET.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="hero-search__divider"></div>

            <div className="hero-search__input-group">
              <label>Marque</label>
              <input 
                type="text" 
                placeholder="Ex: BMW, Audi..." 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <button type="submit" className="hero-search__button">
              <SearchIcon width={20} />
              <span>Rechercher</span>
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}