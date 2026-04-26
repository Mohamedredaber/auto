import React from 'react';
import { ShieldCheck } from 'lucide-react';

const VerificationStatus = ({ isVerified }) => (
    <div className={`ac-card border-l-4 ${isVerified ? 'border-green-500/50' : 'border-orange-500/50'} bg-gradient-to-r from-green-500/5 to-transparent`}>
        <div className="flex gap-4">
            <div className={`p-2 rounded-lg h-fit ${isVerified ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                <ShieldCheck className={isVerified ? 'text-green-500' : 'text-orange-500'} />
            </div>
            <div>
                <h4 className="font-semibold text-sm">Statut de Vérification</h4>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Votre agence est certifiée AutoConnect. Nos clients bénéficient de l'assurance garantie.
                </p>
                <p className="text-[10px] text-green-500 mt-2">Dernière vérification : 12 Mai 2024</p>
            </div>
        </div>
    </div>
);

export default VerificationStatus;