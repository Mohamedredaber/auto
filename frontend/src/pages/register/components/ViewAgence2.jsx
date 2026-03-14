import { useForm } from "../../../hooks/useForm";
import * as Icon from "../../../components/layout/icons";
import { InputField, SelectField, UploadLogo } from "./FormComponents";

const VILLES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Tétouan", "Essaouira", "El Jadida", "Dakhla", "Laâyoune", "Béni Mellal"];

export default function ViewAgence2({ onBack, onSuccess, initialValues }) {
    const initialFormValues = { nom: "", ville: "", cp: "", adresse: "", open: "08:00", close: "20:00", fb: "", ig: "", wa: "", web: "", logo: null };

    const validate = (values) => {
        const e = {};
        if (!values.nom.trim()) e.nom = "Champ requis";
        if (!values.ville) e.ville = "Sélectionnez une ville";
        return e;
    };

    const onSubmit = async (values) => {
        await new Promise(r => setTimeout(r, 1600));
        onSuccess("agence");
    };

    const { values, errors, isSubmitting, handleChange, setFieldValue, handleSubmit } = useForm({
        initialValues: initialFormValues,
        validate,
        onSubmit
    });

    return (
        <div className="rp-view">
            <div className="rp-fheader">
                <button type="button" className="rp-back" onClick={onBack}><Icon.ArrowLeft /> Étape précédente</button>
                <h1 className="rp-ftitle">Informations <span className="rp-ftitle-accent">agence</span></h1>
                <p className="rp-fsub">Présentez votre agence aux clients sur la plateforme.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <InputField label="Nom de l'agence" id="agNom" name="nom" placeholder="Ex: AutoConnect Marrakech" icon={<Icon.Building />} value={values.nom} onChange={handleChange} error={errors.nom} />

                <div className="rp-row">
                    <SelectField label="Ville" id="agVille" name="ville" icon={<Icon.MapPin />} value={values.ville} onChange={handleChange} options={VILLES} error={errors.ville} />
                    <InputField label="Code postal" id="agCP" name="cp" placeholder="20000" icon={<Icon.MapPin />} value={values.cp} onChange={handleChange} />
                </div>

                <InputField label="Adresse complète" id="agAddr" name="adresse" placeholder="12 Rue Mohammed V, Casablanca" icon={<Icon.Home />} value={values.adresse} onChange={handleChange} />

                <div className="rp-group">
                    <label className="rp-label">Horaires d'ouverture</label>
                    <div className="rp-time-row">
                        <div className="rp-input-wrap">
                            <span className="rp-icon"><Icon.Clock /></span>
                            <input type="time" name="open" className="rp-input" value={values.open} onChange={handleChange} />
                        </div>
                        <div className="rp-input-wrap">
                            <span className="rp-icon"><Icon.Clock /></span>
                            <input type="time" name="close" className="rp-input" value={values.close} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="rp-group">
                    <label className="rp-label">Logo de l'agence</label>
                    <UploadLogo file={values.logo} onChange={(file) => setFieldValue("logo", file)} />
                </div>

                <div className="rp-group">
                    <label className="rp-label">
                        Réseaux sociaux
                        <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", marginLeft: 6 }}>(optionnel)</span>
                    </label>
                    <div className="rp-social-grid">
                        {[
                            { k: "fb", ph: "facebook.com/agence", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
                            { k: "ig", ph: "instagram.com/agence", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg> },
                            { k: "wa", ph: "wa.me/212600000000", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg> },
                            { k: "web", ph: "www.monagence.ma", icon: <Icon.Link /> },
                        ].map(s => (
                            <div className="rp-input-wrap" key={s.k}>
                                <span className="rp-icon">{s.icon}</span>
                                <input type="url" name={s.k} className="rp-input" placeholder={s.ph} value={values[s.k]} onChange={handleChange} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rp-btn-actions">
                    <button type="submit" className="rp-btn rp-btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? <><div className="rp-spin" /> Création du compte…</> : <><Icon.Building /> Créer le compte agence</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
