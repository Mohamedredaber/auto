import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminCar } from "../../api/adminCarsApi";
import "../../styles/pages/AdminCarDetails.css";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);
        const response = await fetchAdminCar(id);
        setCar(response.data.data);
      } catch (err) {
        setError("Erreur lors du chargement du véhicule.");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) return <p className="car-state">Chargement...</p>;
  if (error) return <p className="car-state error">{error}</p>;
  if (!car) return <p className="car-state">Véhicule introuvable.</p>;

  const coverImage = car.images?.find((img) => img.is_cover === 1);
  const galleryImages = car.images?.filter((img) => img.is_cover !== 1) || [];

  return (
    <div className="car-details-page">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/admin/cars")}
      >
        ← Retour aux voitures
      </button>

      <h1>
        {car.brand} {car.model}
      </h1>

      <div className="images-section">
        <div className="cover-box">
          <img
            src={coverImage?.url || "/placeholder-car.jpg"}
            alt="Cover"
          />
        </div>

        {galleryImages.length > 0 && (
          <div className="gallery-box">
            {galleryImages.map((image) => (
              <img key={image.id} src={image.url} alt="Car" />
            ))}
          </div>
        )}
      </div>

      <div className="details-table">
        <div><span>ID</span><strong>{car.id}</strong></div>
        <div><span>Agence ID</span><strong>{car.agency_id}</strong></div>
        <div><span>Marque</span><strong>{car.brand}</strong></div>
        <div><span>Modèle</span><strong>{car.model}</strong></div>
        <div><span>Catégorie</span><strong>{car.category}</strong></div>
        <div><span>Année</span><strong>{car.year}</strong></div>
        <div><span>Transmission</span><strong>{car.transmission}</strong></div>
        <div><span>Carburant</span><strong>{car.fuel}</strong></div>
        <div><span>Places</span><strong>{car.seats}</strong></div>
        <div><span>Portes</span><strong>{car.doors}</strong></div>
        <div><span>Prix / jour</span><strong>{car.price_per_day} MAD</strong></div>
        <div><span>Status</span><strong>{car.status}</strong></div>
        <div><span>Disponible du</span><strong>{car.available_from}</strong></div>
        <div><span>Disponible au</span><strong>{car.available_to}</strong></div>
      </div>

      <div className="text-section">
        <h3>Description</h3>
        <p>{car.description || "Aucune description."}</p>
      </div>

      <div className="text-section">
        <h3>Informations supplémentaires</h3>
        <div className="features-list">
            {car.additional_information ? (
                car.additional_information.split(",").map((info) => (
                <div key={info} className="feature-line">
                    {info.trim()}
                </div>
                ))
            ) : (
                <p>Aucune information.</p>
            )}
            </div>
      </div>
    </div>
  );
}