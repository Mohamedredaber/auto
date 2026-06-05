import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgencyProfile } from '../../../features/agency/agencyProfileThunks';
import { selectAgencyData, selectAgencyLoading } from '../../../features/agency/agencyProfileSelectors';

import ProfileHero from './components/ProfileHero';
import VerificationStatus from './components/VerificationStatus';
// import VisibilityStats from './components/VisibilityStats';
import AgencyDetailsForm from './components/AgencyDetailsForm';
import './AgencyProfile.css';

const AgencyProfilePage = () => {
    const dispatch = useDispatch();
    const agency = useSelector(selectAgencyData);
    const loading = useSelector(selectAgencyLoading);

    useEffect(() => {
        dispatch(fetchAgencyProfile());
    }, [dispatch]);

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="loader"></div></div>;

    return (
        <div className="animate-fade-in space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto text-white">
            <div>
                <h1 className="text-2xl font-bold">Profil de l'Agence</h1>
                <p className="text-gray-400 text-sm">Configurez et gérez l'identité de votre entreprise sur la plateforme.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Colonne de Gauche */}
                <div className="lg:col-span-4 space-y-6">
                    <ProfileHero agency={agency} />
                    <VerificationStatus status={agency?.is_verified} />
                    {/* <VisibilityStats views="1,284" /> */}
                </div>

                {/* Colonne de Droite */}
                <div className="lg:col-span-8">
                    <AgencyDetailsForm agency={agency} />
                </div>
            </div>
        </div>
    );
};

export default AgencyProfilePage;