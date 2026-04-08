
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { selectCarLoading, selectCarErrors } from "../../../features/agency/carSelectors";
// import {
//   createCarThunk,
//   updateCarThunk,
// } from "../../../features/agency/carThunks"
// import { clearErrors, closeModals } from "../../../features/agency/carSlice";
// import "./CarForm.css";

// const CarForm = ({ mode, carData, onClose }) => {
//   const dispatch = useDispatch();
//   const isLoading = useSelector(selectCarLoading);
//   const errors = useSelector(selectCarErrors);
//   const intialeState = {
//       brand: "",
//     model: "",
//     year: "",
//     city: "",
//     price_per_day: "",
//     status: "disponible",
//     fuel: "essence",
//     transmission: "automatique",
//     seats: "",
//     available_from: "",
//     available_to: "",   
//     cover_image: null,
//     additional_information: ""
//   };
//   }
//   const [formData, setFormData] = useState(intialeState);

//   const [images, setImages] = useState([]);
//   const [previewImages, setPreviewImages] = useState([]);

//   useEffect(() => {
//     if (mode === "edit" && carData) {
//       setFormData({
//         category: carData.category || "",
//         brand: carData.brand || "",
//         model: carData.model || "",
//         year: carData.year || "",
//         transmission: carData.transmission || "automatique",
//         city: carData.city || "",
//         fuel: carData.fuel || "essence",
//         seats: carData.seats || "",
//         doors :carData.doors || "",
//         price_per_day: carData.price_per_day || "",
//         status: carData.status || "disponible",
//         availaible_from :carData.available_from || "",
//         cover_image: carData.cover_image || "", 
//         available_to :carData.available_to || "",
//         additional_information: carData.additional_information || "",
//       });
//       if (carData.images) {
//         setPreviewImages(carData.images);
//       }
//     }
//   }, [mode, carData]);
//   useEffect(() => {
//     return () => {
//       dispatch(clearErrors());
//     };
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleImageChangeCover = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({
//       ...prev,
//       cover_image: file,    
//     }));  
//   }


//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviewImages(previews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const submitData = new FormData();
    
//     // Ajouter les données du formulaire
//     Object.keys(formData).forEach((key) => {
//       submitData.append(key, formData[key]);
//     });

//     // Ajouter les images
//     images.forEach((image) => {
//       submitData.append("images[]", image);
//     });

//     try {
//       if (mode === "add") {
//         await dispatch(createCarThunk(submitData)).unwrap();
//       } else {
//         await dispatch(updateCarThunk({ id: carData.id, formData: submitData })).unwrap();
//       }
//       dispatch(closeModals());
//     } catch (error) {
//       // Les erreurs sont gérées par Redux
//       console.error("Form submission error:", error);
//     }
//   };

//   const cities = [
//     "Casablanca",
//     "Rabat",
//     "Marrakech",
//     "Fès",
//     "Tanger",
//     "Agadir",
//     "Meknès",
//     "Oujda",
//   ];

//   return (
//     <form className="car-form" onSubmit={handleSubmit}>
//       {/* Afficher les erreurs globales */}
//       {errors?.message && (
//         <div className="form-error-global">
//           {errors.message}
//         </div>
//       )}

//       <div className="form-grid">
//         {/* Marque */}
//         <div className="form-group">
//           <label htmlFor="brand">Marque *</label>
//           <input
//             type="text"
//             id="brand"
//             name="brand"
//             value={formData.brand}
//             onChange={handleChange}
//             placeholder="Ex: BMW, Mercedes..."
//             required
//           />
//           {errors?.errors?.brand && (
//             <span className="form-error">{errors.errors.brand[0]}</span>
//           )}
//         </div>

//         {/* Modèle */}
//         <div className="form-group">
//           <label htmlFor="model">Modèle *</label>
//           <input
//             type="text"
//             id="model"
//             name="model"
//             value={formData.model}
//             onChange={handleChange}
//             placeholder="Ex: Série 5, Classe E..."
//             required
//           />
//           {errors?.errors?.model && (
//             <span className="form-error">{errors.errors.model[0]}</span>
//           )}
//         </div>

//         {/* Année */}
//         <div className="form-group">
//           <label htmlFor="year">Année *</label>
//           <input
//             type="number"
//             id="year"
//             name="year"
//             value={formData.year}
//             onChange={handleChange}
//             placeholder="Ex: 2023"
//             min="2000"
//             max={new Date().getFullYear() + 1}
//             required
//           />
//           {errors?.errors?.year && (
//             <span className="form-error">{errors.errors.year[0]}</span>
//           )}
//         </div>

//         {/* Ville */}
//         <div className="form-group">
//           <label htmlFor="city">Ville *</label>
//           <select
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Sélectionner une ville</option>
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>
//           {errors?.errors?.city && (
//             <span className="form-error">{errors.errors.city[0]}</span>
//           )}
//         </div>

//         {/* Prix par jour */}
//         <div className="form-group">
//           <label htmlFor="price_per_day">Prix / Jour (MAD) *</label>
//           <input
//             type="number"
//             id="price_per_day"
//             name="price_per_day"
//             value={formData.price_per_day}
//             onChange={handleChange}
//             placeholder="Ex: 500"
//             min="0"
//             required
//           />
//           {errors?.errors?.price_per_day && (
//             <span className="form-error">{errors.errors.price_per_day[0]}</span>
//           )}
//         </div>

//         {/* Statut */}
//         <div className="form-group">
//           <label htmlFor="status">Statut</label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <option value="disponible">Disponible</option>
//             <option value="loué">Loué</option>
//             <option value="indisponible">Indisponible</option>
//           </select>
//         </div>

//         {/* Type de carburant */}
//         <div className="form-group">
//           <label htmlFor="fuel_type">Carburant</label>
//           <select
//             id="fuel_type"
//             name="fuel_type"
//             value={formData.fuel_type}
//             onChange={handleChange}
//           >
//             <option value="essence">Essence</option>
//             <option value="diesel">Diesel</option>
//             <option value="hybride">Hybride</option>
//             <option value="electrique">Électrique</option>
//           </select>
//         </div>

//         {/* Transmission */}
//         <div className="form-group">
//           <label htmlFor="transmission">Transmission</label>
//           <select
//             id="transmission"
//             name="transmission"
//             value={formData.transmission}
//             onChange={handleChange}
//           >
//             <option value="automatique">Automatique</option>
//             <option value="manuelle">Manuelle</option>
//           </select>
//         </div>

//         {/* Nombre de places */}
//         <div className="form-group">
//           <label htmlFor="seats">Nombre de places</label>
//           <input
//             type="number"
//             id="seats"
//             name="seats"
//             value={formData.seats}
//             onChange={handleChange}
//             placeholder="Ex: 5"
//             min="2"
//             max="9"
//           />
//         </div>
//       </div>

//       {/* Description */}
//       <div className="form-group full-width">
//         <label htmlFor="description">Description</label>
//         <textarea
//           id="description"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Décrivez le véhicule, ses options, son état..."
//           rows="3"
//         />
//       </div>

//       {/* Images */}
//       <div className="form-group full-width">
//         <label htmlFor="images">Images du véhicule</label>
//         <div className="image-upload-area">
//           <input
//             type="file"
//             id="images"
//             name="images"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//           />
//           <div className="upload-placeholder">
//             <span className="upload-icon">📷</span>
//             <span>Cliquez ou déposez vos images ici</span>
//           </div>
//         </div>
//         {previewImages.length > 0 && (
//           <div className="image-previews">
//             {previewImages.map((preview, index) => (
//               <div key={index} className="image-preview">
//                 <img src={preview} alt={`Preview ${index + 1}`} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Buttons */}
//       <div className="form-actions">
//         <button type="button" className="btn-cancel" onClick={onClose}>
//           Annuler
//         </button>
//         <button type="submit" className="btn-submit" disabled={isLoading}>
//           {isLoading ? (
//             <span className="loading-spinner">⏳</span>
//           ) : mode === "add" ? (
//             "Ajouter le véhicule"
//           ) : (
//             "Enregistrer les modifications"
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CarForm;
