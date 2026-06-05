import React from 'react';
import './CarForm.css';

const CAR_FEATURES = [
  { id: "climatisation", label: "Climatisation Bi-zone" },
  { id: "gps", label: "GPS Intégré" },
  { id: "bluetooth", label: "Bluetooth / CarPlay" },
  { id: "toit_panoramique", label: "Toit Panoramique" },
  { id: "camera_recul", label: "Caméra de recul" },
  { id: "cuir", label: "Sièges en cuir" },
  { id: "assurance", label: "Assurance Premium" },
  { id: "kilometrage", label: "Kilométrage illimité" },
];

const CarFormFields = ({ data, onChange }) => {
  
  const handle = (e) => onChange(e.target.name, e.target.value);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const currentFeatures = data.additional_information ? data.additional_information.split(',') : [];
    
    let updated;
    if (checked) {
      updated = [...currentFeatures, value];
    } else {
      updated = currentFeatures.filter(id => id !== value);
    }
    
    onChange("additional_information", updated.join(','));
  };

  const selectedFeatures = data.additional_information ? data.additional_information.split(',') : [];

  return (
    <div className="car-form-wrapper">
      
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Marque <span className="required-star">*</span></label>
          <input className="form-input" name="brand" value={data.brand} onChange={handle} placeholder="ex: BMW" />
        </div>
        <div className="form-field">
          <label className="form-label">Modèle <span className="required-star">*</span></label>
          <input className="form-input" name="model" value={data.model} onChange={handle} placeholder="ex: Série 5" />
        </div>
      </div>

      {/* SECTION: TECHNIQUE */}
      <div className="form-grid-2">
         <div className="form-field">
          <label className="form-label">Catégorie <span className="required-star">*</span></label>
          <select className="form-select" name="category" value={data.category} onChange={handle}>
            {console.log("data.category:", data.category)}
            <option value="">Sélectionner...</option>
            <option value="sedan">Berline</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupé</option>
            <option value="van">Van</option>
            <option value="convertible">Cabriolet</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Carburant <span className="required-star">*</span></label>
          <select className="form-select" name="fuel" value={data.fuel} onChange={handle}>
            <option value="">Sélectionner...</option>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Essence</option>
            <option value="hybrid">Hybride</option>
            <option value="electric">Électrique</option>
          </select>
        </div>
      </div>

      <div className="form-grid-3">
        <div className="form-field">
          <label className="form-label">Année <span className="required-star">*</span></label>
          <input className="form-input" type="number" name="year" value={data.year} onChange={handle} />
        </div>
        <div className="form-field">
          <label className="form-label">Transmission <span className="required-star">*</span></label>
          <select className="form-select" name="transmission" value={data.transmission} onChange={handle}>
            <option value="manual">Manuelle</option>
            <option value="automatic">Automatique</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Prix / jour (MAD) <span className="required-star">*</span></label>
          <input className="form-input" type="number" name="price_per_day" value={data.price_per_day} onChange={handle} placeholder="ex: 450" />
        </div>
      </div>

      {/* SECTION: DISPONIBILITÉ */}
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label">Disponible du <span className="required-star">*</span></label>
          <input className="form-input" type="date" name="available_from" value={data.available_from} onChange={handle} />
        </div>
        <div className="form-field">
          <label className="form-label">Disponible au <span className="required-star">*</span></label>
          <input className="form-input" type="date" name="available_to" value={data.available_to} onChange={handle} />
        </div>
      </div>

      {/* SECTION: ÉQUIPEMENTS */}
      <div className="form-field">
        <label className="form-label">Équipements & Services</label>
        <div className="features-grid">
          {CAR_FEATURES.map((f) => (
            <label key={f.id} className="feature-item">
              <input
                type="checkbox"
                className="feature-checkbox"
                value={f.id}
                checked={selectedFeatures.includes(f.id)}
                onChange={handleCheckboxChange}
              />
              <span className="feature-label">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Notes ou remarques</label>
        <textarea
          className="form-textarea"
          name="description"
          value={data.description}
          onChange={handle}
          placeholder="Détails supplémentaires..."
        />
      </div>
    </div>
  );
};

export default CarFormFields;