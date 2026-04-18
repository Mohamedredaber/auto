// components/cars/form/CarFormFields.jsx

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
};

const labelStyle = {
  fontSize: "var(--text-sm)",
  fontWeight: "var(--weight-medium)",
  color: "var(--color-text-secondary)",
};

const inputStyle = {
  background: "var(--color-bg-input)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  padding: "var(--space-2) var(--space-3)",
  color: "var(--color-text-primary)",
  fontSize: "var(--text-sm)",
  outline: "none",
  width: "100%",
  fontFamily: "var(--font-body)",
  transition: "border-color var(--transition-fast)",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "var(--space-4)",
};

const CAR_FEATURES = [
  { id: "climatisation", label: "Climatisation Bi-zone" },
  { id: "gps", label: "GPS Intégré" },
  { id: "bluetooth", label: "Bluetooth / Apple CarPlay" },
  { id: "toit_panoramique", label: "Toit Panoramique" },
  { id: "camera_recul", label: "Caméra de recul" },
  { id: "cuir", label: "Sièges en cuir" },
  { id: "assurance", label: "Assurance Premium" },
  { id: "kilometrage", label: "Kilométrage illimité" },
];

const Field = ({ label, required, children }) => (
  <div style={fieldStyle}>
    <label style={labelStyle}>
      {label}
      {required && (
        <span style={{ color: "var(--color-red-500)", marginLeft: "2px" }}>*</span>
      )}
    </label>
    {children}
  </div>
);

const CarFormFields = ({ data, onChange }) => {
  
  // Gestionnaire pour les inputs classiques et selects
  const handle = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // Gestionnaire spécifique pour les cases à cocher (Tableau JSON)
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const currentFeatures = data.features || [];
    
    let updatedFeatures;
    if (checked) {
      updatedFeatures = [...currentFeatures, value];
    } else {
      updatedFeatures = currentFeatures.filter((id) => id !== value);
    }
    
    // On appelle onChange avec le nom du champ et le nouveau tableau
    onChange("features", updatedFeatures);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

      {/* Brand + Model */}
      <div style={gridStyle}>
        <Field label="Marque" required>
          <input
            style={inputStyle}
            name="brand"
            value={data.brand}
            onChange={handle}
            placeholder="ex: BMW"
          />
        </Field>
        <Field label="Modèle" required>
          <input
            style={inputStyle}
            name="model"
            value={data.model}
            onChange={handle}
            placeholder="ex: Série 5"
          />
        </Field>
      </div>

      {/* Category + Year */}
      <div style={gridStyle}>
        <Field label="Catégorie" required>
          <select style={selectStyle} name="category" value={data.category} onChange={handle}>
            <option value="">Sélectionner...</option>
            <option value="sedan">Berline</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupé</option>
            <option value="van">Van</option>
            <option value="convertible">Cabriolet</option>
            <option value="pickup">Pickup</option>
          </select>
        </Field>
        <Field label="Année" required>
          <input
            style={inputStyle}
            name="year"
            type="number"
            value={data.year}
            onChange={handle}
            min={1990}
            max={new Date().getFullYear() + 1}
          />
        </Field>
      </div>

      {/* Transmission + Fuel */}
      <div style={gridStyle}>
        <Field label="Transmission" required>
          <select style={selectStyle} name="transmission" value={data.transmission} onChange={handle}>
            <option value="">Sélectionner...</option>
            <option value="manual">Manuelle</option>
            <option value="automatic">Automatique</option>
          </select>
        </Field>
        <Field label="Carburant" required>
          <select style={selectStyle} name="fuel" value={data.fuel} onChange={handle}>
            <option value="">Sélectionner...</option>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Essence</option>
            <option value="hybrid">Hybride</option>
            <option value="electric">Électrique</option>
          </select>
        </Field>
      </div>

      {/* Seats + Doors + Price */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-4)" }}>
        <Field label="Places" required>
          <input style={inputStyle} name="seats" type="number" value={data.seats} onChange={handle} />
        </Field>
        <Field label="Portes" required>
          <input style={inputStyle} name="doors" type="number" value={data.doors} onChange={handle} />
        </Field>
        <Field label="Prix / jour (MAD)" required>
          <input style={inputStyle} name="price_per_day" type="number" value={data.price_per_day} onChange={handle} />
        </Field>
      </div>

      {/* Statut */}
      <Field label="Statut" required>
        <select style={selectStyle} name="status" value={data.status} onChange={handle}>
          <option value="available">Disponible</option>
          <option value="reserved">Loué</option>
          <option value="maintenance">En maintenance</option>
        </select>
      </Field>

      {/* Équipements et Services (Checkboxes) */}
      <Field label="Équipements et Services">
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
          gap: "10px",
          padding: "var(--space-3)",
          backgroundColor: "var(--color-bg-input)", 
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)" 
        }}>
          {CAR_FEATURES.map((feature) => (
            <label key={feature.id} style={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              color: "var(--color-text-primary)",
              fontSize: "var(--text-sm)"
            }}>
              <input
                type="checkbox"
                value={feature.id}
                checked={data.features?.includes(feature.id)}
                onChange={handleCheckboxChange}
                style={{ 
                  marginRight: "10px", 
                  width: "16px", 
                  height: "16px", 
                  accentColor: "var(--color-primary, #e53e3e)" 
                }}
              />
              {feature.label}
            </label>
          ))}
        </div>
      </Field>

      {/* Notes additionnelles */}
      <Field label="Notes ou remarques">
        <textarea
          style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
          name="additional_information"
          value={data.additional_information}
          onChange={handle}
          placeholder="Autres détails particuliers..."
        />
      </Field>
    </div>
  );
};

export default CarFormFields;