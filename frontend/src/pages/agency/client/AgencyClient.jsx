import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";

import {
  fetchAgencyClients,
  fetchAgencyRecentClients,
  fetchAgencyClientStats,
} from "../../../features/agency/agencyClientsThunks";
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsMeta,
  selectClientsFilters,
  selectRecentClients,
  selectClientStats,
} from "../../../features/agency/clientSelectors";

import ClientStatCards   from "./components/ClientStatCards";
import RecentClientsPanel from "./components/RecentClientsPanel";
import ClientsTable      from "./components/ClientsTable";
import "./styles/agency-clients.css";

export default function AgencyClient() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAgencyClients());
    dispatch(fetchAgencyRecentClients());
    dispatch(fetchAgencyClientStats());
  }, [dispatch]);

  const clients      = useSelector(selectAllClients);
  const loading      = useSelector(selectClientsLoading);
  const meta         = useSelector(selectClientsMeta);
  const filters      = useSelector(selectClientsFilters);
  const recentClients = useSelector(selectRecentClients);
  const clientStats  = useSelector(selectClientStats);

  if (loading && !clients?.length) {
    return (
      <div className="agency-clients">
        <div className="agency-clients__loading">
          <div className="ac-spinner" />
          <span>Chargement des clients…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="agency-clients animate-fade-in">

      <div className="agency-clients__header ac-card">
        <div className="agency-clients__heading">
          <h1 className="text-white flex items-center gap-2">
            <Users size={20} className="text-red-500" />
            Clients
          </h1>
          <p>Gérez et suivez l'ensemble de vos clients et leurs réservations.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <ClientStatCards clientStats={clientStats} clients={clients} />

      {/* ── Layout : Recent + Table ── */}
      <div className="ac-layout">
        <RecentClientsPanel recentClients={recentClients} />
        <ClientsTable
          clients={clients}
          meta={meta}
          filters={filters}
          loading={loading}
        />
      </div>

    </div>
  );
}