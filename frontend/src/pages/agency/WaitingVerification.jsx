import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Clock, ShieldCheck } from 'lucide-react'; // إيلا كنتي خدام بـ lucide-react
import {logoutThunk} from '../../features/auth/authThunks'; // تأكد من المسار الصحيح
import { useDispatch } from 'react-redux';
const WaitingVerification = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlelogout = () => {
    dispatch(logoutThunk());
  }
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 font-body">
      <div className="max-w-2xl w-full bg-[#141414] border border-[#2A2A2A] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444] opacity-5 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#1F293722] border border-[#EF444444] rounded-2xl flex items-center justify-center mb-8">
            <Clock className="w-10 h-10 text-[#EF4444] animate-pulse" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
            Vérification en <span className="text-[#EF4444]">Cours</span>
          </h1>
          
          <p className="text-[#D1D5DB] text-lg mb-8 max-w-md">
            Votre demande d'adhésion à <strong>AutoConnect</strong> est bien reçue. 
            Notre équipe vérifie actuellement vos informations pour garantir la sécurité de la plateforme.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
            <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A] flex items-center gap-4">
              <ShieldCheck className="text-[#10B981] w-6 h-6" />
              <div className="text-left">
                <p className="text-xs text-[#6B7280] uppercase font-bold">Statut</p>
                <p className="text-sm text-white font-semibold">En attente</p>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A] flex items-center gap-4">
              <Clock className="text-[#F59E0B] w-6 h-6" />
              <div className="text-left">
                <p className="text-xs text-[#6B7280] uppercase font-bold">Délai estimé</p>
                <p className="text-sm text-white font-semibold">24h - 48h</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-bold hover:bg-[#D1D5DB] transition-all"
            >
              <Home size={20} />
              Retour à l'accueil
            </button>
            
            <button 
              onClick={() => {handlelogout()}}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1A1A1A] text-white border border-[#2A2A2A] rounded-xl font-bold hover:bg-[#222222] transition-all"
            >
              <LogOut size={20} />
              Se déconnecter
            </button>
          </div>

          <p className="mt-8 text-xs text-[#6B7280]">
            Besoin d'aide ? <a href="mailto:support@autoconnect.ma" className="text-[#EF4444] hover:underline">Contactez le support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingVerification;