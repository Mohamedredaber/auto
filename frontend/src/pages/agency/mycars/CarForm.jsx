import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../../hooks/useForm'; // Ajuste le chemin selon ton projet
import { createCarThunk } from '../../../features/agency/carThunks';
import '../../../styles/pages/AddCarForm.css';

function CarForm({ onClose }) {
    const dispatch = useDispatch();

    const {
        values,
        errors,
        touched,
        loading,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm({
        initialValues: {
            brand: '',
            model: '',
            category: 'Economy',
            year: new Date().getFullYear(),
            transmission: 'manual',
            fuel: 'diesel',
            seats: 5,
            doors: 4,
            price_per_day: '',
            status: 'available',
            cover_image_url: '', // Correspond à ta migration car_images
            additional_information: ''
        },
        validate: (vals) => {
            const errs = {};
            if (!vals.brand) errs.brand = "La marque est requise";
            if (!vals.model) errs.model = "Le modèle est requis";
            if (!vals.price_per_day || vals.price_per_day <= 0) errs.price_per_day = "Prix invalide";
            if (!vals.year || vals.year < 1990) errs.year = "Année invalide";
            return errs;
        },
        onSubmit: async (formValues) => {
            const result = await dispatch(createCarThunk(formValues));
            if (createCarThunk.fulfilled.match(result)) {
                onClose(); 
            }
        }
    });
    return (
        <div className="modal-overlay">
            <div className="form-container">
                <header className="form-header">
                    <h2>Ajouter un <span>Véhicule</span></h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </header>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-section-title">Informations Générales</div>
                    
                    <div className="form-group">
                        <label>Marque</label>
                        <input 
                            type="text" name="brand" 
                            className={`form-control ${touched.brand && errors.brand ? 'error' : ''}`}
                            value={values.brand} onChange={handleChange} onBlur={handleBlur}
                        />
                        {touched.brand && errors.brand && <span className="error-msg">{errors.brand}</span>}
                    </div>

                    <div className="form-group">
                        <label>Modèle</label>
                        <input 
                            type="text" name="model" 
                            className={`form-control ${touched.model && errors.model ? 'error' : ''}`}
                            value={values.model} onChange={handleChange} onBlur={handleBlur}
                        />
                    </div>

                    <div className="form-group">
                        <label>Catégorie</label>
                        <select name="category" className="form-control" value={values.category} onChange={handleChange}>
                            <option value="Sport">Sport</option>
                            <option value="Luxury">Luxe</option>
                            <option value="SUV">SUV</option>
                            <option value="Economy">Economie</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Année</label>
                        <input type="number" name="year" className="form-control" value={values.year} onChange={handleChange} />
                    </div>

                    <div className="form-section-title">Technique & Prix</div>

                    <div className="form-group">
                        <label>Transmission</label>
                        <select name="transmission" className="form-control" value={values.transmission} onChange={handleChange}>
                            <option value="manual">Manuelle</option>
                            <option value="automatic">Automatique</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Prix / Jour (MAD)</label>
                        <input 
                            type="number" name="price_per_day" 
                            className={`form-control ${touched.price_per_day && errors.price_per_day ? 'error' : ''}`}
                            value={values.price_per_day} onChange={handleChange} onBlur={handleBlur}
                        />
                    </div>

                    <div className="form-group">
                        <label>Sièges</label>
                        <input type="number" name="seats" className="form-control" value={values.seats} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Carburant</label>
                        <select name="fuel" className="form-control" value={values.fuel} onChange={handleChange}>
                            <option value="diesel">Diesel</option>
                            <option value="gasoline">Essence</option>
                            <option value="hybrid">Hybride</option>
                            <option value="electric">Électrique</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>URL de l'image de couverture</label>
                        <input 
                            type="text" name="cover_image_url" 
                            className="form-control" 
                            placeholder="https://..."
                            value={values.cover_image_url} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Notes additionnelles</label>
                        <textarea 
                            name="additional_information" 
                            className="form-control" rows="2"
                            value={values.additional_information} onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="footer-actions full-width">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'CHARGEMENT...' : 'ENREGISTRER LE VÉHICULE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CarForm;