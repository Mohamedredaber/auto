import React, { useEffect, useMemo, useState } from 'react';
import { Globe, Phone, Share2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateAgencyProfile } from '../../../../features/agency/agencyProfileThunks';

const AgencyDetailsForm = ({ agency }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const social = useMemo(() => {
        if (!agency?.accounts_social) return {};
        if (typeof agency.accounts_social === 'string') {
            try {
                return JSON.parse(agency.accounts_social);
            } catch {
                return {};
            }
        }
        return agency.accounts_social;
    }, [agency?.accounts_social]);

    const [formData, setFormData] = useState({
        agency_name: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        time_start: '',
        time_end: '',
        instagram: '',
        facebook: '',
        website: ''
    });

    useEffect(() => {
        setFormData({
            agency_name: agency?.agency_name || '',
            city: agency?.city || '',
            address: agency?.address || '',
            phone: agency?.phone || '',
            email: agency?.email || '',
            time_start: agency?.time_start || '',
            time_end: agency?.time_end || '',
            instagram: social?.instagram || '',
            facebook: social?.facebook || '',
            website: social?.website || ''
        });
    }, [agency, social]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            agency_name: agency?.agency_name || '',
            city: agency?.city || '',
            address: agency?.address || '',
            phone: agency?.phone || '',
            email: agency?.email || '',
            time_start: agency?.time_start || '',
            time_end: agency?.time_end || '',
            instagram: social?.instagram || '',
            facebook: social?.facebook || '',
            website: social?.website || ''
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            agency_name: formData.agency_name,
            city: formData.city,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            time_start: formData.time_start,
            time_end: formData.time_end,
            accounts_social: JSON.stringify({
                instagram: formData.instagram,
                facebook: formData.facebook,
                website: formData.website
            })
        };

        const result = await dispatch(updateAgencyProfile(payload));
        setIsSaving(false);
        if (result.meta.requestStatus === 'fulfilled') {
            setIsEditing(false);
        }
    };

    return (
        <div className="ac-card space-y-10">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold underline decoration-red-500/30 underline-offset-8">Détails de l'Agence</h3>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button type="button" className="btn-exporter" onClick={handleCancel}>Annuler</button>
                        <button type="button" className="btn-exporter" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                ) : (
                    <button type="button" className="btn-exporter" onClick={() => setIsEditing(true)}>
                        Modifier le Profil
                    </button>
                )}
            </div>

            {/* INFORMATIONS GÉNÉRALES */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} className="text-red-500" /> Informations Générales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Nom de l'Agence" value={formData.agency_name} editable={isEditing} onChange={(value) => handleChange('agency_name', value)} />
                    <Field label="Ville" value={formData.city} editable={isEditing} onChange={(value) => handleChange('city', value)} />
                    <div className="md:col-span-2">
                        <Field label="Adresse Complète" value={formData.address} editable={isEditing} onChange={(value) => handleChange('address', value)} />
                    </div>
                </div>
            </div>

            {/* CONTACT & HORAIRES */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} className="text-red-500" /> Contact & Horaires
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Téléphone" value={formData.phone} editable={isEditing} onChange={(value) => handleChange('phone', value)} />
                    <Field label="Email de Contact" value={formData.email} editable={isEditing} onChange={(value) => handleChange('email', value)} />
                    <Field label="Heure d'Ouverture" value={formData.time_start} icon={<Globe size={14}/>} editable={isEditing} onChange={(value) => handleChange('time_start', value)} />
                    <Field label="Heure de Fermeture" value={formData.time_end} icon={<Globe size={14}/>} editable={isEditing} onChange={(value) => handleChange('time_end', value)} />
                </div>
            </div>

            {/* RÉSEAUX SOCIAUX */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Share2 size={14} className="text-red-500" /> Réseaux Sociaux
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SocialField icon={<Globe size={14}/>} value={formData.instagram} editable={isEditing} onChange={(value) => handleChange('instagram', value)} />
                    <SocialField icon={<Share2 size={14}/>} value={formData.facebook} editable={isEditing} onChange={(value) => handleChange('facebook', value)} />
                    <SocialField icon={<Globe size={14}/>} value={formData.website} editable={isEditing} onChange={(value) => handleChange('website', value)} placeholder="Site Web" />
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value, icon, editable = false, onChange }) => (
    <div className="space-y-2 relative">
        <label className="text-xs text-gray-400 ml-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
            <input
                type="text"
                className={`ac-input-dark ${icon ? 'pl-10' : ''}`}
                value={value || ''}
                readOnly={!editable}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    </div>
);

const SocialField = ({ icon, value, editable = false, onChange, placeholder = 'Non défini' }) => (
    <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input
            type="text"
            className="ac-input-dark pl-10 text-xs"
            value={value || ''}
            placeholder={placeholder}
            readOnly={!editable}
            onChange={(e) => onChange?.(e.target.value)}
        />
    </div>
);

export default AgencyDetailsForm;