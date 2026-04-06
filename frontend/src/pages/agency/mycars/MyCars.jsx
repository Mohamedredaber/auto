import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgencyCarsThunk } from '../../../features/agency/carThunks';


function MyCars() {
  const dispatch = useDispatch();
  const cars = useSelector(state => state.car.cars);
  // const loading = useSelector(selectCarLoading);
  // const errors = useSelector(selectCarErrors);

  useEffect(() => {
    dispatch(fetchAgencyCarsThunk());
  }, [dispatch]);

  return (
   <div className="overflow-x-auto">
    <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
            <tr className="text-gray-400 text-sm">
                <th className="pb-4">Image</th>
                <th className="pb-4">Véhicule</th>
                <th className="pb-4">Ville</th>
                <th className="pb-4">Prix/Jour</th>
                <th className="pb-4">Statut</th>
                <th className="pb-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            {cars.map((car) => (
                <tr key={car.id} className="bg-[#1a1d24] rounded-lg">
                    <td className="p-4 first:rounded-l-lg">
                        <img 
                            src={car.cover_image_url} 
                            alt={car.brand} 
                            className="w-16 h-12 object-cover rounded-md"
                        />
                    </td>
                    <td className="p-4 font-semibold">
                        {car.brand} <br />
                        <span className="text-gray-400 text-xs font-normal">{car.model}</span>
                    </td>
                    <td className="p-4 text-sm">
                        <span className="flex items-center text-red-500">
                             📍 {car.city || 'Tanger'}
                        </span>
                    </td>
                    <td className="p-4 font-bold">{car.price_per_day} MAD</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                            car.status === 'disponible' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'
                        }`}>
                            {car.status}
                        </span>
                    </td>
                    <td className="p-4 last:rounded-r-lg">
                        <div className="flex space-x-3">
                            <button className="text-gray-400 hover:text-white">👁️</button>
                            <button className="text-gray-400 hover:text-blue-500">✏️</button>
                            <button 
                                // onClick={() => handleDelete(car.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  )
}
export default MyCars;