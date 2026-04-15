import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../features/catalog/catalogThunks";

function Cars() {
  const dispatch = useDispatch();
  const { cars } = useSelector((state) => state.cars);
  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);
  console.log(cars);
  return (
    <>
      <div>
        <h1>cars principal page</h1>
        {cars.length === 0 && <p>aucun elemen 
          </p>}
          
      </div>
    </>
  );
}
export default Cars;
