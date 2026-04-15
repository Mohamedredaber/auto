import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../features/catalog/catalogThunks";

function Cars() {
  const dispatch = useDispatch();
  const { cars, loading, error, pagination } = useSelector(
    (state) => state.catalog,
  );

  useEffect(() => {
    console.log("🔄 [Car Page] Montage du composant - Déclenchement fetchCars");
    dispatch(fetchCars());
  }, [dispatch]);

  // Comprehensive Debugging
  console.log("📊 [Car Page] État Catalog:");
  console.log("  ├─ loading:", loading);
  console.log("  ├─ error:", error);
  console.log("  ├─ cars type:", typeof cars);
  console.log("  ├─ cars is array?:", Array.isArray(cars));
  console.log("  ├─ cars length:", cars?.length || 0);
  console.log("  ├─ cars data:", cars);
  console.log("  └─ pagination:", pagination);

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>⏳ Chargement des voitures...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fee",
          borderRadius: "4px",
          border: "1px solid #f88",
        }}
      >
        <h2>❌ Erreur lors du chargement</h2>
        <details>
          <summary>Voir les détails</summary>
          <pre
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              overflow: "auto",
            }}
          >
            {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚗 Catalogue des Voitures</h1>

      {!Array.isArray(cars) || cars.length === 0 ? (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "16px", color: "#666" }}>
            ℹ️ Aucune voiture trouvée
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#e7f3ff",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            📊 {cars.length} voiture(s) trouvée(s)
            {pagination && (
              <span>
                {" "}
                (Page {pagination.currentPage}/{pagination.lastPage}, Total:{" "}
                {pagination.total})
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {cars.map((car) => (
              <div
                key={car.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                {/* Image */}
                {car.cover_image && (
                  <img
                    src={car.cover_image}
                    alt={`${car.brand} ${car.model}`}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      backgroundColor: "#f0f0f0",
                    }}
                    onError={(e) => {
                      console.warn(
                        `⚠️ Image failed to load: ${car.cover_image}`,
                      );
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="180"%3E%3Crect fill="%23ddd" width="300" height="180"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                )}

                {/* Content */}
                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      color: "#2c3e50",
                    }}
                  >
                    {car.brand} {car.model}
                  </h3>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "12px",
                      lineHeight: "1.6",
                    }}
                  >
                    {car.year && (
                      <p style={{ margin: "4px 0" }}>📅 {car.year}</p>
                    )}
                    {car.fuel && (
                      <p style={{ margin: "4px 0" }}>⛽ {car.fuel}</p>
                    )}
                    {car.transmission && (
                      <p style={{ margin: "4px 0" }}>⚙️ {car.transmission}</p>
                    )}
                    {car.seats && (
                      <p style={{ margin: "4px 0" }}>👥 {car.seats} places</p>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#007bff",
                      marginBottom: "12px",
                    }}
                  >
                    💰 {car.price_per_day} DH/jour
                  </div>

                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#0056b3")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#007bff")
                    }
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Cars;
