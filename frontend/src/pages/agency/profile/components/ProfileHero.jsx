import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';

const ProfileHero = ({ agency }) => (
    <div className="ac-card flex flex-col items-center text-center pt-10 pb-6 relative overflow-hidden">
        <div className="absolute top-0 h-24 w-full bg-gradient-to-b from-red-900/20 to-transparent"></div>
        <div className="relative">
            <img 
                src={agency?.logo_url || 'https://via.placeholder.com/150'} 
                className="w-32 h-32 rounded-full object-cover border-4 border-[#1a1c1e] shadow-2xl"
                alt="Logo"
            />
        </div>
        <h2 className="mt-4 text-xl font-bold flex items-center gap-2">
            {agency?.agency_name}
            {agency?.is_verified === 'verified' && <ShieldCheck className="text-green-500 w-5 h-5" />}
        </h2>
        <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
            <MapPin size={14} /> {agency?.city}, Maroc
        </p>
        <div className="flex gap-2 mt-4">
            <span className="bg-gray-800 text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">Location Premium</span>
            <span className="bg-gray-800 text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">Support 24/7</span>
        </div>
    </div>
);

export default ProfileHero;