
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const VerificationStatus = ({ status }) => {
    const isVerified = status === 'verified';
    const isWaiting = status === 'wait';

    const borderClass = isVerified
        ? 'border-green-500/50'
        : isWaiting
            ? 'border-orange-500/50'
            : 'border-red-500/50';

    const iconClass = isVerified
        ? 'bg-green-500/10 text-green-500'
        : isWaiting
            ? 'bg-orange-500/10 text-orange-500'
            : 'bg-red-500/10 text-red-500';

    const title = isVerified
        ? 'Statut de Vérification'
        : isWaiting
            ? 'Vérification en attente'
            : 'Vérification refusée';

    const message = isVerified
        ? "Votre agence est certifiée AutoConnect. Nos clients bénéficient de l'assurance garantie."
        : isWaiting
            ? 'Votre agence est en attente de validation par notre équipe.'
            : 'Votre agence a été refusée. Contactez le support pour plus de détails.';

    const footer = isVerified
        ? 'Dernière vérification : 12 Mai 2024'
        : isWaiting
            ? 'Statut actuel : en attente'
            : 'Statut actuel : refusée';

    return (
    <div className={`ac-card border-l-4 ${borderClass} bg-gradient-to-r from-green-500/5 to-transparent`}>
        <div className="flex gap-4">
            <div className={`p-2 rounded-lg h-fit ${iconClass}`}>
                <ShieldCheck className={isVerified ? 'text-green-500' : isWaiting ? 'text-orange-500' : 'text-red-500'} />
            </div>
            <div>
                <h4 className="font-semibold text-sm text-white">{title}</h4>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    {message}
                </p>
                <p className={`text-[10px] mt-2 ${isVerified ? 'text-green-500' : isWaiting ? 'text-orange-500' : 'text-red-500'}`}>{footer}</p>
            </div>
        </div>
    </div>
    );
};

export default VerificationStatus;