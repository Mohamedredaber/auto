import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAgencyCarsThunk } from '../../../features/agency/carThunks';
import '../../../styles/pages/MyCars.css';
function MyCars() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cars = useSelector(state => state.car.cars) || [];

  useEffect(() => {
    dispatch(fetchAgencyCarsThunk());
  }, [dispatch]);

  // Calculs pour les stats
  const totalFleet = cars.length;
  const availableCount = cars.filter(c => c.status === 'disponible').length;
  const totalValue = cars.reduce((acc, c) => acc + Number(c.price_per_day), 0);
  const handlenavigate = ()=>{
     navigate('/dashboard/agency/cars/add')

  }
  return (
    <div className="dashboard-wrapper">
      
      {/* 1. HEADER SECTION */}
      <header className="fleet-header">
        <div className="title-group">
          <h1>Gestion de la Flotte</h1>
          <p>Gérez vos véhicules, suivez leur disponibilité et mettez à jour les tarifs.</p>
        </div>
        <button className="btn-add-main"
            onClick={handlenavigate}
        >
          <span>+</span> AJOUTER UN NOUVEAU VÉHICULE
        </button>
      </header>

      {/* 2. FILTERS SECTION */}
      <div className="filters-container">
        <div className="search-box">
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input type="text" placeholder="Rechercher par marque ou modèle..." />
        </div>
        <div className="filter-select-group">
          <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Filtrer par :</span>
          <select className="custom-select"><option>Toutes les villes</option></select>
          <select className="custom-select"><option>Tous les statuts</option></select>
          <select className="custom-select"><option>Prix décroissant</option></select>
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="table-container">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Véhicule</th>
              <th>Ville</th>
              <th>Prix/Jour</th>
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="car-row">
                <td>
                  <img src={car.cover_image_url} alt={car.brand} className="car-img-box" />
                </td>
                <td>
                  <span className="brand-name uppercase">{car.brand}</span>
                  <span className="model-name">{car.model}</span>
                </td>
                <td>
                  <span style={{ color: 'var(--color-red-500)', fontStyle: 'italic', fontSize: '14px' }}>
                    📍 {car.city || 'Tanger'}
                  </span>
                </td>
                <td>
                  <span className="price-text">{car.price_per_day}</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>MAD</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge-status ${car.status === 'disponible' ? 'available' : 'unavailable'}`}>
                    {car.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-ui">👁️</button>
                    <button className="btn-ui">✏️</button>
                    <button className="btn-ui" style={{ color: 'var(--color-red-500)' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. STATS FOOTER SECTION */}
      <footer className="stats-footer">
        <div className="stat-item">
          <div style={{ background: 'var(--color-error-bg)', padding: '10px', borderRadius: '10px' }}>🚗</div>
          <div className="stat-info">
            <span>Flotte Totale</span>
            <h2>{totalFleet}</h2>
          </div>
        </div>
        <div className="stat-item">
          <div style={{ background: 'var(--color-success-bg)', padding: '10px', borderRadius: '10px' }}>✅</div>
          <div className="stat-info">
            <span>Disponibles</span>
            <h2>{availableCount}</h2>
          </div>
        </div>
        <div className="stat-item">
          <div style={{ background: 'var(--color-info-bg)', padding: '10px', borderRadius: '10px' }}>💰</div>
          <div className="stat-info">
            <span>Revenu Estimé</span>
            <h2>{totalValue.toLocaleString()} <small style={{ fontSize: '12px' }}>MAD</small></h2>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyCars;