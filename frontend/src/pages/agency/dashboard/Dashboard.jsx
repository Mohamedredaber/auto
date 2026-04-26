import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { logoutThunk } from "../../../features/auth/authThunks";
import useAuth from "../../../hooks/useAuth";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/", { replace: true });
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const statCards = [
    { label: "Véhicules actifs", value: "0", subtitle: "En catalogue", icon: Car },
    { label: "Réservations", value: "0", subtitle: "Ce mois", icon: Calendar },
    { label: "Clients", value: "0", subtitle: "Enregistrés", icon: Users },
    { label: "Revenus", value: "0 MAD", subtitle: "Mensuel", icon: TrendingUp },
  ];

  return (
    <div className="animate-fade-in space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard size={22} className="text-red-500" />
            Tableau de Bord Agence
          </h1>
          <p className="text-gray-400 text-sm">
            Agence: {user?.first_name} {user?.last_name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-exporter inline-flex items-center gap-2"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statCards.map(({ label, value, subtitle, icon: Icon }) => (
              <div key={label} className="ac-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <Icon size={18} className="text-red-500" />
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              </div>
            ))}
          </div>

          <div className="ac-card space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Settings size={16} className="text-red-500" />
              Gestion de l'agence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button className="btn-exporter" onClick={() => navigateTo("/dashboard/agency/cars")}>
                Mes Véhicules
              </button>
              <button className="btn-exporter" onClick={() => navigateTo("/dashboard/agency/reservations")}>
                Réservations
              </button>
              <button className="btn-exporter" onClick={() => navigateTo("/dashboard/agency/clients")}>
                Mes Clients
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="ac-card space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-red-500" />
              Etat de l'agence
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Systeme actif</p>
              <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Paiements actives</p>
              <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Notifications actives</p>
              <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Profil verifie</p>
            </div>
          </div>
          <div className="ac-card">
            <h3 className="font-semibold text-white mb-3">Activite recente</h3>
            <p className="text-sm text-gray-500">Aucune activite recente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
