import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchcarselected } from "../../../features/booking/bookingThunks";
import { selectCarSelected, selectBookingLoading } from "../../../features/booking/bookingSelectors";

function ReservationPage() {
  const { id } = useParams(); // ID de la voiture dans l'URL
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectBookingLoading);
  useEffect(() => {
    if (id) {
      dispatch(fetchcarselected(id));
    }
  }, [id, dispatch]);
  const car = useSelector(selectCarSelected);
  console.log("Car details for reservation:", car);

  if (isLoading) return <p>Chargement du véhicule...</p>;
  if (!car) return <p>Véhicule introuvable.</p>;

  return (
    <div>
      <h1>Finalisez votre réservation</h1>
      <p>Modèle : {car.brand} {car.model}</p>
      <p>Prix : {car.price_per_day} MAD/jour</p>
    </div>
  );
}
export default ReservationPage;