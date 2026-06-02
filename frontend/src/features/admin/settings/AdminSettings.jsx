import React from 'react';
import { User, Lock, Bell, Save } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400 mt-1">Gérez vos préférences et paramètres de sécurité.</p>
      </div>
      
      {/* Profile Section */}
      <div className="ac-card">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Profil Admin</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet</label>
            <input type="text" className="ac-input w-full" defaultValue="System Admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input type="email" className="ac-input w-full" defaultValue="super@autoconnect.com" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="ac-btn ac-btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Enregistrer les modifications
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="ac-card">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Sécurité</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mot de passe actuel</label>
            <input type="password" className="ac-input w-full" placeholder="••••••••" />
          </div>
          <div className="hidden md:block"></div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nouveau mot de passe</label>
            <input type="password" className="ac-input w-full" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Confirmer le mot de passe</label>
            <input type="password" className="ac-input w-full" placeholder="••••••••" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="ac-btn ac-btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Mettre à jour le mot de passe
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="ac-card">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Préférences de notification</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Nouvelles agences</p>
              <p className="text-sm text-gray-400">Recevoir un email lors de l'inscription d'une nouvelle agence.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Nouvelles voitures (en attente)</p>
              <p className="text-sm text-gray-400">Recevoir une alerte quand une voiture nécessite une validation.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Rapports mensuels</p>
              <p className="text-sm text-gray-400">Recevoir un résumé des statistiques par email.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
